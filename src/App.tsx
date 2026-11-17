import React, { useState, useEffect } from 'react';
import {
  Headphones,
  Mic,
  ShieldCheck,
  MessageSquare,
  TrendingUp,
  BookOpen,
  Building2,
  Sun,
  Moon,
  Sparkles,
  Lock,
  Download,
  Smartphone,
  X,
} from 'lucide-react';
import { Module1Pipplet } from './components/Module1Pipplet';
import { Module2Versant } from './components/Module2Versant';
import { Module3TestGorilla } from './components/Module3TestGorilla';
import { Module4Harver } from './components/Module4Harver';
import { Module5EfSet } from './components/Module5EfSet';
import { Module6VaultAndAnalytics, TestHistoryEntry } from './components/Module6VaultAndAnalytics';
import { Module7TPPortugal } from './components/Module7TPPortugal';
import { PanicSosDrawer } from './components/PanicSosDrawer';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        aria-label="Installer l'application mobile FR-PRO TP"
        className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span className="hidden sm:inline">{isIOS ? 'App iOS' : 'Installer App'}</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
                  Installer FR-PRO TP (Mobile PWA)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Fermer la fenêtre d'installation"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong>Sur iPhone / Safari iOS :</strong> Appuyez sur le bouton{' '}
                <strong>Partager</strong> dans la barre inférieure, puis sélectionnez{' '}
                <strong>Sur l’écran d’accueil</strong>.
              </p>
              <p>
                <strong>Sur Android / Chrome :</strong> Ouvrez le menu du navigateur (⋮) puis appuyez sur{' '}
                <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full min-h-[44px] rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};

type ActiveModuleId =
  | 'MOD1_PIPPLET'
  | 'MOD2_VERSANT'
  | 'MOD3_TESTGORILLA'
  | 'MOD4_HARVER'
  | 'MOD5_EFSET'
  | 'MOD6_VAULT'
  | 'MOD7_TP_LISBON';

const STORAGE_HISTORY_KEY = 'fr_pro_portugal_history_v1';
const STORAGE_BOOKMARKS_KEY = 'fr_pro_portugal_bookmarks_v1';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModuleId>('MOD1_PIPPLET');
  const [strictMode, setStrictMode] = useState<boolean>(false); // Default to AI Super-Coach Mode so Darija & hints are immediately discoverable
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [proctorWarnings, setProctorWarnings] = useState<number>(0);

  const [history, setHistory] = useState<TestHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'seed-1',
        timestamp: 'Session initiale de référence',
        moduleName: 'Diagnostic Initial BPO Lisbonne',
        score: 79,
        cefr: 'C1',
        weaknesses: ['Subjonctif après bien que', 'Conditionnel de politesse'],
      },
    ];
  });

  const [bookmarks, setBookmarks] = useState<Array<{ phrase: string; note: string }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Proctoring anti-distraction visibility/blur listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && strictMode) {
        setProctorWarnings((prev) => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [strictMode]);

  const handleRecordResult = (entry: {
    moduleName: string;
    score: number;
    cefr: string;
    weaknesses: string[];
  }) => {
    const newItem: TestHistoryEntry = {
      id: `res-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      ...entry,
    };
    setHistory((prev) => {
      const next = [newItem, ...prev].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleBookmarkPhrase = (phrase: string, note: string) => {
    setBookmarks((prev) => {
      const next = [{ phrase, note }, ...prev];
      try {
        localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleTriggerFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    } catch {
      // ignore in sandboxed iframe
    }
  };

  const latestCefr = history[0]?.cefr || 'C1';
  const latestScore = history[0]?.score || 79;

  const modules: Array<{
    id: ActiveModuleId;
    shortLabel: string;
    mobileLabel: string;
    fullTitle: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'MOD1_PIPPLET',
      shortLabel: '1. Pipplet ETS',
      mobileLabel: 'Pipplet',
      fullTitle: 'Pipplet Open-Response (Oral & Écrit)',
      icon: Headphones,
    },
    {
      id: 'MOD2_VERSANT',
      shortLabel: '2. Pearson Versant',
      mobileLabel: 'Versant',
      fullTitle: 'Versant Rapid-Fire Lab (20–80)',
      icon: Mic,
    },
    {
      id: 'MOD3_TESTGORILLA',
      shortLabel: '3. TestGorilla B2/C1',
      mobileLabel: 'Gorilla',
      fullTitle: 'TestGorilla Proctored Screening',
      icon: ShieldCheck,
    },
    {
      id: 'MOD4_HARVER',
      shortLabel: '4. Harver Multi-Chat & SJT',
      mobileLabel: 'Harver',
      fullTitle: 'Harver BPO Desk (3 Chats + CRM + SJT)',
      icon: MessageSquare,
    },
    {
      id: 'MOD5_EFSET',
      shortLabel: '5. EF SET Adaptatif',
      mobileLabel: 'EF SET',
      fullTitle: 'EF SET CAT (Certificat Officiel)',
      icon: TrendingUp,
    },
    {
      id: 'MOD7_TP_LISBON',
      shortLabel: '7. TP Portugal Lisbon',
      mobileLabel: 'TP Lisbon',
      fullTitle: 'Teleperformance Portugal — Atlantic Experience (Lisbonne)',
      icon: Building2,
    },
    {
      id: 'MOD6_VAULT',
      shortLabel: '6. BPO Vault & Coach',
      mobileLabel: 'Vault',
      fullTitle: 'Cheat-Vault, Shadowing & Analytics',
      icon: BookOpen,
    },
  ];

  const mobileBottomNavItems = modules.filter((m) =>
    [
      'MOD1_PIPPLET',
      'MOD2_VERSANT',
      'MOD3_TESTGORILLA',
      'MOD4_HARVER',
      'MOD7_TP_LISBON',
      'MOD6_VAULT',
    ].includes(m.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0F172A] dark:text-slate-100">
      {/* Ultra-Compact Mobile & Desktop Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-2 sm:gap-6 px-3 sm:px-6 py-2.5 sm:py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 no-print">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveModule('MOD1_PIPPLET');
            }}
            className="text-sm sm:text-lg font-display font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
          >
            FR-PRO PORTUGAL
          </a>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            {latestCefr} · {latestScore}%
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav
          aria-label="Navigation principale des modules"
          className="hidden xl:flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300"
        >
          {modules.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveModule(m.id)}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeModule === m.id
                  ? 'text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-4'
                  : ''
              }`}
            >
              {m.shortLabel}
            </button>
          ))}
        </nav>

        {/* Quick Mode Toggle (Mobile & Desktop) + PWA + Dark/Light */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mobile Quick Mode Pill */}
          <button
            type="button"
            onClick={() => setStrictMode((s) => !s)}
            className={`md:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer ${
              !strictMode
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {!strictMode ? (
              <>
                <Sparkles className="w-3 h-3" />
                <span>Coach Darija</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                <span>Exam</span>
              </>
            )}
          </button>

          <PWAInstallButton />

          <button
            type="button"
            onClick={() => setActiveModule('MOD6_VAULT')}
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            BPO Cheat-Vault
          </button>

          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            aria-label={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Secondary Context & Desktop/Tablet Mode Switch Bar */}
      <div className="hidden md:block bg-slate-100/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 no-print">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Module Actif :{' '}
              <span className="text-blue-600 dark:text-blue-400">
                {modules.find((m) => m.id === activeModule)?.fullTitle}
              </span>
            </span>

            {/* Tablet Horizontal Switcher (md to xl) */}
            <div className="flex xl:hidden flex-wrap items-center gap-1.5">
              {modules.map((m) => {
                const Icon = m.icon;
                const isActive = activeModule === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveModule(m.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.mobileLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Dual-Mode Switch */}
          <div
            role="group"
            aria-label="Sélecteur de mode d'entraînement"
            className="flex items-center p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <button
              type="button"
              onClick={() => setStrictMode(false)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                !strictMode
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Super-Coach + Darija</span>
            </button>
            <button
              type="button"
              onClick={() => setStrictMode(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                strictMode
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Strict Exam Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Stage (pb-24 on mobile so fixed bottom nav never covers buttons) */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 md:pb-8">
        {activeModule === 'MOD1_PIPPLET' && (
          <Module1Pipplet
            strictMode={strictMode}
            onRecordResult={handleRecordResult}
            onBookmarkPhrase={handleBookmarkPhrase}
          />
        )}

        {activeModule === 'MOD2_VERSANT' && (
          <Module2Versant
            strictMode={strictMode}
            onRecordResult={handleRecordResult}
          />
        )}

        {activeModule === 'MOD3_TESTGORILLA' && (
          <Module3TestGorilla
            strictMode={strictMode}
            proctorWarnings={proctorWarnings}
            onTriggerFullscreen={handleTriggerFullscreen}
            onRecordResult={handleRecordResult}
          />
        )}

        {activeModule === 'MOD4_HARVER' && (
          <Module4Harver
            strictMode={strictMode}
            onRecordResult={handleRecordResult}
            onBookmarkPhrase={handleBookmarkPhrase}
          />
        )}

        {activeModule === 'MOD5_EFSET' && (
          <Module5EfSet
            strictMode={strictMode}
            onRecordResult={handleRecordResult}
          />
        )}

        {activeModule === 'MOD6_VAULT' && (
          <Module6VaultAndAnalytics
            history={history}
            bookmarks={bookmarks}
            proctorWarnings={proctorWarnings}
            onRecordResult={handleRecordResult}
          />
        )}

        {activeModule === 'MOD7_TP_LISBON' && (
          <Module7TPPortugal
            strictMode={strictMode}
            onRecordResult={handleRecordResult}
            onBookmarkPhrase={handleBookmarkPhrase}
          />
        )}
      </main>

      {/* Sub-Module 7C: Floating 30-Second Panic Rescue SOS Button */}
      <PanicSosDrawer strictMode={strictMode} />

      {/* Mobile Bottom Navigation Bar (iPhone & Android Thumb-Friendly) */}
      <nav
        aria-label="Navigation mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 pb-safe no-print"
      >
        <div className="grid grid-cols-6 gap-0.5 px-1 py-1.5">
          {mobileBottomNavItems.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveModule(m.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'text-blue-400 bg-blue-500/15 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] leading-tight truncate max-w-full">
                  {m.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Clean Footer (Hidden on small mobile screens to keep viewport clean) */}
      <footer className="hidden md:block border-t border-slate-200 dark:border-slate-800 px-6 py-4 text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <span>
            FR-PRO PORTUGAL — Préparation Intensive Teleperformance Portugal (Atlantic Experience Lisbonne · Porto · Coimbra)
          </span>
          <span>
            Pipplet ETS · Pearson Versant (20–80) · TestGorilla B2/C1 · Harver Multi-Chat & SJT · EF SET CAT · TP Lisbon Hub
          </span>
        </div>
      </footer>
    </div>
  );
}
