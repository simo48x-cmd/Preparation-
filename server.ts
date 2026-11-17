import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { evaluateAndUpgradeFrenchResponse, buildModalityCriteriaBars } from './src/utils/scoring.ts';
import { TP_PORTUGAL_SCENARIO_POOL } from './src/data/tpPortugalBank.ts';

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
    const {
      rawInput,
      scenarioTitle,
      promptTask,
      idealB2,
      idealC1,
      darijaTip,
      modality = 'written',
      recordedDurationSeconds = 0,
    } = req.body || {};

    if (!rawInput || typeof rawInput !== 'string') {
      res.status(400).json({ error: 'rawInput is required' });
      return;
    }

    const safeModality: 'written' | 'spoken' = modality === 'spoken' ? 'spoken' : 'written';

    // Compute baseline heuristic evaluation first
    const heuristic = evaluateAndUpgradeFrenchResponse(rawInput, {
      title: scenarioTitle,
      idealB2,
      idealC1,
      darijaTip,
      modality: safeModality,
      recordedDurationSeconds: Number(recordedDurationSeconds) || 0,
    });

    const ai = getGenAIClient();
    if (!ai) {
      res.json({ source: 'heuristic-engine', evaluation: heuristic });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Tu es un examinateur officiel Pipplet / Versant / Harver pour le recrutement chez Teleperformance Portugal (Lisbonne - Programme Atlantic Experience) et un coach bilingue Français / Darija marocaine.

Modalité : ${safeModality === 'spoken' ? 'ORAL (Réponse Vocale)' : 'ÉCRIT (E-mail / Ticket Service Client)'}
Scénario : ${scenarioTitle || 'Réponse Service Client BPO'}
Consigne : ${promptTask || 'Répondre avec professionnalisme et empathie au client.'}
Réponse du candidat : """${rawInput}"""

Analyse cette réponse et retourne un objet JSON contenant :
1) versionB2 : Version corrigée professionnelle niveau B2 sans fautes.
2) versionC1 : Version C1/C2 "Top 1% Recruiter Magnet" utilisant des connecteurs soutenus ("Bien que + subjonctif", "Par conséquent", "Conformément à", "Nous vous prions de bien vouloir nous excuser").
3) darijaExplanation : Explication claire, chaleureuse et pédagogique en Darija marocaine (écrite en alphabet arabe واضح بالدارجة المغربية) expliquant les erreurs commises et l'astuce pour décrocher C1 chez Teleperformance Portugal. Mets les expressions françaises entre guillemets (ex: "Par conséquent").
4) frenchRuleSummary : Résumé concis de la règle grammaticale et stylistique en français.
5) pronunciationScore (0-100), fluencyScore (0-100), coherenceScore (0-100), grammarScore (0-100), spellingScore (0-100), vocabularyScore (0-100).
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
              spellingScore: { type: Type.NUMBER },
              vocabularyScore: { type: Type.NUMBER },
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
      const mergedCriteria = {
        pronunciation: parsed.pronunciationScore ?? heuristic.cefrCriteria.pronunciation ?? 75,
        fluency: parsed.fluencyScore ?? heuristic.cefrCriteria.fluency ?? 75,
        coherence: parsed.coherenceScore ?? heuristic.cefrCriteria.coherence,
        grammar: parsed.grammarScore ?? heuristic.cefrCriteria.grammar,
        grammarSyntax: parsed.grammarScore ?? heuristic.cefrCriteria.grammarSyntax ?? heuristic.cefrCriteria.grammar,
        orthographyAccents: parsed.spellingScore ?? heuristic.cefrCriteria.orthographyAccents ?? 82,
        lexicalRichness: parsed.vocabularyScore ?? heuristic.cefrCriteria.lexicalRichness ?? 80,
      };

      const overallScore =
        safeModality === 'written'
          ? Math.round(
              (mergedCriteria.grammarSyntax +
                mergedCriteria.orthographyAccents +
                mergedCriteria.lexicalRichness +
                mergedCriteria.coherence) /
                4
            )
          : Math.round(
              (mergedCriteria.pronunciation +
                mergedCriteria.fluency +
                mergedCriteria.coherence +
                mergedCriteria.grammar) /
                4
            );

      res.json({
        source: 'gemini-ai',
        evaluation: {
          ...heuristic,
          modality: safeModality,
          versionB2: parsed.versionB2 || heuristic.versionB2,
          versionC1: parsed.versionC1 || heuristic.versionC1,
          darijaExplanation: parsed.darijaExplanation || heuristic.darijaExplanation,
          frenchRuleSummary: parsed.frenchRuleSummary || heuristic.frenchRuleSummary,
          cefrCriteria: mergedCriteria,
          modalityCriteriaBars: buildModalityCriteriaBars(safeModality, mergedCriteria),
          overallCefr: parsed.overallCefr || heuristic.overallCefr,
          overallScore,
          detectedWeaknesses:
            Array.isArray(parsed.detectedWeaknesses) && parsed.detectedWeaknesses.length > 0
              ? parsed.detectedWeaknesses
              : heuristic.detectedWeaknesses,
        },
      });
    } catch {
      res.json({ source: 'heuristic-fallback', evaluation: heuristic });
    }
  });

  // 2. Dynamically Generate Unlimited New BPO Scenarios via Gemini + TP Portugal Fallback
  app.post('/api/ai/generate-scenario', async (req, res) => {
    const {
      type = 'written',
      sector = 'Fintech & Néo-Banque',
      excludeIds = [],
    } = req.body || {};

    const safeType: 'written' | 'spoken' = type === 'spoken' ? 'spoken' : 'written';
    const matchingPool = TP_PORTUGAL_SCENARIO_POOL.filter(
      (s) => s.type === safeType && !excludeIds.includes(s.id)
    );
    const fallbackCandidate =
      matchingPool.length > 0
        ? matchingPool[Math.floor(Math.random() * matchingPool.length)]
        : TP_PORTUGAL_SCENARIO_POOL.find((s) => s.type === safeType) || TP_PORTUGAL_SCENARIO_POOL[0];

    const ai = getGenAIClient();
    if (!ai) {
      res.json({
        source: 'tp-portugal-pool',
        scenario: {
          ...fallbackCandidate,
          id: `tp-local-${Date.now()}`,
        },
      });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Génère un nouveau scénario d'examen Pipplet (${safeType === 'spoken' ? 'Oral' : 'Écrit E-mail'}) pour le recrutement chez Teleperformance Portugal (Lisbonne - Atlantic Experience) dans le secteur "${sector}". Retourne un JSON complet avec une explication en Darija marocaine (alphabet arabe) mettant les termes français entre guillemets.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              companyContext: { type: Type.STRING },
              projectTag: { type: Type.STRING },
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
          type: safeType,
          projectTag: data.projectTag || sector,
          title: data.title || fallbackCandidate.title,
          companyContext: data.companyContext || fallbackCandidate.companyContext,
          cefrTarget: 'C1',
          customerVoiceScript: data.customerVoiceScript || fallbackCandidate.customerVoiceScript,
          promptTask: data.promptTask || fallbackCandidate.promptTask,
          prepSeconds: safeType === 'spoken' ? 30 : 0,
          responseSeconds: safeType === 'spoken' ? 90 : 300,
          keyPointsToCover:
            Array.isArray(data.keyPointsToCover) && data.keyPointsToCover.length > 0
              ? data.keyPointsToCover
              : fallbackCandidate.keyPointsToCover,
          idealB2: data.idealB2 || fallbackCandidate.idealB2,
          idealC1: data.idealC1 || fallbackCandidate.idealC1,
          darijaTip: data.darijaTip || fallbackCandidate.darijaTip,
        },
      });
    } catch {
      res.json({
        source: 'tp-portugal-fallback',
        scenario: {
          ...fallbackCandidate,
          id: `tp-fallback-${Date.now()}`,
        },
      });
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
