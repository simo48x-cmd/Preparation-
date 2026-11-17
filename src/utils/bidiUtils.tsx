import React from 'react';

/**
 * BiDi Isolation Renderer for Moroccan Darija / Arabic text containing embedded French words,
 * phrases, numbers, or grammatical rules.
 * Wraps the container in <div dir="rtl" lang="ar" className="font-['Cairo',sans-serif] text-right leading-relaxed">
 * and isolates every Latin/French segment inside <span dir="ltr" className="inline-block px-1.5 py-0.5 mx-1 rounded bg-blue-500/15 text-blue-400 font-mono text-sm">
 * so punctuation and bidirectional text order never scramble.
 */

export interface DarijaBiDiTextProps {
  text: string;
  className?: string;
}

const LATIN_SEGMENT_REGEX =
  /([A-Za-zÀ-ÖØ-öø-ÿŒœ«»#][A-Za-zÀ-ÖØ-öø-ÿŒœ0-9\s'’\-+/%(),.:;#«»]*[A-Za-zÀ-ÖØ-öø-ÿŒœ0-9)%»]|[A-Za-zÀ-ÖØ-öø-ÿŒœ0-9]{2,})/g;

export const DarijaBiDiText: React.FC<DarijaBiDiTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  const parts: Array<{ content: string; isLatin: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const regex = new RegExp(LATIN_SEGMENT_REGEX.source, 'g');
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        content: text.slice(lastIndex, match.index),
        isLatin: false,
      });
    }
    parts.push({
      content: match[0].trim(),
      isLatin: true,
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({
      content: text.slice(lastIndex),
      isLatin: false,
    });
  }

  return (
    <div
      dir="rtl"
      lang="ar"
      className={`font-['Cairo',sans-serif] text-right leading-relaxed ${className}`}
    >
      {parts.map((part, idx) =>
        part.isLatin ? (
          <span
            key={idx}
            dir="ltr"
            className="inline-block px-1.5 py-0.5 mx-1 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 font-mono text-sm align-baseline"
          >
            {part.content}
          </span>
        ) : (
          <React.Fragment key={idx}>{part.content}</React.Fragment>
        )
      )}
    </div>
  );
};

export default DarijaBiDiText;
