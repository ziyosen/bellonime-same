'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import type { EpisodeInfo, Episode, AnimeDetail } from '@/types/anime';
import { ChevronLeft, ChevronRight, ListVideo, ArrowDownUp } from 'lucide-react';

interface EpisodeSidebarProps {
  episodes: EpisodeInfo[];
  episode: Episode;
  anime: AnimeDetail;
}

export default function EpisodeSidebar({ episodes, episode, anime }: EpisodeSidebarProps) {
  const pathname = usePathname();
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const sortedEpisodes = useMemo(() => {
    const episodesCopy = [...episodes];
    if (sortOrder === 'asc') {
      return episodesCopy.reverse();
    }
    return episodesCopy;
  }, [episodes, sortOrder]);

  return (
    <aside className="space-y-4 sticky top-20">
      {/* Anime Info Card with Poster */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Poster Image */}
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={anime.poster}
            alt={anime.title}
            fill
            className="object-cover"
            sizes="360px"
          />
        </div>

        {/* Info Section */}
        <div className="p-4 space-y-3">
          

          {/* Episode Title */}
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
            {episode.title}
          </h1>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            {episode.hasPrevEpisode && episode.prevEpisode ? (
              <Link
                href={`/episode/${episode.prevEpisode.episodeId}`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-accent hover:text-white dark:hover:bg-accent transition-colors"
                title="Episode Sebelumnya"
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </Link>
            ) : (
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 text-sm rounded-lg cursor-not-allowed opacity-50"
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>
            )}

            {episode.hasNextEpisode && episode.nextEpisode ? (
              <Link
                href={`/episode/${episode.nextEpisode.episodeId}`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-accent hover:text-white dark:hover:bg-accent transition-colors"
                title="Episode Selanjutnya"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </Link>
            ) : (
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 text-sm rounded-lg cursor-not-allowed opacity-50"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Episode List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            <ListVideo size={20} />
            <span>Episodes</span>
          </h3>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowDownUp size={14} />
            <span>{sortOrder === 'asc' ? 'Terbaru' : 'Terlama'}</span>
          </button>
        </div>

        {/* Episode Grid */}
        <div className="max-h-[400px] overflow-y-auto pr-2 grid grid-cols-4 gap-2">
          {sortedEpisodes.map(ep => {
            const isActive = pathname === `/episode/${ep.episodeId}`;
            return (
              <Link
                key={ep.episodeId}
                href={`/episode/${ep.episodeId}`}
                className={`block w-full text-center p-2 text-sm rounded-lg transition-colors font-medium ${isActive
                    ? 'bg-accent text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
              >
                {String(ep.title).replace(/Episode /i, '')}
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  );
}