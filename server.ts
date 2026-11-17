import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { evaluateAndUpgradeFrenchResponse } from './src/utils/scoring.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // 1. Evaluate & 3-Tier Upgrade Open-Ended French Spoken/Written Response
  app.post('/api/ai/evaluate-response', async (req, res) => {
    const { rawInput, scenarioTitle, promptTask, idealB2, idealC1, darijaTip } = req.body || {};
    if (!rawInput || typeof rawInput !== 'string') {
      res.status(400).json({ error: 'rawInput is required' });
      return;
    }

    // Compute baseline heuristic evaluation first
    const heuristic = evaluateAndUpgradeFrenchResponse(rawInput, {
      title: scenarioTitle,
      idealB2,
      idealC1,
      darijaTip,
    });

    const ai = getGenAIClient();
    if (!ai) {
      res.json({ source: 'heuristic-engine', evaluation: heuristic });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Tu es un examinateur officiel Pipplet / Versant / Harver pour le recrutement BPO francophone au Portugal (Teleperformance, Foundever, Concentrix, BNP Paribas) et un coach bilingue Français / Darija marocaine.

Scénario : ${scenarioTitle || 'Réponse Service Client BPO'}
Consigne : ${promptTask || 'Répondre avec professionnalisme et empathie au client.'}
Réponse du candidat : """${rawInput}"""

Analyse cette réponse et retourne un objet JSON contenant :
1) versionB2 : Version corrigée professionnelle niveau B2 sans fautes.
2) versionC1 : Version C1/C2 "Top 1% Recruiter Magnet" utilisant des connecteurs soutenus (Bien que + subjonctif, Par conséquent, Conformément à, Nous vous prions de bien vouloir nous excuser).
3) darijaExplanation : Explication claire, chaleureuse et pédagogique en Darija marocaine (écrite en alphabet arabe واضح بالدارجة المغربية) expliquant les erreurs commises et l'astuce pour décrocher C1 lors du test au Portugal.
4) frenchRuleSummary : Résumé concis de la règle grammaticale et stylistique en français.
5) pronunciationScore (0-100), fluencyScore (0-100), coherenceScore (0-100), grammarScore (0-100).
6) overallCefr : "A1" | "A2" | "B1" | "B2" | "C1" | "C2".
7) detectedWeaknesses : Liste de 1 à 3 points précis à travailler.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              versionB2: { type: Type.STRING },
              versionC1: { type: Type.STRING },
              darijaExplanation: { type: Type.STRING },
              frenchRuleSummary: { type: Type.STRING },
              pronunciationScore: { type: Type.NUMBER },
              fluencyScore: { type: Type.NUMBER },
              coherenceScore: { type: Type.NUMBER },
              grammarScore: { type: Type.NUMBER },
              overallCefr: { type: Type.STRING },
              detectedWeaknesses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      const overallScore = Math.round(
        ((parsed.pronunciationScore ?? heuristic.cefrCriteria.pronunciation) +
          (parsed.fluencyScore ?? heuristic.cefrCriteria.fluency) +
          (parsed.coherenceScore ?? heuristic.cefrCriteria.coherence) +
          (parsed.grammarScore ?? heuristic.cefrCriteria.grammar)) /
          4
      );

      res.json({
        source: 'gemini-ai',
        evaluation: {
          ...heuristic,
          versionB2: parsed.versionB2 || heuristic.versionB2,
          versionC1: parsed.versionC1 || heuristic.versionC1,
          darijaExplanation: parsed.darijaExplanation || heuristic.darijaExplanation,
          frenchRuleSummary: parsed.frenchRuleSummary || heuristic.frenchRuleSummary,
          cefrCriteria: {
            pronunciation: parsed.pronunciationScore ?? heuristic.cefrCriteria.pronunciation,
            fluency: parsed.fluencyScore ?? heuristic.cefrCriteria.fluency,
            coherence: parsed.coherenceScore ?? heuristic.cefrCriteria.coherence,
            grammar: parsed.grammarScore ?? heuristic.cefrCriteria.grammar,
          },
          overallCefr: parsed.overallCefr || heuristic.overallCefr,
          overallScore,
          detectedWeaknesses:
            Array.isArray(parsed.detectedWeaknesses) && parsed.detectedWeaknesses.length > 0
              ? parsed.detectedWeaknesses
              : heuristic.detectedWeaknesses,
        },
      });
    } catch (error) {
      // Fallback cleanly to heuristic evaluation if API fails or quota is reached
      res.json({ source: 'heuristic-fallback', evaluation: heuristic });
    }
  });

  // 2. Dynamically Generate Unlimited New BPO Scenarios via Gemini
  app.post('/api/ai/generate-scenario', async (req, res) => {
    const { type = 'written', sector = 'E-Commerce & Logistique VIP' } = req.body || {};
    const ai = getGenAIClient();

    if (!ai) {
      res.json({
        source: 'builtin-generator',
        scenario: {
          id: `gen-${Date.now()}`,
          type,
          title: `Scénario Généré : Litige ${sector} (Lisbonne / Paris)`,
          companyContext: `Centre d'Excellence Francophone Portugal — Pôle ${sector}`,
          cefrTarget: 'C1',
          customerVoiceScript:
            "Bonjour, je vous contacte car ma commande professionnelle #PR-5582 livrée ce matin à Lyon est incomplète : il manque deux écrans sur les cinq facturés, alors que nos nouveaux collaborateurs prennent leur poste demain matin !",
          promptTask:
            "Répondez au client pour : 1) Présenter vos excuses professionnelles au nom de l'entreprise, 2) Confirmer l'expédition express par transporteur dédié avant demain 10h00, 3) Accorder un avoir commercial de 15% sur la facture.",
          prepSeconds: type === 'spoken' ? 30 : 0,
          responseSeconds: type === 'spoken' ? 90 : 300,
          keyPointsToCover: [
            'Salutation corporate + reconnaissance de l’urgence opérationnelle',
            'Expédition express garantie avant demain 10h00',
            'Avoir commercial de 15% + excuses soutenues',
          ],
          idealB2:
            "Bonjour Madame, Monsieur, nous vous prions de bien vouloir nous excuser pour la livraison incomplète de votre commande #PR-5582. Conscients de l'urgence pour l'arrivée de vos collaborateurs demain, nous venons d'expédier les deux écrans manquants par coursier express pour une livraison demain avant 10h00. De plus, nous appliquons une remise de 15 % sur votre facture.",
          idealC1:
            "Bonjour Madame, Monsieur, nous accusons réception de votre signalement relatif à la commande #PR-5582 et mesurons pleinement l'impact de cet oubli à la veille de l'intégration de vos collaborateurs. Soyez assuré(e) que j'ai immédiatement déclenché un affrètement prioritaire afin que les deux moniteurs manquants vous soient livrés demain matin avant 10h00. En guise de dédommagement, un avoir de 15 % a été crédité sur votre compte client.",
          darijaTip:
            'فهاد السيناريو الجديد، ركز على السرعة ("affrètement prioritaire avant 10h00") والتعويض التجاري ("en guise de dédommagement, un avoir de 15%").',
        },
      });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Génère un nouveau scénario d'examen Pipplet (${type === 'spoken' ? 'Oral' : 'Écrit E-mail'}) pour le recrutement dans un centre d'appels / BPO francophone au Portugal dans le secteur "${sector}". Retourne un JSON complet avec une explication en Darija marocaine (alphabet arabe).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              companyContext: { type: Type.STRING },
              customerVoiceScript: { type: Type.STRING },
              promptTask: { type: Type.STRING },
              keyPointsToCover: { type: Type.ARRAY, items: { type: Type.STRING } },
              idealB2: { type: Type.STRING },
              idealC1: { type: Type.STRING },
              darijaTip: { type: Type.STRING },
            },
          },
        },
      });
      const data = JSON.parse((response.text ?? '{}').trim());
      res.json({
        source: 'gemini-ai',
        scenario: {
          id: `ai-${Date.now()}`,
          type,
          title: data.title || `Scénario IA : ${sector}`,
          companyContext: data.companyContext || `BPO Portugal — ${sector}`,
          cefrTarget: 'C1',
          customerVoiceScript: data.customerVoiceScript,
          promptTask: data.promptTask,
          prepSeconds: type === 'spoken' ? 30 : 0,
          responseSeconds: type === 'spoken' ? 90 : 300,
          keyPointsToCover: data.keyPointsToCover || ['Accueil empathique', 'Solution concrète', 'Politesse C1'],
          idealB2: data.idealB2,
          idealC1: data.idealC1,
          darijaTip: data.darijaTip,
        },
      });
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de la génération IA' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FR-PRO PORTUGAL Server running on http://localhost:${PORT}`);
  });
}

startServer();
