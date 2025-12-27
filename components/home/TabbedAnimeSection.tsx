'use client';

import { useState, useEffect, useRef } from 'react';
import AnimeCard from '../AnimeCard';
import type { Recent, Popular, Completed, Ongoing, Pagination } from '@/types/anime';
import { getRecentData, getPopularData, getCompletedData } from '@/lib/services';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

type AnimeItem = (Recent['animeList'][0] | Popular['animeList'][0] | Completed['animeList'][0] | Ongoing['animeList'][0]);

const TABS = ['Terbaru', 'Populer', 'Tamat'];

export default function TabbedAnimeSection() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(null);
  const [data, setData] = useState<AnimeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;
        if (activeTab === 'Terbaru') response = await getRecentData(currentPage);
        else if (activeTab === 'Populer') response = await getPopularData(currentPage);
        else if (activeTab === 'Tamat') response = await getCompletedData(currentPage);

        setData(response?.data?.animeList ?? []);
        setPaginationInfo(response?.pagination ?? null);
      } catch (error) {
        console.error(`Failed to load data for ${activeTab}:`, error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, currentPage]);

  const scrollToTop = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTabClick = (tab: string) => {
    if (tab === activeTab) {
      scrollToTop();
      return;
    }
    setActiveTab(tab);
    setCurrentPage(1);
    scrollToTop();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setCurrentPage(newPage);
    scrollToTop();
  };

  return (
    <section ref={sectionRef}>
      {/* STICKY HEADER - Outside card, matchs page background */}
      <div className="sticky top-0 md:top-16 z-20 bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-slate-900 rounded-xl shadow-soft-lg border border-slate-200 dark:border-slate-800 px-6 py-4">
          {/* Tabs Left */}
          <div className="flex items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === tab
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="home-active-tab-bg"
                    className="absolute inset-0 bg-accent rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          {/* Pagination Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={isLoading || currentPage === 1}
              className="p-2.5 rounded-lg bg-accent/10 dark:bg-accent/20 text-accent hover:bg-accent/20 dark:hover:bg-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all "
              aria-label="Previous page"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 min-w-[3rem] text-center px-4 py-2 bg-accent/10 dark:bg-accent/20 rounded-lg ">
              {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={isLoading || !paginationInfo?.hasNextPage}
              className="p-2.5 rounded-lg bg-accent/10 dark:bg-accent/20 text-accent hover:bg-accent/20 dark:hover:bg-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all "
              aria-label="Next page"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <AnimeCard key={i} isLoading />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {data.map((anime: AnimeItem) => (
              <AnimeCard
                key={anime.animeId}
                anime={anime}
                linkTo={activeTab === 'Terbaru' ? 'latest-episode' : 'detail'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}