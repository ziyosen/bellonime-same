'use client';

import { useEffect, useState } from 'react';

interface LetterNavProps {
  letters: string[];
}

export default function LetterNav({ letters }: LetterNavProps) {
  const [active, setActive] = useState<string>(letters[0]);

  useEffect(() => {
    const sections = letters
      .map((ltr) => document.getElementById(ltr))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -70% 0px',
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [letters]);

  return (
    <nav>
      <div className="flex flex-wrap justify-center gap-2">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#${letter}`}
            className={`
              px-3 py-2 text-sm font-semibold rounded-lg transition-all
              ${active === letter
                ? 'bg-accent text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}
            `}
          >
            {letter}
          </a>
        ))}
      </div>
    </nav>
  );
}
