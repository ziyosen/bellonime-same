"use client";

import { useState, useRef, useEffect } from 'react';
import type { Schedule } from '@/types/anime';
import AnimeCard from '../AnimeCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ScheduleTabsProps {
  scheduleData: Schedule;
}

export default function ScheduleTabs({ scheduleData }: ScheduleTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const activeDayData = scheduleData.days[activeTab];
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    if (sectionRef.current) {
      const yOffset = -100; // Offset 100px dari top
      const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [activeTab]);

  return (
    <section ref={sectionRef}>
      {/* Day Tabs */}
      <div className="mb-6 overflow-x-auto no-scrollbar sticky top-0 md:top-16 z-20 bg-slate-50 dark:bg-slate-950 py-4">
        <div className="flex items-center gap-2 min-w-max">
          {scheduleData.days.map((day, index) => (
            <button
              key={day.day}
              onClick={() => setActiveTab(index)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === index
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            >
              {activeTab === index && (
                <motion.div
                  layoutId="schedule-tab-bg"
                  className="absolute inset-0 bg-accent rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{day.day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Anime Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {activeDayData.animeList.map((anime) => {
                const transformedAnime = {
                  ...anime,
                  genres: anime.genres ? anime.genres.split(',').map(g => g.trim()) : [],
                };
                return <AnimeCard key={anime.animeId} anime={transformedAnime} />;
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}