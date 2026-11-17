import React from 'react';

const FRENCH_ACCENTS = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ç', 'ù', 'û', 'î', 'ï', 'ô', 'œ', '«', '»'];

interface FrenchAccentBarProps {
  onInsert: (char: string) => void;
  label?: string;
}

export const FrenchAccentBar: React.FC<FrenchAccentBarProps> = ({
  onInsert,
  label = 'Accents FR :',
}) => {
  return (
    <div className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 overflow-x-auto no-scrollbar">
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mr-1 whitespace-nowrap shrink-0">
        {label}
      </span>
      {FRENCH_ACCENTS.map((char) => (
        <button
          key={char}
          type="button"
          onClick={() => onInsert(char)}
          aria-label={`Insérer le caractère ${char}`}
          className="min-w-[36px] min-h-[36px] px-2 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-800 dark:text-slate-100 hover:bg-blue-600 hover:text-white active:scale-95 hover:border-blue-600 transition-all cursor-pointer shrink-0"
        >
          {char}
        </button>
      ))}
    </div>
  );
};
