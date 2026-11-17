import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Maximize2,
  Clock,
  Volume2,
  CheckCircle2,
  XCircle,
  Languages,
  ArrowRight,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { TESTGORILLA_QUESTIONS, TestGorillaQuestion } from '../data/assessmentBank';
import { speakFrenchText } from '../utils/speechAndAudio';
import { scoreToCEFR } from '../utils/scoring';
import { DarijaBiDiText } from '../utils/bidiUtils';

interface Module3TestGorillaProps {
  strictMode: boolean;
  proctorWarnings: number;
  onTriggerFullscreen: () => void;
  onRecordResult: (entry: {
    moduleName: string;
    score: number;
    cefr: string;
    weaknesses: string[];
  }) => void;
}

export const Module3TestGorilla: React.FC<Module3TestGorillaProps> = ({
  strictMode,
  proctorWarnings,
  onTriggerFullscreen,
  onRecordResult,
}) => {
  const [qIndex, setQIndex] = useState<number>(0);
  const currentQ: TestGorillaQuestion = TESTGORILLA_QUESTIONS[qIndex] || TESTGORILLA_QUESTIONS[0];

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [openResponse, setOpenResponse] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(currentQ.timeLimitSeconds);
  const [audioPlayCount, setAudioPlayCount] = useState<number>(0);
  const [showDarija, setShowDarija] = useState<boolean>(!strictMode);
  const [answersLog, setAnswersLog] = useState<
    Array<{ id: string; correct: boolean; ruleTag: string }>
  >([]);
  const [examCompleted, setExamCompleted] = useState<boolean>(false);

  useEffect(() => {
    setSelectedOption(null);
    setOpenResponse('');
    setIsSubmitted(false);
    setTimeLeft(currentQ.timeLimitSeconds);
    setAudioPlayCount(0);
  }, [qIndex, currentQ]);

  useEffect(() => {
    if (isSubmitted || examCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleConfirmAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, examCompleted, qIndex]);

  const handlePlayAudioClip = () => {
    if (!currentQ.audioScript) return;
    if (strictMode && audioPlayCount >= 2) return;
    setAudioPlayCount((c) => c + 1);
    speakFrenchText(currentQ.audioScript);
  };

  const handleConfirmAnswer = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    const isCorrect = currentQ.isOpenAudio
      ? openResponse.trim().split(/\s+/).length >= 12
      : selectedOption === currentQ.correctIndex;

    const updatedLog = [
      ...answersLog.filter((a) => a.id !== currentQ.id),
      { id: currentQ.id, correct: isCorrect, ruleTag: currentQ.grammarRuleTag },
    ];
    setAnswersLog(updatedLog);
  };

  const handleNextQuestion = () => {
    if (qIndex + 1 < TESTGORILLA_QUESTIONS.length) {
      setQIndex((prev) => prev + 1);
    } else {
      setExamCompleted(true);
      const correctCount = answersLog.filter((a) => a.correct).length;
      const pct = Math.round((correctCount / TESTGORILLA_QUESTIONS.length) * 100);
      const missedRules = answersLog.filter((a) => !a.correct).map((a) => a.ruleTag);
      onRecordResult({
        moduleName: 'TestGorilla French B2/C1 Proctored',
        score: pct,
        cefr: scoreToCEFR(pct),
        weaknesses: missedRules,
      });
    }
  };

  const handleRestartExam = () => {
    setAnswersLog([]);
    setExamCompleted(false);
    setQIndex(0);
  };

  const correctSoFar = answersLog.filter((a) => a.correct).length;
  const accuracyPct =
    answersLog.length > 0 ? Math.round((correctSoFar / answersLog.length) * 100) : 100;

  return (
    <div
      className="space-y-6"
      onCopy={(e) => {
        if (strictMode) e.preventDefault();
      }}
      onPaste={(e) => {
        if (strictMode) e.preventDefault();
      }}
      onContextMenu={(e) => {
        if (strictMode) e.preventDefault();
      }}
    >
      {/* Top Proctoring & Anti-Distraction Telemetry Bar */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Module 03</span>
              <span aria-hidden="true">·</span>
              <span>TestGorilla French B2/C1 Screening</span>
              <span aria-hidden="true">·</span>
              <span>Surveillance Anti-Triche Active</span>
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Arène Proctored TestGorilla — Grammaire C1, SLA/RGPD & Écoute
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span>Intégrité Focus :</span>
              <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                {Math.max(0, 100 - proctorWarnings * 15)}% ({proctorWarnings} sortie(s) d’onglet)
              </span>
            </div>

            <button
              type="button"
              onClick={onTriggerFullscreen}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Activer Plein Écran Proctored</span>
            </button>
          </div>
        </div>

        {/* Question Step Progress */}
        <div className="mt-5 grid grid-cols-5 sm:grid-cols-10 gap-2">
          {TESTGORILLA_QUESTIONS.map((q, idx) => {
            const logItem = answersLog.find((a) => a.id === q.id);
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  if (!strictMode) setQIndex(idx);
                }}
                className={`h-8 rounded-lg font-mono text-xs font-semibold transition-colors cursor-pointer ${
                  idx === qIndex
                    ? 'bg-blue-600 text-white'
                    : logItem
                    ? logItem.correct
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Q{idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {examCompleted ? (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center space-y-5">
          <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Rapport Officiel TestGorilla French B2/C1
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 min-w-[160px]">
              <span className="text-xs text-slate-500">Score Final</span>
              <div className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400">
                {accuracyPct}%
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 min-w-[160px]">
              <span className="text-xs text-slate-500">Niveau Certifié</span>
              <div className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {scoreToCEFR(accuracyPct)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 min-w-[160px]">
              <span className="text-xs text-slate-500">Intégrité Proctoring</span>
              <div className="text-3xl font-mono font-bold text-slate-900 dark:text-white">
                {Math.max(0, 100 - proctorWarnings * 15)}%
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestartExam}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Relancer une Session TestGorilla</span>
          </button>
        </div>
      ) : (
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          {/* Question Header & Strict Per-Question Countdown */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Question {qIndex + 1} / {TESTGORILLA_QUESTIONS.length} · {currentQ.category}
              </span>
              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mt-1">
                {currentQ.question}
              </h3>
            </div>

            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-sm font-bold tabular-nums ${
                timeLeft <= 10
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>00:{String(timeLeft).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Reading Comprehension Passage if present */}
          {currentQ.contextPassage && (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
              {currentQ.contextPassage}
            </div>
          )}

          {/* Listening Comprehension Audio Player (Max 2 listens in Strict Mode) */}
          {currentQ.audioScript && (
            <div className="p-4 rounded-lg bg-blue-600/5 border border-blue-500/20 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <strong>Extrait Audio Professionnel :</strong> Écoutez attentivement l’enregistrement
                {strictMode ? ` (${2 - audioPlayCount} écoute(s) restante(s) en mode strict)` : ''}.
              </div>
              <button
                type="button"
                disabled={strictMode && audioPlayCount >= 2}
                onClick={handlePlayAudioClip}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Écouter l’extrait audio ({audioPlayCount}/2)</span>
              </button>
            </div>
          )}

          {/* Multiple Choice Options OR Custom Video/Audio Interview Box */}
          {currentQ.isOpenAudio ? (
            <div className="space-y-3">
              <label htmlFor="tg-open-interview" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Réponse d’entretien BPO (Structure STAR recommandée — minimum 15 mots) :
              </label>
              <textarea
                id="tg-open-interview"
                rows={4}
                value={openResponse}
                onChange={(e) => setOpenResponse(e.target.value)}
                placeholder="Ex: Passionné par la relation client internationale à Lisbonne, j'ai développé une solide maîtrise de l'écoute active et de la résolution au premier contact..."
                className="w-full rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-3.5 text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options?.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isRight = idx === currentQ.correctIndex;
                let styleClass =
                  'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500';

                if (isSubmitted) {
                  if (isRight) {
                    styleClass =
                      'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200';
                  } else if (isSelected && !isRight) {
                    styleClass =
                      'bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-200';
                  }
                } else if (isSelected) {
                  styleClass = 'bg-blue-600/10 border-blue-600 text-blue-900 dark:text-blue-100';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${styleClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-medium">{opt}</span>
                    </div>
                    {isSubmitted && isRight && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isRight && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Submit / Next Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>
                {strictMode
                  ? 'Mode Examen Strict : Copier-coller désactivé, aucune aide avant validation.'
                  : 'Mode Super-Coach IA : Explications grammaticales et Darija débloquées.'}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {!strictMode && (
                <button
                  type="button"
                  onClick={() => setShowDarija((s) => !s)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 cursor-pointer"
                >
                  <Languages className="w-4 h-4" />
                  <span>{showDarija ? 'Masquer Darija' : 'Explain in Darija (شرح بالدارجة)'}</span>
                </button>
              )}

              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleConfirmAnswer}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                >
                  <span>Valider la Réponse</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                >
                  <span>
                    {qIndex + 1 < TESTGORILLA_QUESTIONS.length
                      ? 'Question Suivante'
                      : 'Terminer & Voir le Bilan'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Instant Feedback & Darija Explanation Box */}
          {(isSubmitted || (!strictMode && showDarija)) && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Règle TestGorilla ({currentQ.grammarRuleTag}) :
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200">
                {currentQ.explanationFr}
              </p>
              {showDarija && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <DarijaBiDiText
                    text={currentQ.explanationDarija}
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
