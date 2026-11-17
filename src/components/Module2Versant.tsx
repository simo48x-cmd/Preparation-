import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Languages,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { VERSANT_ITEMS, VersantItem } from '../data/assessmentBank';
import {
  analyzeSpeechMetrics,
  calculateVersantScore,
  SpeechMetricsResult,
  VersantDiagnostic,
} from '../utils/scoring';
import {
  speakFrenchText,
  startFrenchSpeechRecognition,
  LiveSpeechController,
} from '../utils/speechAndAudio';
import { DarijaBiDiText } from '../utils/bidiUtils';

interface Module2VersantProps {
  strictMode: boolean;
  onRecordResult: (entry: {
    moduleName: string;
    score: number;
    cefr: string;
    weaknesses: string[];
  }) => void;
}

export const Module2Versant: React.FC<Module2VersantProps> = ({
  strictMode,
  onRecordResult,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentItem: VersantItem = VERSANT_ITEMS[currentIndex] || VERSANT_ITEMS[0];

  const [ttsSpeed, setTtsSpeed] = useState<number>(1.0);
  const [userInput, setUserInput] = useState<string>('');
  const [selectedChunks, setSelectedChunks] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(currentItem.timeLimitSeconds);
  const [itemMetrics, setItemMetrics] = useState<SpeechMetricsResult | null>(null);
  const [showDarija, setShowDarija] = useState<boolean>(!strictMode);

  const [subscoreHistory, setSubscoreHistory] = useState<{
    sentenceMastery: number[];
    vocabulary: number[];
    fluency: number[];
    pronunciation: number[];
  }>({
    sentenceMastery: [78],
    vocabulary: [80],
    fluency: [74],
    pronunciation: [76],
  });

  const speechRef = useRef<LiveSpeechController | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    speechRef.current?.stop();
    setIsRecording(false);
    setUserInput('');
    setSelectedChunks([]);
    setItemMetrics(null);
    setTimeLeft(currentItem.timeLimitSeconds);
    startTimeRef.current = Date.now();
  }, [currentIndex, currentItem]);

  useEffect(() => {
    if (!isRecording) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleEvaluateItem();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isRecording]);

  const handleToggleMic = () => {
    if (isRecording) {
      speechRef.current?.stop();
      setIsRecording(false);
      handleEvaluateItem();
    } else {
      setIsRecording(true);
      startTimeRef.current = Date.now();
      speechRef.current = startFrenchSpeechRecognition({
        onTranscript: (txt) => setUserInput(txt),
      });
    }
  };

  const handleAddChunk = (chunk: string) => {
    if (selectedChunks.includes(chunk)) {
      setSelectedChunks((prev) => prev.filter((c) => c !== chunk));
    } else {
      const next = [...selectedChunks, chunk];
      setSelectedChunks(next);
      setUserInput(next.join(' '));
    }
  };

  const handleEvaluateItem = () => {
    speechRef.current?.stop();
    setIsRecording(false);

    const candidateText =
      userInput.trim() ||
      (currentItem.part === 'C_SENTENCE_BUILD'
        ? selectedChunks.join(' ')
        : currentItem.targetAnswer);

    if (!userInput.trim()) {
      setUserInput(candidateText);
    }

    const elapsedSec = Math.max(4, Math.round((Date.now() - startTimeRef.current) / 1000));
    const metrics = analyzeSpeechMetrics({
      targetText: currentItem.targetAnswer,
      spokenTranscript: candidateText,
      durationSeconds: elapsedSec,
    });

    setItemMetrics(metrics);

    setSubscoreHistory((prev) => {
      const nextSM = [...prev.sentenceMastery, metrics.matchAccuracy];
      const nextVoc = [...prev.vocabulary, Math.min(100, metrics.matchAccuracy + 5)];
      const nextFlu = [...prev.fluency, metrics.confidenceRhythmScore];
      const nextPro = [...prev.pronunciation, Math.max(55, metrics.matchAccuracy - metrics.fillerCount * 5)];

      const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
      const diag = calculateVersantScore({
        sentenceMastery: avg(nextSM),
        vocabulary: avg(nextVoc),
        fluency: avg(nextFlu),
        pronunciation: avg(nextPro),
      });

      onRecordResult({
        moduleName: `Pearson Versant (${currentItem.part})`,
        score: Math.round(((diag.overallScore - 20) / 60) * 100),
        cefr: diag.cefr,
        weaknesses:
          metrics.fillerCount > 0
            ? ['Mots parasites à l’oral (euh, du coup)']
            : metrics.matchAccuracy < 80
            ? ['Précision de répétition verbatim Versant']
            : [],
      });

      return {
        sentenceMastery: nextSM,
        vocabulary: nextVoc,
        fluency: nextFlu,
        pronunciation: nextPro,
      };
    });
  };

  const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  const currentDiagnostic: VersantDiagnostic = calculateVersantScore({
    sentenceMastery: avg(subscoreHistory.sentenceMastery),
    vocabulary: avg(subscoreHistory.vocabulary),
    fluency: avg(subscoreHistory.fluency),
    pronunciation: avg(subscoreHistory.pronunciation),
  });

  return (
    <div className="space-y-6">
      {/* Versant 20-80 Header & Live 4-Pillar Scoreboard */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Module 02</span>
              <span aria-hidden="true">·</span>
              <span>Pearson Versant French Automated Lab</span>
              <span aria-hidden="true">·</span>
              <span>Échelle Officielle 20 à 80 Points</span>
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Laboratoire Automatisé Pearson Versant (Parties A, B, C & D)
            </h2>
          </div>

          <div className="flex items-center gap-5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5">
            <div>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                Score Versant Global
              </span>
              <span className="text-2xl font-mono font-bold tabular-nums text-blue-600 dark:text-blue-400">
                {currentDiagnostic.overallScore}{' '}
                <span className="text-xs font-normal text-slate-400">/ 80</span>
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                Équivalence CECRL
              </span>
              <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {currentDiagnostic.cefr}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Diagnostic Sub-bars (25% each) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Maîtrise des Phrases (25%)', val: currentDiagnostic.sentenceMastery },
            { label: 'Vocabulaire Corporate (25%)', val: currentDiagnostic.vocabulary },
            { label: 'Fluidité & Rythme (25%)', val: currentDiagnostic.fluency },
            { label: 'Prononciation (25%)', val: currentDiagnostic.pronunciation },
          ].map((bar) => (
            <div
              key={bar.label}
              className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700 dark:text-slate-300">{bar.label}</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                  {bar.val} / 80
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((bar.val - 20) / 60) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Item Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {VERSANT_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                idx === currentIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {idx + 1}. {item.title.split('—')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Active Drill Card */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase text-blue-600 dark:text-blue-400">
              {currentItem.part.replace(/_/g, ' ')}
            </span>
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {currentItem.title}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            {/* Adjustable TTS Speed Slider */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <label htmlFor="versant-tts-speed" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Vitesse Audio : {ttsSpeed.toFixed(1)}x
              </label>
              <input
                id="versant-tts-speed"
                type="range"
                min="0.8"
                max="1.2"
                step="0.1"
                value={ttsSpeed}
                onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                className="w-20 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="font-mono text-sm font-bold tabular-nums px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Prompt Display (Hidden in Part B Repeat unless Coach reveal or graded) */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {currentItem.part === 'B_REPEAT'
                ? 'Écoutez la phrase native (Texte masqué comme dans le vrai test Versant) :'
                : 'Consigne / Texte à traiter :'}
            </span>
            <button
              type="button"
              onClick={() => speakFrenchText(currentItem.targetAnswer, { rate: ttsSpeed })}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Écouter la Voix Native (fr-FR)</span>
            </button>
          </div>

          {currentItem.part === 'B_REPEAT' && !itemMetrics && strictMode ? (
            <p className="text-sm italic text-slate-500 dark:text-slate-400">
              [Audio uniquement en Mode Examen Strict — Cliquez sur « Écouter la Voix Native » puis répétez mot pour mot]
            </p>
          ) : (
            <p className="text-base font-medium leading-relaxed text-slate-900 dark:text-slate-100">
              {currentItem.promptText}
            </p>
          )}

          {/* Scrambled Sentence Chunks for Part C */}
          {currentItem.part === 'C_SENTENCE_BUILD' && currentItem.scrambledChunks && (
            <div className="pt-2 space-y-2">
              <span className="text-xs font-medium text-slate-500">
                Cliquez sur les segments dans l’ordre logique :
              </span>
              <div className="flex flex-wrap gap-2">
                {currentItem.scrambledChunks.map((chunk) => {
                  const chosen = selectedChunks.includes(chunk);
                  return (
                    <button
                      key={chunk}
                      type="button"
                      onClick={() => handleAddChunk(chunk)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        chosen
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-500'
                      }`}
                    >
                      {chunk}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Speech / Text Input Box */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="versant-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Votre réponse (Microphone en direct ou saisie clavier) :
            </label>
            <div className="flex items-center gap-2">
              {!strictMode && (
                <button
                  type="button"
                  onClick={() => setUserInput(currentItem.targetAnswer)}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Simuler une réponse C1 parfaite
                </button>
              )}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecording ? 'Arrêter & Noter' : 'Parler au Micro (fr-FR)'}</span>
              </button>
            </div>
          </div>

          <textarea
            id="versant-input"
            rows={3}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Prononcez ou tapez la phrase exacte ici..."
            className="w-full rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 p-3.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setUserInput('');
                setSelectedChunks([]);
                setItemMetrics(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réessayer</span>
            </button>
            <button
              type="button"
              onClick={() => setShowDarija((s) => !s)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{showDarija ? 'Masquer Darija' : 'Explain in Darija (شرح بالدارجة)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleEvaluateItem}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider & Calculer Score Versant</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % VERSANT_ITEMS.length)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              <span>Exercice Suivant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Darija Tip */}
        {showDarija && (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <DarijaBiDiText
              text={currentItem.darijaTip}
              className="text-sm text-slate-900 dark:text-amber-100"
            />
          </div>
        )}

        {/* Word-by-Word Match & Speech Metrics Feedback */}
        {itemMetrics && (
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Précision Mot-à-Mot</span>
                <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {itemMetrics.matchAccuracy}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Débit Oral (Cible 130-160)</span>
                <div className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                  {itemMetrics.wpm} WPM
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Hésitations (« euh, du coup »)</span>
                <div className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400">
                  {itemMetrics.fillerCount} détectée(s)
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Score Rythme & Aisance</span>
                <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                  {itemMetrics.confidenceRhythmScore}/100
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Alignement Verbatim :
              </span>
              <div className="flex flex-wrap gap-1.5 text-sm">
                {itemMetrics.wordDiff.map((w, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded font-mono text-xs ${
                      w.matched
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 line-through'
                    }`}
                  >
                    {w.word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
