import React, { useState } from 'react';
import { LifeBuoy, X, Volume2, Copy, Check } from 'lucide-react';
import { PANIC_SOS_PHRASES } from '../data/tpPortugalBank';
import { speakFrenchText } from '../utils/speechAndAudio';
import { DarijaBiDiText } from '../utils/bidiUtils';

interface PanicSosDrawerProps {
  strictMode: boolean;
}

export const PanicSosDrawer: React.FC<PanicSosDrawerProps> = ({ strictMode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (strictMode) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const groups: Array<{
    key: 'openersC1' | 'bridgesC1' | 'closingsC1';
    title: string;
    badge: string;
    items: Array<{ french: string; darija: string }>;
  }> = [
    {
      key: 'openersC1',
      title: '1. Trois Accroches C1 Instantanées (Openers)',
      badge: 'Anti-Blanc Début',
      items: PANIC_SOS_PHRASES.openersC1,
    },
    {
      key: 'bridgesC1',
      title: '2. Trois Ponts de Désescalade Diplomatique (Bridges)',
      badge: 'Gagner 10 Secondes',
      items: PANIC_SOS_PHRASES.bridgesC1,
    },
    {
      key: 'closingsC1',
      title: '3. Deux Clôtures CSAT Irréprochables (Closings)',
      badge: 'Fin d’Appel / Mail',
      items: PANIC_SOS_PHRASES.closingsC1,
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le kit de secours SOS Phrase C1"
        className="fixed bottom-20 md:bottom-6 right-4 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all cursor-pointer border border-rose-400/30 no-print"
      >
        <LifeBuoy className="w-4 h-4 animate-pulse" />
        <span>🆘 SOS Phrase C1</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] rounded-t-2xl sm:rounded-2xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col space-y-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                  30-Second Panic Rescue · Teleperformance Lisbonne
                </span>
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                  🆘 Kit de Secours Anti-Panique C1 (8 Phrases de Sauvetage)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto pr-1 flex-1">
              {groups.map((grp) => (
                <div key={grp.key} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {grp.title}
                    </h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {grp.badge}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {grp.items.map((item, idx) => {
                      const itemId = `${grp.key}-${idx}`;
                      return (
                        <div
                          key={itemId}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-500">
                              Formule #{idx + 1}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => speakFrenchText(item.french)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-200/80 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5" /> Écouter
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopy(itemId, item.french)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-medium cursor-pointer"
                              >
                                {copiedId === itemId ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                                <span>{copiedId === itemId ? 'Copié' : 'Copier'}</span>
                              </button>
                            </div>
                          </div>

                          <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                            « {item.french} »
                          </p>

                          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <DarijaBiDiText
                              text={item.darija}
                              className="text-xs text-amber-800 dark:text-amber-200"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
