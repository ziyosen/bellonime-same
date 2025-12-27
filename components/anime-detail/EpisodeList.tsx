'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { EpisodeInfo } from '@/types/anime';
import { ArrowDownUp } from 'lucide-react';

export default function EpisodeList({ episodes }: { episodes: EpisodeInfo[] }) {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const sortedEpisodes = useMemo(() => {
    const episodesCopy = [...episodes];
    if (sortOrder === 'asc') {
      return episodesCopy.reverse();
    }
    return episodesCopy;
  }, [episodes, sortOrder]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 border-l-4 border-accent pl-3">
          Daftar Episode
        </h2>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-lg hover:bg-accent hover:text-white transition-colors shadow-soft"
        >
          <ArrowDownUp size={14} />
          <span>{sortOrder === 'asc' ? 'Terbaru' : 'Terlama'}</span>
        </button>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {sortedEpisodes.map(episode => (
          <Link
            key={episode.episodeId}
            href={`/episode/${episode.episodeId}`}
            className="block p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-medium text-slate-900 dark:text-slate-100 hover:bg-accent hover:text-white hover:border-accent transition-all shadow-soft"
          >
            {episode.title}
          </Link>
        ))}
      </div>
    </div>
  );
}