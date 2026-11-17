import React, { useState } from 'react';
import { Volume2, Copy, Check, Languages, Award, Sparkles, AlertTriangle } from 'lucide-react';
import { ThreeTierUpgradeResult, buildModalityCriteriaBars } from '../utils/scoring';
import { speakFrenchText } from '../utils/speechAndAudio';
import { DarijaBiDiText } from '../utils/bidiUtils';

interface ThreeTierUpgraderCardProps {
  result: ThreeTierUpgradeResult;
  coachMode: boolean;
  onBookmarkPhrase?: (phrase: string, note: string) => void;
}

export const ThreeTierUpgraderCard: React.FC<ThreeTierUpgraderCardProps> = ({
  result,
  coachMode,
  onBookmarkPhrase,
}) => {
  const [showDarija, setShowDarija] = useState<boolean>(coachMode);
  const [copiedTier, setCopiedTier] = useState<'B2' | 'C1' | null>(null);
  const [mobileTierTab, setMobileTierTab] = useState<'RAW' | 'B2' | 'C1'>('C1');

  const handleCopy = (text: string, tier: 'B2' | 'C1') => {
    navigator.clipboard?.writeText(text);
    setCopiedTier(tier);
    setTimeout(() => setCopiedTier(null), 1800);
  };

  const criteriaBars =
    result.criteriaBars && result.criteriaBars.length === 4
      ? result.criteriaBars
      : buildModalityCriteriaBars(result.modality || 'written', {
          grammarSyntax: result.cefrCriteria.grammarSyntax ?? result.cefrCriteria.grammar ?? 75,
          orthographyAccents: result.cefrCriteria.orthographyAccents ?? 80,
          lexicalRichness: result.cefrCriteria.lexicalRichness ?? 78,
          coherence: result.cefrCriteria.coherence ?? 75,
          pronunciation: result.cefrCriteria.pronunciation,
          fluency: result.cefrCriteria.fluency,
        });

  return (
    <div className="space-y-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
      {/* Header & Modality Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>
              Barème Psychométrique ({result.modality === 'spoken' ? '🎙️ Évaluation Orale' : '✍️ Évaluation Écrite'})
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              Niveau Estimé : {result.overallCefr} ({result.overallScore}/100)
            </span>
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
            Comparateur IA 3-Niveaux & Correction Teleperformance Portugal
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowDarija((prev) => !prev)}
            className="inline-flex items-center gap-2 min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Languages className="w-4 h-4" />
            <span>
              {showDarija
                ? 'Masquer Coach Darija (إخفاء الدارجة)'
                : 'Explain in Moroccan Darija (شرح ليا بالدارجة)'}
            </span>
          </button>
        </div>
      </div>

      {/* 4 Modality-Specific CEFR Criteria Sub-Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {criteriaBars.map((crit) => (
          <div
            key={crit.key}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800"
          >
            <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">{crit.label}</span>
              <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white shrink-0">
                {crit.score}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  crit.score >= 80
                    ? 'bg-emerald-500'
                    : crit.score >= 60
                    ? 'bg-blue-600'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${crit.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Segmented Tab Selector (< 1024px) */}
      <div className="flex lg:hidden items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        {[
          { id: 'RAW', label: '1. Votre Réponse' },
          { id: 'B2', label: '2. Version B2' },
          { id: 'C1', label: '3. Version C1/C2 Elite' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMobileTierTab(tab.id as 'RAW' | 'B2' | 'C1')}
            className={`flex-1 min-h-[42px] px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              mobileTierTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3-Column Comparison Grid (Tabbed on Mobile, 3 Columns on Desktop lg:grid-cols-3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1: Raw Input with Highlighted Diffs */}
        <div
          className={`${
            mobileTierTab === 'RAW' ? 'flex' : 'hidden lg:flex'
          } rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4 flex-col justify-between`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                1. Votre Réponse (Analyse Brute)
              </span>
              <span className="text-xs text-slate-500">Diagnostic Couleur</span>
            </div>

            <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap mb-4">
              {result.highlightedSegments.length > 0 ? (
                result.highlightedSegments.map((seg, i) => {
                  if (seg.type === 'error') {
                    return (
                      <span
                        key={i}
                        title={seg.reason}
                        className="bg-rose-500/20 text-rose-700 dark:text-rose-300 underline decoration-rose-500 px-1 rounded"
                      >
                        {seg.text}
                      </span>
                    );
                  }
                  if (seg.type === 'informal') {
                    return (
                      <span
                        key={i}
                        title={seg.reason}
                        className="bg-amber-500/20 text-amber-800 dark:text-amber-300 underline decoration-amber-500 px-1 rounded"
                      >
                        {seg.text}
                      </span>
                    );
                  }
                  if (seg.type === 'accent') {
                    return (
                      <span
                        key={i}
                        title={`${seg.reason} -> ${seg.suggestion}`}
                        className="bg-purple-500/20 text-purple-800 dark:text-purple-300 underline decoration-purple-500 px-1 rounded"
                      >
                        {seg.text}
                      </span>
                    );
                  }
                  return <span key={i}>{seg.text}</span>;
                })
              ) : (
                <span>{result.rawInput}</span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5" /> Rouge : Grammaire
              </span>
              <span className="text-amber-600 dark:text-amber-400">Ambre : Registre familier</span>
              <span className="text-purple-600 dark:text-purple-400">Violet : Accent manquant</span>
            </div>
          </div>
        </div>

        {/* Column 2: Version B2 Correcte */}
        <div
          className={`${
            mobileTierTab === 'B2' ? 'flex' : 'hidden lg:flex'
          } rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4 flex-col justify-between`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                2. Version B2 Correcte (Pro Standard)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => speakFrenchText(result.versionB2)}
                  aria-label="Écouter la version B2"
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(result.versionB2, 'B2')}
                  aria-label="Copier la version B2"
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {copiedTier === 'B2' ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
              {result.versionB2}
            </p>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Français professionnel clair, sans fautes d’orthographe ni de syntaxe (Seuil validé BPO).
          </div>
        </div>

        {/* Column 3: Version C1/C2 Recruiter Magnet */}
        <div
          className={`${
            mobileTierTab === 'C1' ? 'flex' : 'hidden lg:flex'
          } rounded-xl bg-emerald-950/5 dark:bg-emerald-950/20 border border-emerald-500/30 p-4 flex-col justify-between`}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-emerald-500/20">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Award className="w-4 h-4" />
                <span>3. Version C1/C2 « Top 1% Recruiter »</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => speakFrenchText(result.versionC1)}
                  aria-label="Écouter la version C1"
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(result.versionC1, 'C1')}
                  aria-label="Copier la version C1"
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 cursor-pointer"
                >
                  {copiedTier === 'C1' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-wrap font-medium">
              {result.versionC1}
            </p>
          </div>

          <div className="pt-3 mt-4 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-emerald-700 dark:text-emerald-300">
              Connecteurs C1 + Empathie Exécutive
            </span>
            {onBookmarkPhrase && (
              <button
                type="button"
                onClick={() => onBookmarkPhrase(result.versionC1, result.frenchRuleSummary)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" /> Sauvegarder dans mon Vault
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Moroccan Darija Coach Box with BiDi Isolation */}
      {showDarija && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              Coach Marocain Darija / Arabe (نصيحة الكوتش بالدارجة المغربية)
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400">
              Astuce Mémorisation Rapide
            </span>
          </div>
          <DarijaBiDiText
            text={result.darijaExplanation}
            className="text-base text-slate-900 dark:text-amber-100"
          />
          <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-amber-500/20">
            <strong>Règle clé :</strong> {result.frenchRuleSummary}
          </p>
        </div>
      )}
    </div>
  );
};
