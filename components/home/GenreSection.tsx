'use client';

import { useState, useEffect } from 'react';
import { getGenresData } from '@/lib/services';
import type { GenresLink } from '@/types/anime';
import GenreScroller from './GenreScroller';

export default function GenreSection() {
  const [genres, setGenres] = useState<GenresLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenresData();
        setGenres(response.data.genreList);
      } catch (error) {
        console.error('Failed to load genres:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-4">
      <GenreScroller genres={genres} isLoading={isLoading} />
    </div>
  );
}