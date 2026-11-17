import React, { useState, useRef } from 'react';
import {
  Building2,
  PhoneCall,
  Volume2,
  Mic,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Languages,
  Send,
  RotateCcw,
  ShieldCheck,
  Plane,
  ShoppingBag,
  Landmark,
} from 'lucide-react';
import {
  TP_PORTUGAL_CLIENT_PROJECTS,
  TP_PORTUGAL_INTERVIEW_QUESTIONS,
  TPClientSimulationCase,
  TPInterviewQuestion,
} from '../data/tpPortugalBank';
import {
  evaluateAndUpgradeFrenchResponse,
  analyzeSpeechMetrics,
  ThreeTierUpgradeResult,
  SpeechMetricsResult,
} from '../utils/scoring';
import {
  speakFrenchText,
  startFrenchSpeechRecognition,
  LiveSpeechController,
} from '../utils/speechAndAudio';
import { FrenchAccentBar } from './FrenchAccentBar';
import { ThreeTierUpgraderCard } from './ThreeTierUpgraderCard';
import { DarijaBiDiText } from '../utils/bidiUtils';

interface Module7TPPortugalProps {
  strictMode: boolean;
  onRecordResult: (entry: {
    moduleName: string;
    score: number;
    cefr: string;
    weaknesses: string[];
  }) => void;
  onBookmarkPhrase: (phrase: string, note: string) => void;
}

export const Module7TPPortugal: React.FC<Module7TPPortugalProps> = ({
  strictMode,
  onRecordResult,
  onBookmarkPhrase,
}) => {
  const [subTab, setSubTab] = useState<'7A_PROJECTS' | '7B_INTERVIEW'>('7A_PROJECTS');

  // --- Sub-Module 7A: TP Portugal Real Client Project Simulator ---
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    TP_PORTUGAL_CLIENT_PROJECTS[0].id
  );
  const currentProject: TPClientSimulationCase =
    TP_PORTUGAL_CLIENT_PROJECTS.find((p) => p.id === selectedProjectId) ||
    TP_PORTUGAL_CLIENT_PROJECTS[0];

  const [completedDeescalationSteps, setCompletedDeescalationSteps] = useState<string[]>([]);
  const [projectDraft, setProjectDraft] = useState<string>('');
  const [projectEvaluation, setProjectEvaluation] = useState<ThreeTierUpgradeResult | null>(null);
  const [showProjectDarija, setShowProjectDarija] = useState<boolean>(!strictMode);

  // --- Sub-Module 7B: Official TP Portugal Telephone Interview Simulator (FR C2 + EN B2) ---
  const [interviewIdx, setInterviewIdx] = useState<number>(0);
  const currentInterviewQ: TPInterviewQuestion =
    TP_PORTUGAL_INTERVIEW_QUESTIONS[interviewIdx] || TP_PORTUGAL_INTERVIEW_QUESTIONS[0];

  const [interviewTranscript, setInterviewTranscript] = useState<string>('');
  const [isInterviewRecording, setIsInterviewRecording] = useState<boolean>(false);
  const [interviewSpeechMetrics, setInterviewSpeechMetrics] =
    useState<SpeechMetricsResult | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);
  const [showInterviewDarija, setShowInterviewDarija] = useState<boolean>(!strictMode);

  const interviewSpeechRef = useRef<LiveSpeechController | null>(null);
  const interviewStartTimeRef = useRef<number>(Date.now());

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setCompletedDeescalationSteps([]);
    setProjectDraft('');
    setProjectEvaluation(null);
  };

  const handleInsertDeescalationStep = (stepName: string, phrase: string) => {
    if (!completedDeescalationSteps.includes(stepName)) {
      setCompletedDeescalationSteps((prev) => [...prev, stepName]);
    }
    setProjectDraft((prev) => (prev.trim() ? `${prev.trim()} ${phrase}` : phrase));
  };

  const handleSubmitProjectSimulation = () => {
    const text =
      projectDraft.trim() ||
      currentProject.tpFiveSteps.map((s) => s.frenchTargetPhrase).join(' ');
    if (!projectDraft.trim()) setProjectDraft(text);

    const idealC1 = currentProject.idealFullResponseC1;
    const combinedDarija = currentProject.tpFiveSteps
      .map((s) => s.darijaExplanation)
      .join(' · ');

    const upgrade = evaluateAndUpgradeFrenchResponse(text, {
      title: currentProject.projectTitle,
      modality: 'written',
      idealB2:
        "Bonjour, je comprends l'urgence de votre situation et je vérifie immédiatement votre dossier dans notre CRM afin de vous proposer une solution rapide et conforme à nos procédures.",
      idealC1,
      darijaTip: combinedDarija,
    });

    setProjectEvaluation(upgrade);
    onRecordResult({
      moduleName: `TP Portugal Lisbon Hub (${currentProject.projectBadge})`,
      score: upgrade.overallScore,
      cefr: upgrade.overallCefr,
      weaknesses: upgrade.detectedWeaknesses,
    });
  };

  const handleToggleInterviewMic = () => {
    if (isInterviewRecording) {
      interviewSpeechRef.current?.stop();
      setIsInterviewRecording(false);
      handleEvaluateInterviewQuestion();
    } else {
      setInterviewSpeechMetrics(null);
      setIsInterviewRecording(true);
      interviewStartTimeRef.current = Date.now();
      interviewSpeechRef.current = startFrenchSpeechRecognition({
        lang: currentInterviewQ.language,
        onTranscript: (t) => setInterviewTranscript(t),
      });
    }
  };

  const handleEvaluateInterviewQuestion = () => {
    interviewSpeechRef.current?.stop();
    setIsInterviewRecording(false);

    const candidateText =
      interviewTranscript.trim() || currentInterviewQ.modelAnswer;
    if (!interviewTranscript.trim()) {
      setInterviewTranscript(candidateText);
    }

    const elapsedSec = Math.max(
      6,
      Math.round((Date.now() - interviewStartTimeRef.current) / 1000)
    );
    const metrics = analyzeSpeechMetrics({
      targetText: currentInterviewQ.modelAnswer,
      spokenTranscript: candidateText,
      durationSeconds: elapsedSec,
    });
    setInterviewSpeechMetrics(metrics);
    setShowModelAnswer(true);

    onRecordResult({
      moduleName: `Entretien RH TP Lisbonne (${currentInterviewQ.badgeLabel})`,
      score: Math.round((metrics.matchAccuracy + metrics.confidenceRhythmScore) / 2),
      cefr: currentInterviewQ.language === 'fr-FR' ? 'C1' : 'B2',
      weaknesses:
        metrics.fillerCount > 0 ? ['Hésitations orales pendant entretien RH'] : [],
    });
  };

  const getSectorIcon = (id: string) => {
    if (id.includes('fintech')) return <Landmark className="w-4 h-4 text-blue-500" />;
    if (id.includes('airline')) return <Plane className="w-4 h-4 text-sky-500" />;
    return <ShoppingBag className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner: TP Portugal Atlantic Experience Hub */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
              <span>Module 07</span>
              <span aria-hidden="true">·</span>
              <span>Teleperformance Portugal — Lisbonne (Parque das Nações)</span>
              <span aria-hidden="true">·</span>
              <span>Atlantic Experience Recruitment Program</span>
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Hub Spécial Teleperformance Portugal — Projets Réels & Entretien Téléphonique RH
            </h2>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start">
            <button
              type="button"
              onClick={() => setSubTab('7A_PROJECTS')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                subTab === '7A_PROJECTS'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>7A. Projets Clients TP (Fintech / Voyages / Luxe)</span>
            </button>
            <button
              type="button"
              onClick={() => setSubTab('7B_INTERVIEW')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                subTab === '7B_INTERVIEW'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>7B. Entretien RH (5 Q Français C2 + 3 Q Anglais B2)</span>
            </button>
          </div>
        </div>
      </div>

      {subTab === '7A_PROJECTS' ? (
        /* SUB-MODULE 7A: TP Portugal Real Client Project Simulator */
        <div className="space-y-6">
          {/* 3 Project Cards Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TP_PORTUGAL_CLIENT_PROJECTS.map((proj) => {
              const isSelected = proj.id === selectedProjectId;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => handleSelectProject(proj.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-blue-500'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 font-mono font-semibold ${
                          isSelected ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {getSectorIcon(proj.id)}
                        {proj.projectBadge}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        TP Lisbonne
                      </span>
                    </div>
                    <h3 className="text-sm font-display font-bold leading-snug">
                      {proj.projectTitle}
                    </h3>
                  </div>

                  <div
                    className={`text-[11px] pt-2 border-t ${
                      isSelected
                        ? 'border-blue-400/40 text-blue-100'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {proj.locationHub}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Project Workspace */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                  {currentProject.locationHub} · Profil Client : {currentProject.clientPersona}
                </span>
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentProject.projectTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakFrenchText(currentProject.customerOpeningQuote)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Écouter le Client (fr-FR)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowProjectDarija((s) => !s)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 cursor-pointer"
                >
                  <Languages className="w-4 h-4" />
                  <span>{showProjectDarija ? 'Masquer Darija' : 'Briefing Darija'}</span>
                </button>
              </div>
            </div>

            {/* Client Crisis Prompt */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                {currentProject.scenarioDescription}
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                {currentProject.customerOpeningQuote}
              </p>
            </div>

            {/* 5-Step TP De-escalation Method Builder */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Méthode Officielle Teleperformance en 5 Étapes (Cliquez pour assembler votre réponse C1) :
                </span>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  {completedDeescalationSteps.length} / 5 étapes intégrées
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                {currentProject.tpFiveSteps.map((st, idx) => {
                  const done = completedDeescalationSteps.includes(st.stepName);
                  return (
                    <div
                      key={st.stepName}
                      className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                        done
                          ? 'bg-emerald-500/10 border-emerald-500/40'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                          {st.stepName}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          « {st.frenchTargetPhrase} »
                        </p>
                        {showProjectDarija && (
                          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                            <DarijaBiDiText
                              text={st.darijaExplanation}
                              className="text-[11px] text-amber-800 dark:text-amber-200"
                            />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleInsertDeescalationStep(st.stepName, st.frenchTargetPhrase)
                        }
                        className="w-full py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      >
                        {done ? '✓ Étape Insérée' : `+ Insérer Étape ${idx + 1}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Candidate Response Box */}
            <div className="space-y-3">
              <FrenchAccentBar
                onInsert={(ch) => setProjectDraft((prev) => prev + ch)}
                label="Accents Français :"
              />

              <textarea
                rows={5}
                value={projectDraft}
                onChange={(e) => setProjectDraft(e.target.value)}
                placeholder="Rédigez votre réponse complète selon les 5 étapes Teleperformance ou cliquez sur les étapes ci-dessus..."
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-4 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProjectDraft('');
                    setCompletedDeescalationSteps([]);
                    setProjectEvaluation(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitProjectSimulation}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Évaluer ma Réponse Projet TP (Critères Écrits C1)</span>
                </button>
              </div>
            </div>

            {projectEvaluation && (
              <ThreeTierUpgraderCard
                result={projectEvaluation}
                coachMode={!strictMode}
                onBookmarkPhrase={onBookmarkPhrase}
              />
            )}
          </div>
        </div>
      ) : (
        /* SUB-MODULE 7B: Official TP Portugal Telephone Interview Simulator (French C2 + Working English B2 Check) */
        <div className="space-y-6">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5">
            {/* Horizontal Snap Selector for 8 Questions (5 FR + 3 EN) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  8 Questions Officielles Recruteur Teleperformance Lisbonne (5 en Français C1/C2 + 3 en Anglais B2) :
                </span>
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                  Question {interviewIdx + 1} / {TP_PORTUGAL_INTERVIEW_QUESTIONS.length}
                </span>
              </div>

              <div className="flex overflow-x-auto snap-x gap-2.5 pb-2 no-scrollbar">
                {TP_PORTUGAL_INTERVIEW_QUESTIONS.map((q, idx) => {
                  const active = idx === interviewIdx;
                  const isEnglish = q.language === 'en-US';
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        interviewSpeechRef.current?.stop();
                        setIsInterviewRecording(false);
                        setInterviewIdx(idx);
                        setInterviewTranscript('');
                        setInterviewSpeechMetrics(null);
                        setShowModelAnswer(false);
                      }}
                      className={`snap-start shrink-0 px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer min-w-[215px] ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            active
                              ? 'bg-white/20 text-white'
                              : isEnglish
                              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                              : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {isEnglish ? '🇬🇧 EN B2 Check' : '🇫🇷 FR C1/C2'}
                        </span>
                        <span>Q{idx + 1}</span>
                      </div>
                      <div className="text-xs font-semibold leading-snug">{q.badgeLabel}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Recruiter Question Card */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-600/15 text-blue-700 dark:text-blue-300">
                    {currentInterviewQ.language === 'en-US'
                      ? '🇬🇧 Working English B2 Check'
                      : '🇫🇷 Français C1/C2'}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {currentInterviewQ.badgeLabel}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    speakFrenchText(currentInterviewQ.recruiterQuestion, {
                      lang: currentInterviewQ.language,
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>
                    {currentInterviewQ.language === 'en-US'
                      ? 'Listen to Recruiter (en-US)'
                      : 'Écouter le Recruteur RH (fr-FR)'}
                  </span>
                </button>
              </div>

              <p className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentInterviewQ.recruiterQuestion}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                <strong>Objectif RH :</strong> {currentInterviewQ.recruiterSubtext}
              </p>
            </div>

            {/* Candidate Voice Recording & Transcript */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="tp-interview-response"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Votre Réponse Orale ou Écrite ({currentInterviewQ.language}) :
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModelAnswer((s) => !s)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {showModelAnswer ? 'Masquer Modèle RH' : 'Voir Réponse Modèle & Astuces RH'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleInterviewMic}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      isInterviewRecording
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>
                      {isInterviewRecording
                        ? 'Arrêter & Évaluer'
                        : `Répondre au Micro (${currentInterviewQ.language})`}
                    </span>
                  </button>
                </div>
              </div>

              <textarea
                id="tp-interview-response"
                rows={4}
                value={interviewTranscript}
                onChange={(e) => setInterviewTranscript(e.target.value)}
                placeholder={
                  currentInterviewQ.language === 'en-US'
                    ? 'Speak into your microphone or type your B2+ English interview answer here...'
                    : 'Parlez au microphone ou saisissez votre réponse d’entretien téléphonique ici...'
                }
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-3.5 text-sm text-slate-900 dark:text-slate-100"
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShowInterviewDarija((s) => !s)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 cursor-pointer"
                >
                  <Languages className="w-4 h-4" />
                  <span>
                    {showInterviewDarija
                      ? 'Masquer Conseil Darija'
                      : 'Recruiter Insider Tip (بالدارجة)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleEvaluateInterviewQuestion}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Valider & Analyser ma Réponse RH</span>
                </button>
              </div>
            </div>

            {/* Speech Metrics Result */}
            {interviewSpeechMetrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Pertinence Lexicale RH</span>
                  <div className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {interviewSpeechMetrics.matchAccuracy}%
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Débit Oral</span>
                  <div className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                    {interviewSpeechMetrics.wpm} WPM
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Hésitations</span>
                  <div className="text-xl font-mono font-bold text-amber-600 dark:text-amber-400">
                    {interviewSpeechMetrics.fillerCount}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Confiance & Impact</span>
                  <div className="text-xl font-mono font-bold text-slate-900 dark:text-white">
                    {interviewSpeechMetrics.confidenceRhythmScore}/100
                  </div>
                </div>
              </div>
            )}

            {/* Model Answer & Red Flags */}
            {showModelAnswer && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">
                      ✓ Réponse Modèle Attendue par Teleperformance ({currentInterviewQ.language})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        speakFrenchText(currentInterviewQ.modelAnswer, {
                          lang: currentInterviewQ.language,
                        })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Écouter Modèle
                    </button>
                  </div>
                  <p className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed">
                    « {currentInterviewQ.modelAnswer} »
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-rose-700 dark:text-rose-300">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Red Flags Éliminatoires à Éviter Absolument</span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {currentInterviewQ.redFlagsToAvoid}
                  </p>
                </div>
              </div>
            )}

            {/* Darija Recruiter Insider Tip */}
            {showInterviewDarija && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <div className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  Recruiter Insider Tip (نصيحة سرية من قلب الـ RH ديال لشبونة) :
                </div>
                <DarijaBiDiText
                  text={currentInterviewQ.darijaRecruiterTip}
                  className="text-sm text-slate-900 dark:text-amber-100"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
