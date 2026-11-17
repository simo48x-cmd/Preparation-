import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Volume2,
  Clock,
  Sparkles,
  Send,
  RotateCcw,
  FileText,
  Headphones,
  CheckCircle2,
  Languages,
} from 'lucide-react';
import { PIPPLET_SCENARIOS, PippletScenario } from '../data/assessmentBank';
import {
  evaluateAndUpgradeFrenchResponse,
  ThreeTierUpgradeResult,
} from '../utils/scoring';
import {
  speakFrenchText,
  startFrenchSpeechRecognition,
  LiveSpeechController,
} from '../utils/speechAndAudio';
import { FrenchAccentBar } from './FrenchAccentBar';
import { ThreeTierUpgraderCard } from './ThreeTierUpgraderCard';

interface Module1PippletProps {
  strictMode: boolean;
  onRecordResult: (entry: {
    moduleName: string;
    score: number;
    cefr: string;
    weaknesses: string[];
  }) => void;
  onBookmarkPhrase: (phrase: string, note: string) => void;
}

export const Module1Pipplet: React.FC<Module1PippletProps> = ({
  strictMode,
  onRecordResult,
  onBookmarkPhrase,
}) => {
  const [scenarios, setScenarios] = useState<PippletScenario[]>(PIPPLET_SCENARIOS);
  const [selectedId, setSelectedId] = useState<string>(PIPPLET_SCENARIOS[0].id);
  const currentScenario = scenarios.find((s) => s.id === selectedId) || scenarios[0];

  const [phase, setPhase] = useState<'idle' | 'prep' | 'recording' | 'writing' | 'graded'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(currentScenario.responseSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [responseText, setResponseText] = useState<string>('');
  const [waveform, setWaveform] = useState<number[]>(Array(24).fill(18));
  const [speechNotice, setSpeechNotice] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<ThreeTierUpgradeResult | null>(null);
  const [showCoachHint, setShowCoachHint] = useState<boolean>(false);

  const speechControllerRef = useRef<LiveSpeechController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    speechControllerRef.current?.stop();
    setPhase('idle');
    setIsPaused(false);
    setResponseText('');
    setEvaluationResult(null);
    setSpeechNotice('');
    setTimeLeft(
      currentScenario.type === 'spoken'
        ? currentScenario.prepSeconds
        : currentScenario.responseSeconds
    );
  }, [selectedId, currentScenario.type, currentScenario.prepSeconds, currentScenario.responseSeconds]);

  useEffect(() => {
    if (phase !== 'prep' && phase !== 'recording' && phase !== 'writing') return;
    if (isPaused && !strictMode) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (phase === 'prep') {
            startSpokenRecordingPhase();
            return currentScenario.responseSeconds;
          } else {
            handleStopAndSubmit();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused, strictMode, currentScenario]);

  const startSpokenRecordingPhase = () => {
    speechControllerRef.current?.stop();
    setPhase('recording');
    setTimeLeft(currentScenario.responseSeconds);
    speechControllerRef.current = startFrenchSpeechRecognition({
      onTranscript: (text) => setResponseText(text),
      onWaveformUpdate: (bars) => setWaveform(bars),
      onError: (msg) => setSpeechNotice(msg),
    });
  };

  const handleStartTask = () => {
    setEvaluationResult(null);
    if (currentScenario.type === 'spoken') {
      setPhase('prep');
      setTimeLeft(currentScenario.prepSeconds);
    } else {
      setPhase('writing');
      setTimeLeft(currentScenario.responseSeconds);
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
  };

  const handleStopAndSubmit = async () => {
    speechControllerRef.current?.stop();
    const inputToGrade =
      responseText.trim() ||
      (currentScenario.type === 'spoken'
        ? "Bonjour Monsieur, je suis desole pour ce probleme sur votre commande. Je vais voir avec le transporteur et nous allons vous envoyer un coursier express avant 18h avec 15% de remise."
        : "Bonjour Monsieur, suite a votre message pour la commande #FR-88210, le delai de 30 jours est depasse mais nous vous offrons un bon de 20% valable 6 mois. Cordialement.");

    if (!responseText.trim()) {
      setResponseText(inputToGrade);
    }

    setIsEvaluating(true);
    setPhase('graded');

    try {
      const res = await fetch('/api/ai/evaluate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawInput: inputToGrade,
          scenarioTitle: currentScenario.title,
          promptTask: currentScenario.promptTask,
          idealB2: currentScenario.idealB2,
          idealC1: currentScenario.idealC1,
          darijaTip: currentScenario.darijaTip,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setEvaluationResult(data.evaluation);
        onRecordResult({
          moduleName: `Pipplet (${currentScenario.type === 'spoken' ? 'Oral' : 'Écrit'})`,
          score: data.evaluation.overallScore,
          cefr: data.evaluation.overallCefr,
          weaknesses: data.evaluation.detectedWeaknesses || [],
        });
      } else {
        throw new Error('Fallback local');
      }
    } catch {
      const localEval = evaluateAndUpgradeFrenchResponse(inputToGrade, {
        title: currentScenario.title,
        idealB2: currentScenario.idealB2,
        idealC1: currentScenario.idealC1,
        darijaTip: currentScenario.darijaTip,
      });
      setEvaluationResult(localEval);
      onRecordResult({
        moduleName: `Pipplet (${currentScenario.type === 'spoken' ? 'Oral' : 'Écrit'})`,
        score: localEval.overallScore,
        cefr: localEval.overallCefr,
        weaknesses: localEval.detectedWeaknesses,
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleInsertAccent = (char: string) => {
    const el = textareaRef.current;
    if (!el) {
      setResponseText((prev) => prev + char);
      return;
    }
    const start = el.selectionStart ?? responseText.length;
    const end = el.selectionEnd ?? responseText.length;
    const next = responseText.slice(0, start) + char + responseText.slice(end);
    setResponseText(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + char.length, start + char.length);
    }, 10);
  };

  const handleGenerateAIScenario = async (type: 'spoken' | 'written') => {
    setIsGeneratingScenario(true);
    try {
      const res = await fetch('/api/ai/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          sector: type === 'spoken' ? 'Banque & Assurance VIP Lisbonne' : 'Support E-Commerce & Logistique Porto',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.scenario) {
          setScenarios((prev) => [data.scenario, ...prev]);
          setSelectedId(data.scenario.id);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  const formatMMSS = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isWarningFlash =
    (phase === 'writing' || phase === 'recording') && timeLeft <= 30 && timeLeft > 0;

  return (
    <div className="space-y-6">
      {/* Module Top Header & Scenario Switcher */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Module 01</span>
              <span aria-hidden="true">·</span>
              <span>Pipplet (by ETS) Corporate French Assessment</span>
              <span aria-hidden="true">·</span>
              <span>100% Réponses Ouvertes (Oral & Écrit)</span>
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Simulateur Pipplet — Scénarios Ouverts BPO Portugal
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={isGeneratingScenario}
              onClick={() => handleGenerateAIScenario('written')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingScenario ? 'Génération IA...' : 'Nouveau Scénario IA (Écrit)'}</span>
            </button>
            <button
              type="button"
              disabled={isGeneratingScenario}
              onClick={() => handleGenerateAIScenario('spoken')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Nouveau Scénario IA (Oral)</span>
            </button>
          </div>
        </div>

        {/* Scenario Selector Tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {scenarios.map((sc) => {
            const active = sc.id === currentScenario.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSelectedId(sc.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {sc.type === 'spoken' ? (
                  <Headphones className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="truncate max-w-[260px]">{sc.title}</span>
                <span className="font-mono text-[11px] opacity-80">[{sc.cefrTarget}]</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Pipplet Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Customer Prompt & Rubric Context */}
        <div className="lg:col-span-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{currentScenario.companyContext}</span>
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                Cible {currentScenario.cefrTarget}
              </span>
            </div>

            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              {currentScenario.title}
            </h3>

            {/* Customer Audio / Written Ticket Box */}
            <div className="rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {currentScenario.type === 'spoken'
                    ? 'Message Vocal du Client (Audio fr-FR)'
                    : 'Ticket / Courriel du Client'}
                </span>
                <button
                  type="button"
                  onClick={() => speakFrenchText(currentScenario.customerVoiceScript)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 text-xs font-semibold cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Écouter l’audio client</span>
                </button>
              </div>
              <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {currentScenario.customerVoiceScript}
              </p>
            </div>

            {/* Official Task Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Consigne Officielle Pipplet :
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentScenario.promptTask}
              </p>
            </div>

            {/* Key Points Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Critères attendus par l’examinateur :
              </span>
              <ul className="space-y-1.5">
                {currentScenario.keyPointsToCover.map((pt, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Super-Coach Darija Hint Toggle (Hidden in Strict Mode) */}
          {!strictMode && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowCoachHint((prev) => !prev)}
                className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <Languages className="w-4 h-4" />
                <span>
                  {showCoachHint
                    ? 'Masquer l’astuce Darija (إخفاء)'
                    : 'Astuce Coach en Darija avant de répondre (شرح ليا بالدارجة)'}
                </span>
              </button>
              {showCoachHint && (
                <div className="mt-3 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm font-arabic text-slate-900 dark:text-amber-100 leading-relaxed">
                  {currentScenario.darijaTip}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Active Timed Recording / Writing Arena */}
        <div className="lg:col-span-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between space-y-5">
          {/* Countdown Timer Bar */}
          <div
            className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border transition-colors ${
              isWarningFlash
                ? 'bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-200'
                : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock className={`w-5 h-5 ${isWarningFlash ? 'text-amber-500' : 'text-blue-600 dark:text-blue-400'}`} />
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {phase === 'prep'
                    ? 'Compte à rebours de Préparation (30s)'
                    : currentScenario.type === 'spoken'
                    ? 'Enregistrement Oral Pipplet (90s max)'
                    : 'Rédaction E-mail Chronométrée (5 min)'}
                </div>
                <div className="text-xl font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                  {formatMMSS(timeLeft)}
                  {isWarningFlash && (
                    <span className="ml-2 text-xs font-sans font-semibold text-amber-600 dark:text-amber-400">
                      — Relisez vos accents et accords (30 dernières secondes) !
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {phase === 'idle' && (
                <button
                  type="button"
                  onClick={handleStartTask}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  {currentScenario.type === 'spoken' ? (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Démarrer Préparation (30s)</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Lancer le Chronomètre (05:00)</span>
                    </>
                  )}
                </button>
              )}

              {phase === 'prep' && (
                <button
                  type="button"
                  onClick={startSpokenRecordingPhase}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>Passer à l’enregistrement maintenant</span>
                </button>
              )}

              {(phase === 'recording' || phase === 'writing') && !strictMode && (
                <button
                  type="button"
                  onClick={() => setIsPaused((p) => !p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                >
                  {isPaused ? 'Reprendre Timer' : 'Pause Coach'}
                </button>
              )}

              {!strictMode && (
                <button
                  type="button"
                  onClick={() =>
                    setResponseText(
                      currentScenario.type === 'spoken'
                        ? "Bonjour Monsieur Laurent, je suis desole pour le probleme concernant votre montre LX-904. Malgré que le colis soit bloque, j'ai demande un coursier express avant 18h et une remise de 15%."
                        : "Bonjour Monsieur,\n\nSuite a votre message pour la commande #FR-88210, je suis desole mais le delai de 30 jours est depasse (45 jours). Du coup je ne peux pas vous rembourser, mais je vous offre un bon de 20% valable 6 mois.\n\nCordialement."
                    )
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Insérer Brouillon B1/B2 Test
                </button>
              )}
            </div>
          </div>

          {/* Spoken Audio Waveform Visualizer (when scenario is spoken) */}
          {currentScenario.type === 'spoken' && (
            <div className="rounded-lg bg-slate-900 text-white p-4 space-y-3 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  {phase === 'recording'
                    ? 'Microphone Actif — Reconnaissance Vocale Web Speech (fr-FR)'
                    : 'Visualiseur Audio & Transcription Directe'}
                </span>
                <span className="font-mono">
                  {responseText.trim() ? `${responseText.trim().split(/\s+/).length} mots détectés` : 'Prêt'}
                </span>
              </div>

              <div className="h-14 flex items-end justify-between gap-1 px-2">
                {waveform.map((val, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t transition-all duration-100 ${
                      phase === 'recording' ? 'bg-blue-500' : 'bg-slate-700'
                    }`}
                    style={{ height: `${phase === 'recording' ? val : 18}%` }}
                  />
                ))}
              </div>

              {speechNotice && (
                <p className="text-xs text-amber-300">{speechNotice}</p>
              )}
            </div>
          )}

          {/* French Virtual Accent Bar */}
          <FrenchAccentBar onInsert={handleInsertAccent} />

          {/* Response Textarea (Works for Written Email OR Live Editable Spoken Transcript) */}
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <label htmlFor="pipplet-response-box" className="font-semibold text-slate-700 dark:text-slate-300">
                {currentScenario.type === 'spoken'
                  ? 'Transcription Orale (en direct ou saisie manuelle pour évaluation) :'
                  : 'Votre Réponse E-mail Client :'}
              </label>
              <span className="font-mono tabular-nums">
                {responseText.trim() ? responseText.trim().split(/\s+/).length : 0} mots
              </span>
            </div>

            <textarea
              id="pipplet-response-box"
              ref={textareaRef}
              rows={7}
              value={responseText}
              onPaste={(e) => {
                if (strictMode) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                setResponseText(e.target.value);
                if (phase === 'idle') {
                  setPhase(currentScenario.type === 'spoken' ? 'recording' : 'writing');
                }
              }}
              placeholder={
                currentScenario.type === 'spoken'
                  ? 'Parlez dans votre microphone après avoir cliqué sur Démarrer, ou saisissez votre script oral en français ici...'
                  : 'Rédigez votre e-mail professionnel en français (Salutation, Empathie, Solution, Formule de politesse)...'
              }
              className="w-full flex-1 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 p-4 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
            />
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                speechControllerRef.current?.stop();
                setPhase('idle');
                setResponseText('');
                setEvaluationResult(null);
                setTimeLeft(
                  currentScenario.type === 'spoken'
                    ? currentScenario.prepSeconds
                    : currentScenario.responseSeconds
                );
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>

            <button
              type="button"
              disabled={isEvaluating}
              onClick={handleStopAndSubmit}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {phase === 'recording' ? <Square className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              <span>
                {isEvaluating
                  ? 'Analyse Psychométrique IA en cours...'
                  : 'Soumettre & Débloquer le Comparateur B2 / C1 + Darija'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Tier Instant AI Answer Upgrader Output */}
      {evaluationResult && (
        <ThreeTierUpgraderCard
          result={evaluationResult}
          coachMode={!strictMode}
          onBookmarkPhrase={onBookmarkPhrase}
        />
      )}
    </div>
  );
};
