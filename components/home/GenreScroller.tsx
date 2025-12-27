'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { GenresLink } from '../../types/anime';
import GenreScrollerSkeleton from './GenreScrollerSkeleton';

export default function GenreScroller({ genres, isLoading }: { genres: GenresLink[], isLoading?: boolean }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    loop: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return <GenreScrollerSkeleton />;
  }

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {canScrollPrev && (
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 z-10 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 shadow-soft"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2">
          {genres.map((genre) => (
            <Link
              href={`/genres/${genre.genreId}`}
              key={genre.genreId}
              className="flex-shrink-0 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-full text-sm font-medium transition-all hover:bg-accent hover:text-white hover:border-accent"
            >
              {genre.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      {canScrollNext && (
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 z-10 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 shadow-soft"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}