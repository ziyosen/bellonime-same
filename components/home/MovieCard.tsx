'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Anime } from '../../types/anime';

function MovieCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
      <div className="w-16 h-24 rounded-lg animate-shimmer flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded animate-shimmer" />
        <div className="h-3 w-1/2 rounded animate-shimmer" />
      </div>
    </div>
  );
}

export default function MovieCard({ anime, isLoading }: { anime?: Partial<Anime>, isLoading?: boolean }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (isLoading) {
    return <MovieCardSkeleton />;
  }

  if (!anime?.animeId) {
    return null;
  }

  return (
    <Link
      href={`/anime/${anime.animeId}`}
      className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-800 shadow-soft"
      >
        {!isImageLoaded && (
          <div className="absolute inset-0 animate-shimmer" />
        )}
        <Image
          src={anime.poster || ''}
          alt={anime.title || 'Movie Poster'}
          fill
          className={`object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          sizes="64px"
          quality={85}
          onLoad={() => setIsImageLoaded(true)}
        />
      </motion.div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-accent transition-colors">
          {anime.title}
        </h3>
        {anime.releaseDate && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {anime.releaseDate}
          </p>
        )}
      </div>
    </Link>
  );
}