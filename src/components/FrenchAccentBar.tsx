import React from 'react';

const FRENCH_ACCENTS = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ç', 'ù', 'û', 'î', 'ï', 'ô', 'œ', '«', '»'];

interface FrenchAccentBarProps {
  onInsert: (char: string) => void;
  label?: string;
}

export const FrenchAccentBar: React.FC<FrenchAccentBarProps> = ({
  onInsert,
  label = 'Clavier Virtuel Accents Français :',
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 mr-1.5 whitespace-nowrap">
        {label}
      </span>
      {FRENCH_ACCENTS.map((char) => (
        <button
          key={char}
          type="button"
          onClick={() => onInsert(char)}
          aria-label={`Insérer le caractère ${char}`}
          className="w-7 h-7 flex items-center justify-center rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-800 dark:text-slate-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors cursor-pointer shrink-0"
        >
          {char}
        </button>
      ))}
    </div>
  );
};
