import React from 'react';

type TypewriterTextProps = {
  lines: string[];
  reducedMotion?: boolean;
  className?: string;
  showCursor?: boolean;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  gapMs?: number;
};

const TypewriterText: React.FC<TypewriterTextProps> = ({
  lines,
  reducedMotion = false,
  className = '',
  showCursor = false,
  typingSpeed = 34,
  deletingSpeed = 22,
  pauseMs = 1700,
  gapMs = 360,
}) => {
  const safeLines = React.useMemo(() => lines.filter((line) => line.trim().length > 0), [lines]);
  const [lineIndex, setLineIndex] = React.useState(0);
  const [text, setText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (safeLines.length === 0) return;
    if (reducedMotion) {
      setText(safeLines[0]);
      return;
    }

    const fullLine = safeLines[lineIndex % safeLines.length];

    let timeoutMs = isDeleting ? deletingSpeed : typingSpeed;
    if (!isDeleting && text === fullLine) {
      timeoutMs = pauseMs;
    } else if (isDeleting && text === '') {
      timeoutMs = gapMs;
    }

    const timeoutId = window.setTimeout(() => {
      if (!isDeleting && text === fullLine) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && text === '') {
        setIsDeleting(false);
        setLineIndex((index) => (index + 1) % safeLines.length);
        return;
      }

      const delta = isDeleting ? -1 : 1;
      const next = fullLine.slice(0, text.length + delta);
      setText(next);
    }, timeoutMs);

    return () => window.clearTimeout(timeoutId);
  }, [deletingSpeed, gapMs, isDeleting, lineIndex, pauseMs, reducedMotion, safeLines, text, typingSpeed]);

  if (safeLines.length === 0) return null;

  return (
    <span className={`madlabs-typewriter ${className}`.trim()} aria-live="polite">
      <span>{text}</span>
      {!reducedMotion && showCursor && <span className="madlabs-type-cursor" aria-hidden />}
    </span>
  );
};

export default TypewriterText;
