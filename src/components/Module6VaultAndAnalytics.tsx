import React, { useState, useRef } from 'react';
import {
  Search,
  Volume2,
  Copy,
  Check,
  Mic,
  Sparkles,
  BookMarked,
  Zap,
  BarChart3,
  CheckCircle2,
  Languages,
} from 'lucide-react';
import {
  PORTUGUESE_BPO_CHEAT_VAULT,
  EMAIL_TEMPLATES,
  GRAMMAR_TRAPS,
} from '../data/assessmentBank';
import {
  EXTRA_CHEAT_VAULT_PHRASES,
  EXTRA_EMAIL_TEMPLATES,
  EXTRA_GRAMMAR_TRAPS,
  WEAKNESS_DESTROYER_DRILLS,
} from '../data/extendedBank';
import { analyzeSpeechMetrics, SpeechMetricsResult } from '../utils/scoring';
import {
  speakFrenchText,
  startFrenchSpeechRecognition,
  LiveSpeechController,
} from '../utils/speechAndAudio';

const ALL_VAULT_PHRASES = [...PORTUGUESE_BPO_CHEAT_VAULT, ...EXTRA_CHEAT_VAULT_PHRASES];
const ALL_EMAIL_TEMPLATES = [...EMAIL_TEMPLATES, ...EXTRA_EMAIL_TEMPLATES];
const ALL_GRAMMAR_TRAPS = [...GRAMMAR_TRAPS, ...EXTRA_GRAMMAR_TRAPS];

export interface TestHistoryEntry {
  id: string;
  timestamp: string;
  moduleName: string;
  score: number;
  cefr: string;
  weaknesses: string[];
}

interface Module6VaultAndAnalyticsProps {
  history: TestHistoryEntry[];
  bookmarks: Array<{ phrase: string; note: string }>;
  proctorWarnings: number;
  onRecordResult: (entry: {
    moduleName: string;
    score: number;
    cefr: string;
    weaknesses: string[];
  }) => void;
}

export const Module6VaultAndAnalytics: React.FC<Module6VaultAndAnalyticsProps> = ({
  history,
  bookmarks,
  proctorWarnings,
  onRecordResult,
}) => {
  const [activeSubView, setActiveSubView] = useState<
    'VAULT_SENTENCES' | 'EMAIL_TEMPLATES' | 'GRAMMAR_TRAPS' | 'SHADOWING_STUDIO' | 'ANALYTICS_DESTROYER'
  >('VAULT_SENTENCES');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Shadowing Studio State
  const [shadowTarget, setShadowTarget] = useState<string>(ALL_VAULT_PHRASES[0].french);
  const [shadowTranscript, setShadowTranscript] = useState<string>('');
  const [isShadowRecording, setIsShadowRecording] = useState<boolean>(false);
  const [shadowMetrics, setShadowMetrics] = useState<SpeechMetricsResult | null>(null);
  const shadowControllerRef = useRef<LiveSpeechController | null>(null);
  const shadowStartRef = useRef<number>(Date.now());

  // Weakness Destroyer Micro-Drill State
  const [drillActive, setDrillActive] = useState<boolean>(false);
  const [drillAnswers, setDrillAnswers] = useState<Record<string, number>>({});
  const [drillSubmitted, setDrillSubmitted] = useState<boolean>(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleToggleShadowRecording = () => {
    if (isShadowRecording) {
      shadowControllerRef.current?.stop();
      setIsShadowRecording(false);
      const spoken = shadowTranscript.trim() || shadowTarget;
      if (!shadowTranscript.trim()) setShadowTranscript(spoken);
      const dur = Math.max(3, Math.round((Date.now() - shadowStartRef.current) / 1000));
      setShadowMetrics(
        analyzeSpeechMetrics({
          targetText: shadowTarget,
          spokenTranscript: spoken,
          durationSeconds: dur,
        })
      );
    } else {
      setShadowMetrics(null);
      setIsShadowRecording(true);
      shadowStartRef.current = Date.now();
      shadowControllerRef.current = startFrenchSpeechRecognition({
        onTranscript: (t) => setShadowTranscript(t),
      });
    }
  };

  const handleSubmitWeaknessDrill = () => {
    setDrillSubmitted(true);
    let right = 0;
    for (const q of WEAKNESS_DESTROYER_DRILLS) {
      if (drillAnswers[q.id] === q.correctIndex) right++;
    }
    const pct = Math.round((right / WEAKNESS_DESTROYER_DRILLS.length) * 100);
    onRecordResult({
      moduleName: 'Weakness Destroyer Micro-Drill (5 Questions)',
      score: pct,
      cefr: pct >= 80 ? 'C1' : 'B2',
      weaknesses: [],
    });
  };

  const categories = [
    'ALL',
    'Accueil & Prise en charge',
    'Empathie & Apaisement VIP',
    'Mise en attente élégante',
    'Gestion des objections & Refus diplomatique',
    'Excuses professionnelles C1',
    'Clôture d’appel & CSAT',
    'Ponts anti-blanc (Emergency Fillers)',
  ];

  const filteredPhrases = ALL_VAULT_PHRASES.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesQ =
      p.french.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.whenToUse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.darijaMeaning.includes(searchQuery);
    return matchesCat && matchesQ;
  });

  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((acc, h) => acc + h.score, 0) / history.length)
      : 82;

  const aggregatedWeaknesses = Array.from(
    new Set(history.flatMap((h) => h.weaknesses))
  );

  return (
    <div className="space-y-6">
      {/* Header & Sub-Navigation */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Module 06</span>
              <span aria-hidden="true">·</span>
              <span>Portuguese BPO Cheat-Vault, Shadowing Studio & Analytics</span>
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Arsenal BPO Portugal, Studio de Prononciation & Destructeur de Faiblesses
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'VAULT_SENTENCES', label: 'Phrases d’Or & Ponts Anti-Blanc' },
              { id: 'EMAIL_TEMPLATES', label: 'Modèles d’E-mails C1' },
              { id: 'GRAMMAR_TRAPS', label: 'Pièges Grammaticaux BPO' },
              { id: 'SHADOWING_STUDIO', label: 'Shadowing & Prononciation Studio' },
              { id: 'ANALYTICS_DESTROYER', label: 'Analytics & Weakness Destroyer' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubView(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeSubView === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. VAULT SENTENCES */}
      {activeSubView === 'VAULT_SENTENCES' && (
        <div className="space-y-5">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une phrase d’accueil, d’empathie, d’attente ou un pont anti-blanc..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat === 'ALL' ? 'Toutes les catégories' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPhrases.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{item.category}</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.register}
                    </span>
                  </div>
                  <p className="text-base font-medium text-slate-900 dark:text-white leading-relaxed">
                    « {item.french} »
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <strong>Usage :</strong> {item.whenToUse}
                  </p>
                  <p className="text-sm font-arabic text-amber-800 dark:text-amber-200 bg-amber-500/10 rounded-lg p-2.5">
                    {item.darijaMeaning}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setShadowTarget(item.french);
                      setActiveSubView('SHADOWING_STUDIO');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5" /> S’entraîner en Shadowing
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => speakFrenchText(item.french)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Audio
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.french)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-blue-600 text-white text-xs font-medium cursor-pointer"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === item.id ? 'Copié' : 'Copier'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. EMAIL TEMPLATES */}
      {activeSubView === 'EMAIL_TEMPLATES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ALL_EMAIL_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Catégorie : {tpl.category}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(tpl.id, `${tpl.subject}\n\n${tpl.body}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 text-white font-semibold cursor-pointer"
                  >
                    {copiedId === tpl.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === tpl.id ? 'Modèle Copié !' : 'Copier le Modèle'}</span>
                  </button>
                </div>
                <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
                  {tpl.title}
                </h3>
                <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded text-slate-800 dark:text-slate-200">
                  Objet : {tpl.subject}
                </div>
                <pre className="text-xs font-sans whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                  {tpl.body}
                </pre>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm font-arabic text-slate-900 dark:text-amber-100">
                {tpl.darijaNote}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. GRAMMAR TRAPS */}
      {activeSubView === 'GRAMMAR_TRAPS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_GRAMMAR_TRAPS.map((gt) => (
            <div
              key={gt.id}
              className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3"
            >
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
                {gt.title}
              </h3>
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-800 dark:text-rose-300">
                <strong>Piège fréquent (Incorrect) :</strong> {gt.trapWrong}
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                <strong>Forme C1 Attendue :</strong> {gt.goldCorrect}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {gt.ruleExplanation}
              </p>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm font-arabic text-slate-900 dark:text-amber-100">
                {gt.darijaMnemonic}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. SHADOWING & PRONUNCIATION STUDIO */}
      {activeSubView === 'SHADOWING_STUDIO' && (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                Shadowing & Pronunciation Studio — Métriques Vocales en Direct
              </h3>
              <p className="text-xs text-slate-500">
                Écoutez le modèle C1 natif, puis enregistrez votre voix pour mesurer votre précision mot-à-mot, votre débit (130–160 WPM) et vos tics de langage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => speakFrenchText(shadowTarget)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>1. Écouter le Modèle C1 Natif</span>
            </button>
          </div>

          <div className="space-y-2">
            <label htmlFor="shadow-target-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Choisissez ou personnalisez la phrase C1 à répéter :
            </label>
            <select
              id="shadow-target-select"
              value={shadowTarget}
              onChange={(e) => {
                setShadowTarget(e.target.value);
                setShadowMetrics(null);
              }}
              className="w-full rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-slate-100"
            >
              {ALL_VAULT_PHRASES.map((p) => (
                <option key={p.id} value={p.french}>
                  [{p.category}] {p.french}
                </option>
              ))}
            </select>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
              « {shadowTarget} »
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleToggleShadowRecording}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  isShadowRecording
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>
                  {isShadowRecording
                    ? 'Arrêter & Analyser ma Prononciation'
                    : '2. Enregistrer ma Voix (Shadowing)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const sample = shadowTarget;
                  setShadowTranscript(sample);
                  setShadowMetrics(
                    analyzeSpeechMetrics({
                      targetText: shadowTarget,
                      spokenTranscript: sample,
                      durationSeconds: 7,
                    })
                  );
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                Tester l’analyseur avec la transcription cible
              </button>
            </div>

            <textarea
              rows={2}
              value={shadowTranscript}
              onChange={(e) => setShadowTranscript(e.target.value)}
              placeholder="Votre transcription vocale apparaîtra ici en temps réel..."
              className="w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          {shadowMetrics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Match Mot-à-Mot</span>
                <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {shadowMetrics.matchAccuracy}%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Cadence (Cible 130–160 WPM)</span>
                <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {shadowMetrics.wpm} WPM
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Compteur d’Hésitations</span>
                <div className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400">
                  {shadowMetrics.fillerCount}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Score Confiance & Rythme</span>
                <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                  {shadowMetrics.confidenceRhythmScore}/100
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. POST-TEST EXECUTIVE ANALYTICS & WEAKNESS DESTROYER */}
      {activeSubView === 'ANALYTICS_DESTROYER' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">Moyenne Générale Multi-Modules</span>
              <div className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 mt-1">
                {avgScore}% ({avgScore >= 78 ? 'C1' : 'B2'})
              </div>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">Intégrité Proctoring (Focus)</span>
              <div className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {Math.max(0, 100 - proctorWarnings * 15)}% ({proctorWarnings} alerte(s))
              </div>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">Simulations Complétées (Sauvegardées)</span>
              <div className="text-3xl font-mono font-bold text-slate-900 dark:text-white mt-1">
                {history.length} session(s)
              </div>
            </div>
          </div>

          {/* Weakness Destroyer Card */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>Générateur « Destroy My Weaknesses » (Micro-Drill 5 Questions)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Cible automatiquement les règles de grammaire et de registre BPO détectées lors de vos sessions précédentes :{' '}
                  {aggregatedWeaknesses.length > 0
                    ? aggregatedWeaknesses.join(' · ')
                    : 'Subjonctif après bien que · Conditionnel de politesse · Accord participe passé'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDrillActive(true);
                  setDrillSubmitted(false);
                  setDrillAnswers({});
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Générer Mon Micro-Drill (5 Questions)</span>
              </button>
            </div>

            {drillActive && (
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                {WEAKNESS_DESTROYER_DRILLS.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Drill #{idx + 1} · {q.grammarRuleTag}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {q.question}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options?.map((opt, oIdx) => {
                        const chosen = drillAnswers[q.id] === oIdx;
                        const isRight = oIdx === q.correctIndex;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={drillSubmitted}
                            onClick={() =>
                              setDrillAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                            }
                            className={`p-3 rounded-lg border text-left text-xs font-medium cursor-pointer ${
                              drillSubmitted
                                ? isRight
                                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                                  : chosen
                                  ? 'bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-200'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                                : chosen
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {drillSubmitted && (
                      <div className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                        <p>{q.explanationFr}</p>
                        <p className="font-arabic text-sm text-amber-700 dark:text-amber-300">
                          {q.explanationDarija}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {!drillSubmitted && (
                  <button
                    type="button"
                    onClick={handleSubmitWeaknessDrill}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Valider le Micro-Drill & Enregistrer mon Score</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Saved History & Bookmarks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Historique des Simulations (Persistant localStorage)</span>
              </h3>
              {history.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Aucune session enregistrée pour l’instant. Complétez un exercice dans l’un des 5 modules pour afficher votre progression.
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {h.moduleName}
                        </div>
                        <div className="text-slate-500">{h.timestamp}</div>
                      </div>
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {h.cefr} ({h.score}%)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-emerald-500" />
                <span>Mes Formules C1 Sauvegardées ({bookmarks.length})</span>
              </h3>
              {bookmarks.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Cliquez sur « Sauvegarder dans mon Vault » depuis le comparateur 3-niveaux pour conserver vos meilleures réponses C1.
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {bookmarks.map((b, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-xs"
                    >
                      <p className="text-slate-800 dark:text-slate-200 font-medium">{b.phrase}</p>
                      <p className="text-slate-500">{b.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
