'use client';

import { useState, useEffect } from 'react';
import { fetchHomeData } from '@/app/actions/home';
import type { Anime } from '@/types/anime';
import MovieCard from './MovieCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function MovieSection() {
  const [movies, setMovies] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetchHomeData();
        if (response?.movie?.animeList) {
          setMovies(response.movie.animeList.slice(0, 8));
        }
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <aside className="sticky top-20">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Movies</h2>
          <Link
            href="/movies"
            className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors group"
          >
            <span>Lihat Semua</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Movie List */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <MovieCard key={i} isLoading />
            ))
          ) : (
            movies.map((movie) => (
              <MovieCard key={movie.animeId} anime={movie} />
            ))
          )}
        </div>
      </div>
    </aside>
  );
}