'use client';

import { useState } from 'react';

export default function Synopsis({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <p
        className={`text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line transition-all duration-300 ${isExpanded ? 'line-clamp-none' : 'line-clamp-5'
          }`}
      >
        {text}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-accent hover:text-accent-hover font-semibold mt-3 text-sm transition-colors"
      >
        {isExpanded ? 'Lebih Sedikit' : 'Selengkapnya'}
      </button>
    </div>
  );
}