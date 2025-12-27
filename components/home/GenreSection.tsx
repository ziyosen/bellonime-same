'use client';

import { useState, useEffect } from 'react';
import { fetchGenres } from '@/app/actions/home';
import type { GenresLink } from '@/types/anime';
import GenreScroller from './GenreScroller';

export default function GenreSection() {
  const [genres, setGenres] = useState<GenresLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenresData = async () => {
      try {
        const response = await fetchGenres();
        if (response?.data?.genreList) {
          setGenres(response.data.genreList);
        }
      } catch (error) {
        console.error('Failed to load genres:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGenresData();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-4">
      <GenreScroller genres={genres} isLoading={isLoading} />
    </div>
  );
}