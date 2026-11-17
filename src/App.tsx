import React, { useState, useEffect } from 'react';
import {
  Headphones,
  Mic,
  ShieldCheck,
  MessageSquare,
  TrendingUp,
  BookOpen,
  Sun,
  Moon,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Module1Pipplet } from './components/Module1Pipplet';
import { Module2Versant } from './components/Module2Versant';
import { Module3TestGorilla } from './components/Module3TestGorilla';
import { Module4Harver } from './components/Module4Harver';
import { Module5EfSet } from './components/Module5EfSet';
import { Module6VaultAndAnalytics, TestHistoryEntry } from './components/Module6VaultAndAnalytics';

type ActiveModuleId =
  | 'MOD1_PIPPLET'
  | 'MOD2_VERSANT'
  | 'MOD3_TESTGORILLA'
  | 'MOD4_HARVER'
  | 'MOD5_EFSET'
  | 'MOD6_VAULT';

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

  const modules: Array<{
    id: ActiveModuleId;
    shortLabel: string;
    fullTitle: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'MOD1_PIPPLET',
      shortLabel: '1. Pipplet ETS',
      fullTitle: 'Pipplet Open-Response (Oral & Écrit)',
      icon: Headphones,
    },
    {
      id: 'MOD2_VERSANT',
      shortLabel: '2. Pearson Versant',
      fullTitle: 'Versant Rapid-Fire Lab (20–80)',
      icon: Mic,
    },
    {
      id: 'MOD3_TESTGORILLA',
      shortLabel: '3. TestGorilla B2/C1',
      fullTitle: 'TestGorilla Proctored Screening',
      icon: ShieldCheck,
    },
    {
      id: 'MOD4_HARVER',
      shortLabel: '4. Harver Multi-Chat & SJT',
      fullTitle: 'Harver BPO Desk (3 Chats + CRM + SJT)',
      icon: MessageSquare,
    },
    {
      id: 'MOD5_EFSET',
      shortLabel: '5. EF SET Adaptatif',
      fullTitle: 'EF SET CAT (Certificat Officiel)',
      icon: TrendingUp,
    },
    {
      id: 'MOD6_VAULT',
      shortLabel: '6. BPO Vault & Coach',
      fullTitle: 'Cheat-Vault, Shadowing & Analytics',
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0F172A] dark:text-slate-100">
      {/* Top Bar Contract: Zone 1 Brand Wordmark — Zone 2 Concise Nav — Zone 3 Primary Action */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 no-print">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveModule('MOD1_PIPPLET');
          }}
          className="text-lg font-display font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
        >
          FR-PRO PORTUGAL
        </a>

        <nav
          aria-label="Navigation principale des modules"
          className="hidden xl:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300"
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

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveModule('MOD6_VAULT')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            BPO Cheat-Vault & Analytics
          </button>
        </div>
      </header>

      {/* Workspace Control Toolbar: Active Module Context & Dual-Mode Switch (Strict Exam vs AI Super-Coach + Darija) */}
      <div className="bg-slate-100/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 px-6 py-3 no-print">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumb & Mobile/Tablet Module Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Module Actif :{' '}
              <span className="text-blue-600 dark:text-blue-400">
                {modules.find((m) => m.id === activeModule)?.fullTitle}
              </span>
            </span>
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
                    <span>{m.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dual-Mode Switch & Theme Toggle */}
          <div className="flex items-center gap-3">
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

            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              aria-label={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Stage */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-6">
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
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <span>
            FR-PRO PORTUGAL — Préparation Intensive Recrutement Multinationales & Centres de Services Partagés (Lisbonne · Porto · Coimbra)
          </span>
          <span>
            Pipplet ETS · Pearson Versant (20–80) · TestGorilla B2/C1 · Harver Multi-Chat & SJT · EF SET CAT
          </span>
        </div>
      </footer>
    </div>
  );
}
