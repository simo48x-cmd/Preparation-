import React, { useState, useRef } from 'react';
import {
  TrendingUp,
  Volume2,
  Award,
  Printer,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Languages,
} from 'lucide-react';
import { EFSET_ADAPTIVE_POOL, EfSetAdaptiveItem } from '../data/assessmentBank';
import { calculateAdaptiveStep, scoreToCEFR, CEFRLevel } from '../utils/scoring';
import { speakFrenchText } from '../utils/speechAndAudio';
import { DarijaBiDiText } from '../utils/bidiUtils';

interface Module5EfSetProps {
  strictMode: boolean;
  onRecordResult: (entry: {
    moduleName: string;
    score: number;
    cefr: string;
    weaknesses: string[];
  }) => void;
}

export const Module5EfSet: React.FC<Module5EfSetProps> = ({
  strictMode,
  onRecordResult,
}) => {
  const [difficultyScore, setDifficultyScore] = useState<number>(500); // Start at B1/B2 = 500
  const [difficultyHistory, setDifficultyHistory] = useState<number[]>([500]);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState<EfSetAdaptiveItem>(() => {
    // Pick item closest to 500
    return EFSET_ADAPTIVE_POOL[1];
  });

  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [candidateName, setCandidateName] = useState<string>('Candidat Francophone BPO Portugal');
  const [showDarija, setShowDarija] = useState<boolean>(!strictMode);

  const itemStartTimeRef = useRef<number>(Date.now());

  const handleSubmitAdaptiveAnswer = () => {
    if (selectedOpt === null || submitted) return;
    setSubmitted(true);

    const isCorrect = selectedOpt === currentItem.correctIndex;
    const elapsedSec = Math.max(3, Math.round((Date.now() - itemStartTimeRef.current) / 1000));

    const { nextDifficulty } = calculateAdaptiveStep({
      currentDifficulty: difficultyScore,
      isCorrect,
      responseTimeSeconds: elapsedSec,
      targetTimeSeconds: 30,
    });

    setDifficultyScore(nextDifficulty);
    setDifficultyHistory((prev) => [...prev, nextDifficulty]);
    setUsedIds((prev) => [...prev, currentItem.id]);
  };

  const handleNextAdaptiveItem = () => {
    const remaining = EFSET_ADAPTIVE_POOL.filter((item) => !usedIds.includes(item.id));
    if (remaining.length === 0 || difficultyHistory.length >= 6) {
      setShowCertificate(true);
      const pct = Math.min(100, Math.max(15, Math.round(((difficultyScore - 200) / 600) * 100)));
      onRecordResult({
        moduleName: 'EF SET Adaptive CAT Engine',
        score: pct,
        cefr: scoreToCEFR(pct),
        weaknesses: pct < 75 ? ['Nuances idiomatiques & Juridiques C1/C2'] : [],
      });
      return;
    }

    // Select item whose difficulty is closest to the new adaptive difficultyScore
    const sortedByProximity = [...remaining].sort(
      (a, b) => Math.abs(a.difficulty - difficultyScore) - Math.abs(b.difficulty - difficultyScore)
    );
    setCurrentItem(sortedByProximity[0]);
    setSelectedOpt(null);
    setSubmitted(false);
    itemStartTimeRef.current = Date.now();
  };

  const handleRestartCat = () => {
    setDifficultyScore(500);
    setDifficultyHistory([500]);
    setUsedIds([]);
    setCurrentItem(EFSET_ADAPTIVE_POOL[1]);
    setSelectedOpt(null);
    setSubmitted(false);
    setShowCertificate(false);
    itemStartTimeRef.current = Date.now();
  };

  const normalizedPct = Math.min(100, Math.max(15, Math.round(((difficultyScore - 200) / 600) * 100)));
  const currentCefr: CEFRLevel = scoreToCEFR(normalizedPct);

  return (
    <div className="space-y-6">
      {/* Header & Live Adaptive Curve */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Module 05</span>
              <span aria-hidden="true">·</span>
              <span>EF SET Computerized Adaptive Testing (CAT)</span>
              <span aria-hidden="true">·</span>
              <span>Calibration Dynamique A2 → C2</span>
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Moteur Adaptatif EF SET — Courbe de Difficulté en Temps Réel
            </h2>
          </div>

          <div className="flex items-center gap-5 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="block text-[11px] text-slate-500">Indice CAT (200–800)</span>
              <span className="text-2xl font-mono font-bold tabular-nums text-blue-600 dark:text-blue-400">
                {difficultyScore}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="block text-[11px] text-slate-500">Palier CECRL Actuel</span>
              <span className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {currentCefr} ({normalizedPct}/100)
              </span>
            </div>
          </div>
        </div>

        {/* Live SVG Adaptive Curve Graph */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Courbe d’adaptation psychométrique (Départ = 500)
            </span>
            <span className="font-mono">
              Étape {difficultyHistory.length} / 6
            </span>
          </div>
          <svg className="w-full h-24 overflow-visible" viewBox="0 0 600 90">
            <line x1="0" y1="45" x2="600" y2="45" stroke="currentColor" className="text-slate-300 dark:text-slate-800" strokeDasharray="4 4" />
            <polyline
              fill="none"
              stroke="#2563EB"
              strokeWidth="3"
              points={difficultyHistory
                .map((val, idx) => {
                  const x = (idx / Math.max(1, 5)) * 560 + 20;
                  const y = 80 - ((val - 200) / 600) * 70;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
            {difficultyHistory.map((val, idx) => {
              const x = (idx / Math.max(1, 5)) * 560 + 20;
              const y = 80 - ((val - 200) / 600) * 70;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="5" className="fill-blue-600" />
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-slate-700 dark:fill-slate-300"
                  >
                    {val}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {showCertificate ? (
        /* Printable Official Readiness Certificate */
        <div className="rounded-xl bg-white dark:bg-slate-900 border-2 border-blue-600/40 p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Award className="w-10 h-10 text-emerald-500" />
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  FR-PRO PORTUGAL · EF SET CAT CERTIFICATION
                </span>
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  Certificat Officiel d’Aptitude Corporate French BPO
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer / Exporter PDF</span>
              </button>
              <button
                type="button"
                onClick={handleRestartCat}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Nouveau Test Adaptatif</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label htmlFor="cert-candidate-name" className="block text-xs text-slate-500 mb-1">
                  Nom du Candidat (Personnalisable avant impression) :
                </label>
                <input
                  id="cert-candidate-name"
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="text-xl font-display font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 w-full text-slate-900 dark:text-white"
                />
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A complété avec succès l’évaluation adaptative informatisée (CAT) calibrée sur les référentiels de recrutement des centres de services partagés au Portugal (Lisbonne, Porto, Coimbra).
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Score EF SET Equivalent</span>
                  <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                    {normalizedPct} / 100
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Indice Psychométrique Final</span>
                  <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {difficultyScore} pts ({currentCefr})
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                NIVEAU CECRL CERTIFIÉ
              </span>
              <div className="text-5xl font-display font-bold text-emerald-600 dark:text-emerald-400">
                {currentCefr}
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {currentCefr === 'C1' || currentCefr === 'C2'
                  ? 'Éligible Postes Senior B2B & Team Leader Portugal'
                  : 'Éligible Conseiller Clientèle Francophone'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Active Adaptive Item Card */
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                Difficulté Item : {currentItem.difficulty} ({currentItem.cefrBand}) · {currentItem.skill}
              </span>
              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mt-1">
                {currentItem.question}
              </h3>
            </div>
          </div>

          {currentItem.passageOrAudio && (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
              {currentItem.isAudio ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Extrait Audio Adaptatif C1/C2 :
                  </span>
                  <button
                    type="button"
                    onClick={() => speakFrenchText(currentItem.passageOrAudio!)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Écouter l’extrait</span>
                  </button>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {currentItem.passageOrAudio}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2.5">
            {currentItem.options.map((opt, idx) => {
              const chosen = selectedOpt === idx;
              const isCorrect = idx === currentItem.correctIndex;
              let cls =
                'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500';
              if (submitted) {
                if (isCorrect) cls = 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200';
                else if (chosen) cls = 'bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-200';
              } else if (chosen) {
                cls = 'bg-blue-600/10 border-blue-600 text-blue-900 dark:text-blue-100';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={submitted}
                  onClick={() => setSelectedOpt(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${cls}`}
                >
                  <span className="text-sm font-medium">{opt}</span>
                  {submitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowDarija((s) => !s)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 cursor-pointer"
            >
              <Languages className="w-4 h-4" />
              <span>{showDarija ? 'Masquer Darija' : 'Explain in Darija (شرح بالدارجة)'}</span>
            </button>

            <div className="flex items-center gap-2.5">
              {!submitted ? (
                <button
                  type="button"
                  disabled={selectedOpt === null}
                  onClick={handleSubmitAdaptiveAnswer}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 cursor-pointer"
                >
                  <span>Valider & Calibrer Difficulté</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextAdaptiveItem}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                >
                  <span>Item Adaptatif Suivant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {submitted && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-sm text-slate-800 dark:text-slate-200">
                {currentItem.explanationFr}
              </p>
              {showDarija && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <DarijaBiDiText
                    text={currentItem.darijaExplanation}
                    className="text-base text-amber-800 dark:text-amber-200"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
