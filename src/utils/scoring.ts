/**
 * Pure psychometric scoring, speech metrics, Versant 20-80 calculation,
 * EF SET Computerized Adaptive Testing (CAT) difficulty algorithm,
 * and Modality-Aware (Written vs. Spoken) 3-Tier French Answer Upgrader engine.
 */

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type EvaluationModality = 'written' | 'spoken';

export interface HighlightedSegment {
  text: string;
  type: 'normal' | 'error' | 'informal' | 'accent';
  suggestion?: string;
  reason?: string;
}

export interface ModalityCriterionBar {
  key: string;
  label: string;
  score: number; // 0-100
}

export interface ThreeTierUpgradeResult {
  rawInput: string;
  modality: EvaluationModality;
  highlightedSegments: HighlightedSegment[];
  versionB2: string;
  versionC1: string;
  darijaExplanation: string;
  frenchRuleSummary: string;
  criteriaBars: ModalityCriterionBar[];
  cefrCriteria: {
    grammar: number;              // 0-100
    coherence: number;            // 0-100
    pronunciation?: number;       // 0-100 (Spoken only)
    fluency?: number;             // 0-100 (Spoken only)
    grammarSyntax?: number;       // 0-100 (Written)
    orthographyAccents?: number;  // 0-100 (Written)
    lexicalRichness?: number;     // 0-100 (Written)
  };
  overallCefr: CEFRLevel;
  overallScore: number; // 0-100
  detectedWeaknesses: string[];
}

export interface SpeechMetricsResult {
  matchAccuracy: number; // 0-100
  wpm: number;
  fillerCount: number;
  detectedFillers: string[];
  confidenceRhythmScore: number; // 0-100
  wordDiff: Array<{ word: string; matched: boolean }>;
}

export interface VersantDiagnostic {
  overallScore: number; // 20 - 80 scale
  cefr: CEFRLevel;
  sentenceMastery: number; // 20 - 80
  vocabulary: number;      // 20 - 80
  fluency: number;         // 20 - 80
  pronunciation: number;   // 20 - 80
}

const FRENCH_FILLERS = ['euh', 'ben', 'bah', 'genre', 'du coup', 'en fait', 'voilà', 'quoi'];

const ACCENT_FIX_MAP: Record<string, { correct: string; reason: string }> = {
  desole: { correct: 'désolé', reason: 'Accent aigu manquant sur les "e" de désolé' },
  reclamation: { correct: 'réclamation', reason: 'Accent aigu requis : réclamation' },
  probleme: { correct: 'problème', reason: 'Accent grave requis : problème' },
  tres: { correct: 'très', reason: 'Accent grave requis : très' },
  deja: { correct: 'déjà', reason: 'Accents requis : déjà' },
  apres: { correct: 'après', reason: 'Accent grave requis : après' },
  etre: { correct: 'être', reason: 'Accent circonflexe requis : être' },
  meme: { correct: 'même', reason: 'Accent circonflexe requis : même' },
  reglement: { correct: 'règlement', reason: 'Accent grave requis : règlement' },
  numero: { correct: 'numéro', reason: 'Accent aigu requis : numéro' },
  verifier: { correct: 'vérifier', reason: 'Accent aigu requis : vérifier' },
  repond: { correct: 'répond', reason: 'Accent aigu requis : répond' },
  telephoner: { correct: 'téléphoner', reason: 'Accents aigus requis : téléphoner' },
  reçu: { correct: 'reçu', reason: 'Cédille correcte' },
  recu: { correct: 'reçu', reason: 'Cédille manquante : reçu' },
  ca: { correct: 'cela / ça', reason: 'Cédille manquante et registre familier' },
  delai: { correct: 'délai', reason: 'Accent aigu requis : délai' },
  depasse: { correct: 'dépassé', reason: 'Accents aigus requis : dépassé' },
  bloque: { correct: 'bloqué', reason: 'Accent aigu requis : bloqué' },
};

const INFORMAL_MAP: Record<string, { b2: string; c1: string; reason: string }> = {
  salut: {
    b2: 'Bonjour Madame, Monsieur,',
    c1: 'Bonjour Madame, Monsieur, je vous remercie de nous avoir contactés.',
    reason: 'Registre familier interdit en BPO ("Salut" -> "Bonjour Madame/Monsieur")',
  },
  bonjour: {
    b2: 'Bonjour Madame, Monsieur,',
    c1: 'Bonjour, je vous remercie pour votre message et comprends parfaitement votre situation.',
    reason: 'Peut être enrichi par une formule d’accueil BPO complète',
  },
  'je veux': {
    b2: 'Je souhaiterais',
    c1: 'Je me permets de solliciter / Je souhaiterais vivement',
    reason: 'Utilisez le conditionnel de politesse ("Je souhaiterais" au lieu de "Je veux")',
  },
  'je vais voir': {
    b2: 'Je vais vérifier votre dossier',
    c1: 'Je procède immédiatement à la vérification approfondie de votre dossier',
    reason: 'Formulation trop vague ("voir" -> "procéder à la vérification")',
  },
  'pas de soucis': {
    b2: 'Je vous en prie',
    c1: 'Soyez assuré(e) que nous mettons tout en œuvre pour vous satisfaire',
    reason: 'Expression familière déconseillée en service client corporate',
  },
  'du coup': {
    b2: 'Par conséquent',
    c1: 'De ce fait / Par conséquent',
    reason: 'Tic de langage oral ("du coup" -> "par conséquent" / "de ce fait")',
  },
};

const GRAMMAR_ERROR_PATTERNS: Array<{
  regex: RegExp;
  replacement: string;
  reason: string;
  weaknessTag: string;
}> = [
  {
    regex: /\bmalgré que\b/gi,
    replacement: 'bien que',
    reason: 'Faute classique BPO : "malgré que" est incorrect, utilisez "bien que + subjonctif" ou "malgré + nom"',
    weaknessTag: 'Subjonctif & Conjonctions (bien que vs malgré)',
  },
  {
    regex: /\bsi j'aurais\b/gi,
    replacement: 'si j’avais',
    reason: 'Règle d’or : les "si" n’aiment pas les "-rais" (Si + Imparfait -> Conditionnel)',
    weaknessTag: 'Hypothèse & Conditionnel (Si + Imparfait)',
  },
  {
    regex: /\bje vous appelle pour vous dire\b/gi,
    replacement: 'je vous contacte afin de vous informer',
    reason: 'Remplacez "pour vous dire" par "afin de vous informer"',
    weaknessTag: 'Registre Corporate & Connecteurs Formels',
  },
  {
    regex: /\bexcusez-moi pour le retard\b/gi,
    replacement: 'nous vous prions de bien vouloir nous excuser pour ce contretemps',
    reason: 'On ne s’excuse pas soi-même en français soutenu : "Veuillez nous excuser"',
    weaknessTag: 'Formules d’excuses professionnelles',
  },
];

export function scoreToCEFR(score0to100: number): CEFRLevel {
  if (score0to100 >= 90) return 'C2';
  if (score0to100 >= 78) return 'C1';
  if (score0to100 >= 62) return 'B2';
  if (score0to100 >= 45) return 'B1';
  if (score0to100 >= 28) return 'A2';
  return 'A1';
}

export function versantToCEFR(versant20to80: number): CEFRLevel {
  if (versant20to80 >= 75) return 'C2';
  if (versant20to80 >= 66) return 'C1';
  if (versant20to80 >= 55) return 'B2';
  if (versant20to80 >= 43) return 'B1';
  if (versant20to80 >= 32) return 'A2';
  return 'A1';
}

export function calculateVersantScore(subscores: {
  sentenceMastery: number; // 0-100
  vocabulary: number;      // 0-100
  fluency: number;         // 0-100
  pronunciation: number;   // 0-100
}): VersantDiagnostic {
  const clamp2080 = (pct: number) => Math.max(20, Math.min(80, Math.round(20 + (pct / 100) * 60)));
  const sm = clamp2080(subscores.sentenceMastery);
  const voc = clamp2080(subscores.vocabulary);
  const fl = clamp2080(subscores.fluency);
  const pr = clamp2080(subscores.pronunciation);

  const overallScore = Math.round(sm * 0.25 + voc * 0.25 + fl * 0.25 + pr * 0.25);
  return {
    overallScore,
    cefr: versantToCEFR(overallScore),
    sentenceMastery: sm,
    vocabulary: voc,
    fluency: fl,
    pronunciation: pr,
  };
}

export function calculateAdaptiveStep(params: {
  currentDifficulty: number;
  isCorrect: boolean;
  responseTimeSeconds: number;
  targetTimeSeconds?: number;
}): { nextDifficulty: number; estimatedCEFR: CEFRLevel } {
  const { currentDifficulty, isCorrect, responseTimeSeconds, targetTimeSeconds = 30 } = params;
  const speedBonus =
    responseTimeSeconds <= targetTimeSeconds * 0.5
      ? 25
      : responseTimeSeconds <= targetTimeSeconds
      ? 12
      : 4;
  let delta = 0;
  if (isCorrect) {
    delta = 42 + speedBonus;
  } else {
    delta = -48;
  }
  const nextDifficulty = Math.max(200, Math.min(800, currentDifficulty + delta));
  const normalizedPct = ((nextDifficulty - 200) / 600) * 100;
  return {
    nextDifficulty,
    estimatedCEFR: scoreToCEFR(normalizedPct),
  };
}

export function analyzeSpeechMetrics(params: {
  targetText: string;
  spokenTranscript: string;
  durationSeconds: number;
}): SpeechMetricsResult {
  const clean = (str: string) =>
    str
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()«»"']/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

  const targetWords = clean(params.targetText);
  const spokenWords = clean(params.spokenTranscript);
  const rawLower = params.spokenTranscript.toLowerCase();

  const detectedFillers: string[] = [];
  let fillerCount = 0;
  for (const filler of FRENCH_FILLERS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = rawLower.match(regex);
    if (matches && matches.length > 0) {
      fillerCount += matches.length;
      detectedFillers.push(`${filler} (×${matches.length})`);
    }
  }

  const spokenSet = new Set(spokenWords);
  let matchedCount = 0;
  const wordDiff = targetWords.map((w) => {
    const matched = spokenSet.has(w);
    if (matched) matchedCount++;
    return { word: w, matched };
  });

  const matchAccuracy =
    targetWords.length > 0
      ? Math.min(100, Math.round((matchedCount / targetWords.length) * 100))
      : 0;

  const safeDuration = Math.max(1, params.durationSeconds);
  const wpm = Math.round((spokenWords.length / safeDuration) * 60);

  let paceScore = 85;
  if (wpm >= 120 && wpm <= 165) paceScore = 96;
  else if (wpm >= 95 && wpm < 120) paceScore = 82;
  else if (wpm < 95 && spokenWords.length > 0) paceScore = 68;
  else if (spokenWords.length === 0) paceScore = 0;

  const fillerPenalty = Math.min(35, fillerCount * 7);
  const confidenceRhythmScore =
    spokenWords.length === 0
      ? 0
      : Math.max(
          20,
          Math.min(100, Math.round(matchAccuracy * 0.55 + paceScore * 0.45 - fillerPenalty))
        );

  return {
    matchAccuracy,
    wpm,
    fillerCount,
    detectedFillers,
    confidenceRhythmScore,
    wordDiff,
  };
}

export function buildModalityCriteriaBars(
  modality: EvaluationModality,
  scores: {
    grammarSyntax: number;
    orthographyAccents: number;
    lexicalRichness: number;
    coherence: number;
    pronunciation?: number;
    fluency?: number;
  }
): ModalityCriterionBar[] {
  if (modality === 'written') {
    return [
      {
        key: 'grammarSyntax',
        label: 'Grammaire & Syntaxe C1',
        score: scores.grammarSyntax,
      },
      {
        key: 'orthographyAccents',
        label: 'Orthographe & Accents Français',
        score: scores.orthographyAccents,
      },
      {
        key: 'lexicalRichness',
        label: 'Richesse Lexicale & Empathie BPO',
        score: scores.lexicalRichness,
      },
      {
        key: 'coherence',
        label: 'Cohérence & Structure Professionnelle',
        score: scores.coherence,
      },
    ];
  }

  return [
    {
      key: 'pronunciation',
      label: 'Prononciation & Phonétique',
      score: scores.pronunciation ?? 76,
    },
    {
      key: 'fluency',
      label: 'Fluidité & Débit (WPM)',
      score: scores.fluency ?? 74,
    },
    {
      key: 'coherence',
      label: 'Cohérence & Structure',
      score: scores.coherence,
    },
    {
      key: 'grammar',
      label: 'Grammaire & Lexique BPO',
      score: scores.grammarSyntax,
    },
  ];
}

export function evaluateAndUpgradeFrenchResponse(
  rawInput: string,
  scenarioContext?: {
    title?: string;
    modality?: EvaluationModality;
    recordedDurationSeconds?: number;
    idealB2?: string;
    idealC1?: string;
    darijaTip?: string;
  }
): ThreeTierUpgradeResult {
  const modality: EvaluationModality = scenarioContext?.modality || 'written';
  const trimmed = rawInput.trim();

  if (!trimmed) {
    const zeroBars = buildModalityCriteriaBars(modality, {
      grammarSyntax: 0,
      orthographyAccents: 0,
      lexicalRichness: 0,
      coherence: 0,
      pronunciation: 0,
      fluency: 0,
    });
    return {
      rawInput: '',
      modality,
      highlightedSegments: [],
      versionB2:
        scenarioContext?.idealB2 ||
        'Bonjour Madame, Monsieur, je prends immédiatement en charge votre demande.',
      versionC1:
        scenarioContext?.idealC1 ||
        'Bonjour Madame, Monsieur, je vous remercie de nous avoir contactés et vous prie de bien vouloir nous excuser pour ce désagrément.',
      darijaExplanation:
        scenarioContext?.darijaTip ||
        'فاش تكتب أولا تهضر فـ Pipplet ولا Harver، ديما بدا بـ Bonjour Madame, Monsieur و استعمل le Conditionnel de politesse بحال Je souhaiterais باش تبان بروفيسيونيل.',
      frenchRuleSummary:
        'Structurez votre réponse en 4 étapes : Accueil + Empathie + Action concrète + Prise de congé formelle.',
      criteriaBars: zeroBars,
      cefrCriteria:
        modality === 'written'
          ? {
              grammar: 0,
              coherence: 0,
              grammarSyntax: 0,
              orthographyAccents: 0,
              lexicalRichness: 0,
            }
          : {
              grammar: 0,
              coherence: 0,
              pronunciation: 0,
              fluency: 0,
            },
      overallCefr: 'A1',
      overallScore: 0,
      detectedWeaknesses: ['Réponse trop courte ou vide'],
    };
  }

  const tokens = trimmed.split(/(\s+)/);
  const highlightedSegments: HighlightedSegment[] = [];
  const detectedWeaknesses = new Set<string>();
  let accentErrors = 0;
  let informalHits = 0;
  let grammarHits = 0;

  for (const token of tokens) {
    const cleanWord = token.toLowerCase().replace(/[.,!?;:'"«»()]/g, '');
    if (cleanWord === 'malgré' && /\bmalgré que\b/i.test(trimmed)) {
      highlightedSegments.push({
        text: token,
        type: 'error',
        suggestion: 'bien que',
        reason: 'Faute grammaticale : "malgré que" -> "bien que + subjonctif"',
      });
    } else if (ACCENT_FIX_MAP[cleanWord] && cleanWord !== ACCENT_FIX_MAP[cleanWord].correct) {
      accentErrors++;
      detectedWeaknesses.add('Accents français & Orthographe');
      highlightedSegments.push({
        text: token,
        type: 'accent',
        suggestion: ACCENT_FIX_MAP[cleanWord].correct,
        reason: ACCENT_FIX_MAP[cleanWord].reason,
      });
    } else if (INFORMAL_MAP[cleanWord]) {
      informalHits++;
      detectedWeaknesses.add('Registre Corporate & Vouvoiement');
      highlightedSegments.push({
        text: token,
        type: 'informal',
        suggestion: INFORMAL_MAP[cleanWord].b2,
        reason: INFORMAL_MAP[cleanWord].reason,
      });
    } else {
      highlightedSegments.push({ text: token, type: 'normal' });
    }
  }

  for (const pattern of GRAMMAR_ERROR_PATTERNS) {
    if (pattern.regex.test(trimmed)) {
      grammarHits++;
      detectedWeaknesses.add(pattern.weaknessTag);
    }
  }

  // Count filler words for spoken tasks
  let fillerHits = 0;
  for (const filler of FRENCH_FILLERS) {
    const r = new RegExp(`\\b${filler}\\b`, 'gi');
    const m = trimmed.match(r);
    if (m) fillerHits += m.length;
  }
  if (fillerHits > 0 && modality === 'spoken') {
    detectedWeaknesses.add('Mots parasites à l’oral (euh, ben, du coup)');
  }

  const hasFormalConnectors =
    /\b(cependant|néanmoins|toutefois|par conséquent|afin de|en effet|conformément|en outre|par ailleurs|d'ores et déjà)\b/i.test(
      trimmed
    );
  const hasPoliteConditional =
    /\b(souhaiterais|aimerais|pourriez|serait|auriez|tiendrais)\b/i.test(trimmed);
  const hasSubjunctiveOrApology =
    /\b(veuillez|prions|bien que|afin que|navré|désolé|comprends|mesure|rassuré|excuser)\b/i.test(
      trimmed
    );
  const hasFrenchAccents = /[éèêëàâçùûîïôœ]/i.test(trimmed);

  if (!hasFormalConnectors) {
    detectedWeaknesses.add('Connecteurs logiques B2/C1 (toutefois, par conséquent, afin de)');
  }
  if (!hasPoliteConditional) {
    detectedWeaknesses.add('Conditionnel de politesse (je souhaiterais, pourriez-vous)');
  }

  const wordCount = trimmed.split(/\s+/).length;
  const lengthScore = Math.min(100, Math.round((wordCount / 32) * 85) + 15);

  const grammarSyntaxScore = Math.max(
    35,
    Math.min(
      98,
      82 -
        grammarHits * 14 -
        accentErrors * 4 +
        (hasPoliteConditional ? 9 : 0) +
        (hasSubjunctiveOrApology ? 6 : 0)
    )
  );

  const orthographyAccentsScore = Math.max(
    35,
    Math.min(99, 88 - accentErrors * 9 + (hasFrenchAccents ? 8 : -8))
  );

  const lexicalRichnessScore = Math.max(
    38,
    Math.min(
      98,
      Math.round(
        lengthScore * 0.45 +
          (hasSubjunctiveOrApology ? 28 : 14) +
          (hasFormalConnectors ? 22 : 10) -
          informalHits * 10
      )
    )
  );

  const coherenceScore = Math.max(
    40,
    Math.min(
      98,
      Math.round(lengthScore * 0.55 + (hasFormalConnectors ? 35 : 18) - informalHits * 8)
    )
  );

  // Spoken-only calculations based on actual duration, word count, and filler words
  const durationSec = Math.max(4, scenarioContext?.recordedDurationSeconds || 20);
  const spokenWpm = Math.round((wordCount / durationSec) * 60);
  const fluencyScore = Math.max(
    40,
    Math.min(
      96,
      Math.round(
        lengthScore * 0.55 +
          (spokenWpm >= 100 && spokenWpm <= 170 ? 34 : 22) -
          fillerHits * 8 -
          informalHits * 6
      )
    )
  );
  const pronunciationScore = Math.max(
    45,
    Math.min(96, 86 - fillerHits * 6 - informalHits * 5 + (hasSubjunctiveOrApology ? 5 : 0))
  );

  const criteriaBars = buildModalityCriteriaBars(modality, {
    grammarSyntax: grammarSyntaxScore,
    orthographyAccents: orthographyAccentsScore,
    lexicalRichness: lexicalRichnessScore,
    coherence: coherenceScore,
    pronunciation: pronunciationScore,
    fluency: fluencyScore,
  });

  const overallScore =
    modality === 'written'
      ? Math.round(
          (grammarSyntaxScore +
            orthographyAccentsScore +
            lexicalRichnessScore +
            coherenceScore) /
            4
        )
      : Math.round(
          (pronunciationScore + fluencyScore + coherenceScore + grammarSyntaxScore) / 4
        );

  let cleanB2 = trimmed;
  for (const [wrong, fix] of Object.entries(ACCENT_FIX_MAP)) {
    const r = new RegExp(`\\b${wrong}\\b`, 'gi');
    cleanB2 = cleanB2.replace(r, fix.correct);
  }
  for (const pat of GRAMMAR_ERROR_PATTERNS) {
    cleanB2 = cleanB2.replace(pat.regex, pat.replacement);
  }

  const versionB2 =
    scenarioContext?.idealB2 ||
    `Bonjour Madame, Monsieur,\n\nJe fais suite à votre message et comprends parfaitement votre préoccupation. ${cleanB2}\n\nJe reste à votre entière disposition pour tout complément d'information.\n\nCordialement,\nService Relation Client`;

  const versionC1 =
    scenarioContext?.idealC1 ||
    `Bonjour Madame, Monsieur,\n\nJe vous remercie d'avoir pris le temps de nous contacter. Bien que nous comprenions pleinement le désagrément occasionné, soyez assuré(e) que j'ai immédiatement pris en charge la régularisation de votre dossier. Par conséquent, une solution prioritaire vous a été appliquée dès aujourd'hui.\n\nNous vous prions de bien vouloir nous excuser pour ce contretemps et vous renouvelons notre engagement de qualité.\n\nTrès cordialement,\nL'Équipe Support Exécutif`;

  const darijaExplanation =
    scenarioContext?.darijaTip ||
    `باش تجيب C1 فـ Pipplet و Harver فـ البرتغال: 1) تفادى الكلمات العادية بحال Salut أو du coup وعوضهم بـ Par conséquent و Toutefois. 2) ديما استعمل le Conditionnel de politesse بحال Je souhaiterais و le Subjonctif مورا Bien que. 3) ما تنساش les accents français حيت كيطلعو النقطة بـ 15% فـ l'écrit!`;

  return {
    rawInput: trimmed,
    modality,
    highlightedSegments,
    versionB2,
    versionC1,
    darijaExplanation,
    frenchRuleSummary:
      'Utilisez le vouvoiement strict, des connecteurs logiques C1 (Toutefois, Par conséquent, Conformément à), et la formule "Nous vous prions de bien vouloir nous excuser".',
    criteriaBars,
    cefrCriteria:
      modality === 'written'
        ? {
            grammar: grammarSyntaxScore,
            coherence: coherenceScore,
            grammarSyntax: grammarSyntaxScore,
            orthographyAccents: orthographyAccentsScore,
            lexicalRichness: lexicalRichnessScore,
          }
        : {
            grammar: grammarSyntaxScore,
            coherence: coherenceScore,
            pronunciation: pronunciationScore,
            fluency: fluencyScore,
          },
    overallCefr: scoreToCEFR(overallScore),
    overallScore,
    detectedWeaknesses: Array.from(detectedWeaknesses),
  };
}
