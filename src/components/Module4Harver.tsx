import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Clock,
  BookOpen,
  Scale,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Languages,
  Sparkles,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  HARVER_MULTI_CHATS,
  HARVER_CRM_POLICIES,
  HARVER_SJT_SCENARIOS,
} from '../data/assessmentBank';
import {
  evaluateAndUpgradeFrenchResponse,
  ThreeTierUpgradeResult,
  scoreToCEFR,
} from '../utils/scoring';
import { FrenchAccentBar } from './FrenchAccentBar';
import { ThreeTierUpgraderCard } from './ThreeTierUpgraderCard';
import { DarijaBiDiText } from '../utils/bidiUtils';

interface ChatMessage {
  sender: 'customer' | 'agent';
  text: string;
  timestamp: string;
  slaSeconds?: number;
}

interface CustomerSessionState {
  chatId: string;
  stageIndex: number;
  csat: number;
  messages: ChatMessage[];
  resolved: boolean;
}

interface Module4HarverProps {
  strictMode: boolean;
  onRecordResult: (entry: {
    moduleName: string;
    score: number;
    cefr: string;
    weaknesses: string[];
  }) => void;
  onBookmarkPhrase: (phrase: string, note: string) => void;
}

export const Module4Harver: React.FC<Module4HarverProps> = ({
  strictMode,
  onRecordResult,
  onBookmarkPhrase,
}) => {
  const [subTab, setSubTab] = useState<'4A_MULTICHAT' | '4B_SJT'>('4A_MULTICHAT');

  // --- Sub-Module 4A: 12-Minute Multi-Chat State ---
  const [globalClock, setGlobalClock] = useState<number>(720); // 12 minutes
  const [activeChatId, setActiveChatId] = useState<string>(HARVER_MULTI_CHATS[0].id);
  const [crmSearch, setCrmSearch] = useState<string>('');
  const [draftReply, setDraftReply] = useState<string>('');
  const [wpmSpeed, setWpmSpeed] = useState<number>(54);
  const [avgSlaSeconds, setAvgSlaSeconds] = useState<number>(28);
  const [lastUpgrade, setLastUpgrade] = useState<ThreeTierUpgradeResult | null>(null);
  const [showDarijaCoach, setShowDarijaCoach] = useState<boolean>(!strictMode);
  const [mobileCrmOpen, setMobileCrmOpen] = useState<boolean>(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    HARVER_MULTI_CHATS.forEach((c, idx) => {
      counts[c.id] = idx === 0 ? 0 : 1;
    });
    return counts;
  });

  const [sessions, setSessions] = useState<Record<string, CustomerSessionState>>(() => {
    const init: Record<string, CustomerSessionState> = {};
    for (const c of HARVER_MULTI_CHATS) {
      init[c.id] = {
        chatId: c.id,
        stageIndex: 0,
        csat: c.initialCsat,
        resolved: false,
        messages: [
          {
            sender: 'customer',
            text: c.stages[0].customerMessage,
            timestamp: '09:00',
          },
        ],
      };
    }
    return init;
  });

  const stageTimerStartRef = useRef<number>(Date.now());
  const typingStartRef = useRef<number | null>(null);

  useEffect(() => {
    stageTimerStartRef.current = Date.now();
    setUnreadCounts((prev) => ({ ...prev, [activeChatId]: 0 }));
  }, [activeChatId]);

  useEffect(() => {
    if (subTab !== '4A_MULTICHAT') return;
    const t = setInterval(() => {
      setGlobalClock((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [subTab]);

  const activeChatDef =
    HARVER_MULTI_CHATS.find((c) => c.id === activeChatId) || HARVER_MULTI_CHATS[0];
  const activeSession = sessions[activeChatId];
  const currentStage =
    activeChatDef.stages[activeSession.stageIndex] ||
    activeChatDef.stages[activeChatDef.stages.length - 1];

  const handleSendChatReply = () => {
    const text = draftReply.trim();
    if (!text) return;

    const nowSec = Math.max(4, Math.round((Date.now() - stageTimerStartRef.current) / 1000));
    const wordCount = text.split(/\s+/).length;
    const typingDurationMin = typingStartRef.current
      ? Math.max(0.12, (Date.now() - typingStartRef.current) / 60000)
      : 0.35;
    const calculatedWpm = Math.min(115, Math.max(32, Math.round(wordCount / typingDurationMin)));
    setWpmSpeed(calculatedWpm);
    setAvgSlaSeconds((prev) => Math.round((prev + nowSec) / 2));

    // Evaluate quality & keyword coverage
    const lower = text.toLowerCase();
    const matchedKeywords = currentStage.expectedKeywords.filter((kw) =>
      lower.includes(kw.toLowerCase())
    );
    const keywordRatio = matchedKeywords.length / currentStage.expectedKeywords.length;

    const upgrade = evaluateAndUpgradeFrenchResponse(
      text,
      {
        title: `${activeChatDef.customerName} (${activeChatDef.orderId})`,
        modality: 'written',
        idealB2: currentStage.idealReplyB2,
        idealReplyC1: currentStage.idealReplyC1,
        idealC1: currentStage.idealReplyC1,
        darijaTip: currentStage.darijaCoach,
      } as any
    );
    setLastUpgrade(upgrade);

    const csatBoost = Math.round(14 + keywordRatio * 22 + (nowSec <= 45 ? 8 : 0));
    const nextCsat = Math.min(99, activeSession.csat + csatBoost);
    const nextStageIdx = activeSession.stageIndex + 1;
    const hasMoreStages = nextStageIdx < activeChatDef.stages.length;

    const updatedMessages: ChatMessage[] = [
      ...activeSession.messages,
      {
        sender: 'agent',
        text,
        timestamp: '09:02',
        slaSeconds: nowSec,
      },
    ];

    if (hasMoreStages) {
      updatedMessages.push({
        sender: 'customer',
        text: activeChatDef.stages[nextStageIdx].customerMessage,
        timestamp: '09:03',
      });
    } else {
      updatedMessages.push({
        sender: 'customer',
        text: 'Parfait, merci infiniment pour votre efficacité et votre professionnalisme ! Bonne journée.',
        timestamp: '09:04',
      });
    }

    setSessions((prev) => ({
      ...prev,
      [activeChatId]: {
        ...activeSession,
        stageIndex: hasMoreStages ? nextStageIdx : activeSession.stageIndex,
        csat: nextCsat,
        resolved: !hasMoreStages,
        messages: updatedMessages,
      },
    }));

    setDraftReply('');
    typingStartRef.current = null;
    stageTimerStartRef.current = Date.now();

    onRecordResult({
      moduleName: `Harver Multi-Chat (${activeChatDef.orderId})`,
      score: Math.round((upgrade.overallScore + nextCsat) / 2),
      cefr: upgrade.overallCefr,
      weaknesses: upgrade.detectedWeaknesses,
    });
  };

  // --- Sub-Module 4B: Situational Judgment Tests (SJT) State ---
  const [sjtIndex, setSjtIndex] = useState<number>(0);
  const currentSjt = HARVER_SJT_SCENARIOS[sjtIndex] || HARVER_SJT_SCENARIOS[0];
  const [bestChoice, setBestChoice] = useState<string | null>(null);
  const [worstChoice, setWorstChoice] = useState<string | null>(null);
  const [sjtSubmitted, setSjtSubmitted] = useState<boolean>(false);

  const handleValidateSjt = () => {
    if (!bestChoice || !worstChoice) return;
    setSjtSubmitted(true);
    const bestOk = bestChoice === currentSjt.bestOptionId;
    const worstOk = worstChoice === currentSjt.worstOptionId;
    const score = bestOk && worstOk ? 100 : bestOk || worstOk ? 50 : 15;

    onRecordResult({
      moduleName: `Harver SJT (${currentSjt.title.split(':')[0]})`,
      score,
      cefr: scoreToCEFR(score),
      weaknesses:
        score < 100 ? ['Jugement Situationnel BPO (Équilibre FCR / RGPD / Empathie)'] : [],
    });
  };

  const filteredPolicies = HARVER_CRM_POLICIES.filter(
    (p) =>
      p.title.toLowerCase().includes(crmSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(crmSearch.toLowerCase()) ||
      p.summary.toLowerCase().includes(crmSearch.toLowerCase())
  );

  const avgCsat = Math.round(
    (Object.values(sessions) as CustomerSessionState[]).reduce((acc, s) => acc + s.csat, 0) /
      HARVER_MULTI_CHATS.length
  );

  const formatClock = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Header & Sub-Module Switcher (4A Multi-Chat vs 4B SJT) */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Module 04</span>
              <span aria-hidden="true">·</span>
              <span>Harver BPO Contact Center Assessment</span>
              <span aria-hidden="true">·</span>
              <span>Multi-Chat Simultané (3 Clients) + SJT Psychométrique</span>
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
              Simulateur Harver — Poste Agent Multi-Chat & Jugement Situationnel
            </h2>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setSubTab('4A_MULTICHAT')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                subTab === '4A_MULTICHAT'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>4A. Live Multi-Chat (3 Clients + CRM)</span>
            </button>
            <button
              type="button"
              onClick={() => setSubTab('4B_SJT')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                subTab === '4B_SJT'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>4B. Situational Judgment Tests (SJT)</span>
            </button>
          </div>
        </div>
      </div>

      {subTab === '4A_MULTICHAT' ? (
        <div className="space-y-6">
          {/* Live Telemetry Strip: SLA, WPM, Global CSAT, Timer */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">Chronomètre Session (12m)</span>
              <div className="text-2xl font-mono font-bold tabular-nums text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{formatClock(globalClock)}</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">SLA Temps de Réponse Moyen</span>
              <div className="text-2xl font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
                {avgSlaSeconds}s <span className="text-xs font-normal text-slate-400">(Cible &lt; 60s)</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">Vitesse de Frappe Clavier</span>
              <div className="text-2xl font-mono font-bold tabular-nums text-blue-600 dark:text-blue-400 mt-0.5">
                {wpmSpeed} WPM
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">CSAT Global (3 Clients)</span>
              <div className="text-2xl font-mono font-bold tabular-nums text-amber-600 dark:text-amber-400 mt-0.5">
                {avgCsat}% {avgCsat >= 80 ? '😊' : avgCsat >= 55 ? '😐' : '😡'}
              </div>
            </div>
          </div>

          {/* 2-Column Agent Desk: Left = 3-Customer Multi-Chat | Right = CRM Knowledge Base */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 7 Cols: 3-Customer Chat Tabs & Active Conversation */}
            <div className="lg:col-span-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between space-y-4">
              {/* Sticky Customer Switcher Bar + Mobile CRM Bottom Sheet Trigger */}
              <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pb-2 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Files d’attente actives (3 Clients en simultané) :
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileCrmOpen(true)}
                    className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>📚 Ouvrir CRM & Politiques TP</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {HARVER_MULTI_CHATS.map((chat, idx) => {
                    const sess = sessions[chat.id];
                    const isActive = chat.id === activeChatId;
                    const unread = unreadCounts[chat.id] || 0;
                    const shortBadge =
                      idx === 0
                        ? 'Client 1 🔴 Urgent'
                        : idx === 1
                        ? 'Client 2 🟡 Facture'
                        : 'Client 3 🔵 Tech';
                    return (
                      <button
                        key={chat.id}
                        type="button"
                        onClick={() => setActiveChatId(chat.id)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 text-[11px] sm:text-xs font-bold">
                          <span className="truncate">{shortBadge}</span>
                          {unread > 0 && !isActive && (
                            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold shrink-0">
                              {unread}
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-[11px] mt-1 flex items-center justify-between gap-1 ${
                            isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <span className="truncate">{chat.customerName}</span>
                          <span className="font-mono font-semibold shrink-0">{sess.csat}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat Message Thread */}
              <div className="h-72 overflow-y-auto rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                {activeSession.messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      m.sender === 'agent' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="text-[11px] text-slate-400 mb-1">
                      {m.sender === 'agent'
                        ? `Vous (Conseiller BPO) · SLA ${m.slaSeconds ?? 18}s`
                        : `${activeChatDef.customerName} (${activeChatDef.customerTier})`}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.sender === 'agent'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coach Quick Assist & French Accent Bar */}
              <div className="space-y-3">
                <FrenchAccentBar
                  onInsert={(ch) => setDraftReply((prev) => prev + ch)}
                  label="Accents Chat :"
                />

                {!strictMode && (
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3.5 py-2">
                    <span className="text-xs text-amber-800 dark:text-amber-300">
                      <strong>Indice CRM :</strong> {currentStage.crmHint}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDraftReply(currentStage.idealReplyC1)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Insérer Modèle C1
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDarijaCoach((prev) => !prev)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
                      >
                        <Languages className="w-3.5 h-3.5" /> Darija
                      </button>
                    </div>
                  </div>
                )}

                {showDarijaCoach && !strictMode && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <DarijaBiDiText
                      text={currentStage.darijaCoach}
                      className="text-sm text-slate-900 dark:text-amber-100"
                    />
                  </div>
                )}

                {/* Chat Reply Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={draftReply}
                    onChange={(e) => {
                      if (!typingStartRef.current) typingStartRef.current = Date.now();
                      setDraftReply(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendChatReply();
                      }
                    }}
                    placeholder={`Répondre à ${activeChatDef.customerName} (${activeChatDef.orderId})...`}
                    className="flex-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleSendChatReply}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Mock CRM Knowledge Base & Policy Lookup (Desktop Side-by-Side) */}
            <div className="hidden lg:flex lg:col-span-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
                      Base de Connaissances CRM & Politiques SLA
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500">3 Procédures</span>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={crmSearch}
                    onChange={(e) => setCrmSearch(e.target.value)}
                    placeholder="Rechercher #LP-9920, #FAC-4410, #TEC-7731, remboursement..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* CRM Policy Cards */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {filteredPolicies.map((pol) => (
                    <div
                      key={pol.id}
                      className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {pol.code}
                        </span>
                        <span className="text-slate-500">{pol.category}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {pol.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {pol.summary}
                      </p>
                      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        <span>Plafond : {pol.compensationLimit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                Vérifiez systématiquement les plafonds de compensation dans le CRM avant de promettre un geste commercial au client.
              </div>
            </div>
          </div>

          {/* Mobile Slide-Up Bottom Sheet Modal for CRM & Politiques TP */}
          {mobileCrmOpen && (
            <div
              className="fixed inset-0 z-50 lg:hidden bg-slate-950/70 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4"
              onClick={() => setMobileCrmOpen(false)}
            >
              <div
                className="w-full max-h-[82vh] rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 p-5 flex flex-col space-y-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                      📚 CRM & Politiques Teleperformance
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileCrmOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={crmSearch}
                    onChange={(e) => setCrmSearch(e.target.value)}
                    placeholder="Rechercher #LP-9920, #FAC-4410, #TEC-7731..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                  {filteredPolicies.map((pol) => (
                    <div
                      key={pol.id}
                      className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {pol.code}
                        </span>
                        <span className="text-slate-500">{pol.category}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {pol.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {pol.summary}
                      </p>
                      <div className="pt-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        Plafond : {pol.compensationLimit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {lastUpgrade && (
            <ThreeTierUpgraderCard
              result={lastUpgrade}
              coachMode={!strictMode}
              onBookmarkPhrase={onBookmarkPhrase}
            />
          )}
        </div>
      ) : (
        /* Sub-Module 4B: Situational Judgment Tests (SJT) */
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Test de Jugement Situationnel Harver · Cas {sjtIndex + 1} sur {HARVER_SJT_SCENARIOS.length}
              </span>
              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mt-0.5">
                {currentSjt.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {HARVER_SJT_SCENARIOS.map((sc, idx) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setSjtIndex(idx);
                    setBestChoice(null);
                    setWorstChoice(null);
                    setSjtSubmitted(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    idx === sjtIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Cas #{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs font-medium text-slate-500">
              Contexte : {currentSjt.workplaceContext}
            </div>
            <p className="text-sm leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
              {currentSjt.dilemma}
            </p>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400">
            <strong>Consigne Psychométrique Harver :</strong> Sélectionnez à la fois la{' '}
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              MEILLEURE action (Plus efficace)
            </span>{' '}
            et la{' '}
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              PIRE action (Moins efficace)
            </span>{' '}
            parmi les 4 propositions ci-dessous.
          </div>

          <div className="space-y-3">
            {currentSjt.options.map((opt) => {
              const isBest = bestChoice === opt.id;
              const isWorst = worstChoice === opt.id;

              return (
                <div
                  key={opt.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {opt.id}
                    </span>
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {opt.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={sjtSubmitted}
                      onClick={() => {
                        if (worstChoice === opt.id) setWorstChoice(null);
                        setBestChoice(opt.id);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        isBest
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Meilleure</span>
                    </button>

                    <button
                      type="button"
                      disabled={sjtSubmitted}
                      onClick={() => {
                        if (bestChoice === opt.id) setBestChoice(null);
                        setWorstChoice(opt.id);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        isWorst
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-rose-500'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Pire</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setBestChoice(null);
                setWorstChoice(null);
                setSjtSubmitted(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser mes choix</span>
            </button>

            <button
              type="button"
              disabled={!bestChoice || !worstChoice || sjtSubmitted}
              onClick={handleValidateSjt}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider Meilleure & Pire Actions</span>
            </button>
          </div>

          {sjtSubmitted && (
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400">
                  Meilleure Action Officielle : Option {currentSjt.bestOptionId} (Votre choix : {bestChoice})
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-rose-600 dark:text-rose-400">
                  Pire Action Officielle : Option {currentSjt.worstOptionId} (Votre choix : {worstChoice})
                </span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {currentSjt.psychometricRationaleFr}
              </p>
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <DarijaBiDiText
                  text={currentSjt.darijaExplanation}
                  className="text-base text-slate-900 dark:text-amber-100"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
