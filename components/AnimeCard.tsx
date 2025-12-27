'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Anime } from '../types/anime';

type LinkType = 'detail' | 'latest-episode';

interface AnimeCardProps {
  anime?: Partial<Anime>;
  linkTo?: LinkType;
  isLoading?: boolean;
}

function AnimeCardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="aspect-[2/3] w-full rounded-xl animate-shimmer" />
      <div className="h-4 w-3/4 rounded-lg animate-shimmer" />
      <div className="h-3 w-1/2 rounded-lg animate-shimmer" />
    </div>
  );
}

export default function AnimeCard({ anime, linkTo = 'detail', isLoading }: AnimeCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (isLoading) {
    return <AnimeCardSkeleton />;
  }

  if (!anime?.animeId) {
    return null;
  }

  const href = linkTo === 'latest-episode'
    ? `/anime/${anime.animeId}/latest`
    : `/anime/${anime.animeId}`;

  return (
    <Link href={href} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -4 }}
        className="relative"
      >
        {/* Image Container */}
        <div className="aspect-[2/3] relative overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 shadow-soft-md group-hover:shadow-soft-xl transition-all duration-300">
          {/* Loading State */}
          {!isImageLoaded && (
            <div className="absolute inset-0 animate-shimmer" />
          )}

          {/* Image */}
          {anime.poster ? (
            <Image
              src={anime.poster}
              alt={anime.title ?? 'Anime Poster'}
              fill
              className={`object-cover transition-all duration-500 ${isImageLoaded
                  ? 'opacity-100 group-hover:scale-105'
                  : 'opacity-0'
                }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              quality={85}
              onLoad={() => setIsImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              No Image
            </div>
          )}

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Episode Badge */}
          {anime.episodes && (
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-semibold shadow-soft">
              Ep {anime.episodes}
            </div>
          )}

          {/* Estimation Badge */}
          {anime.estimation && (
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-soft">
              <span>⏰</span>
              <span>{anime.estimation}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-3 font-semibold text-sm line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-accent transition-colors">
          {anime.title ?? 'No Title'}
        </h3>

        {/* Details */}
        {(anime.releasedOn || anime.status) && (
          <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
            {anime.releasedOn && <p>{anime.releasedOn}</p>}
            {anime.status && <p>{anime.status}</p>}
          </div>
        )}
      </motion.div>
    </Link>
  );
}