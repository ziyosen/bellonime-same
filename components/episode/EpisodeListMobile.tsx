'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { EpisodeInfo } from '@/types/anime';
import { ListVideo, ArrowDownUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EpisodeListMobile({ episodes }: { episodes: EpisodeInfo[] }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const sortedEpisodes = useMemo(() => {
    const episodesCopy = [...episodes];
    if (sortOrder === 'asc') {
      return episodesCopy.reverse();
    }
    return episodesCopy;
  }, [episodes, sortOrder]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header - Collapsible Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ListVideo size={20} className="text-slate-700 dark:text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Daftar Episode
          </h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            ({episodes.length})
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} className="text-slate-600 dark:text-slate-400" />
        </motion.div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4">
              {/* Sort Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ArrowDownUp size={14} />
                  <span>{sortOrder === 'asc' ? 'Terbaru' : 'Terlama'}</span>
                </button>
              </div>

              {/* Episode Grid */}
              <div className="grid grid-cols-4 gap-2">
                {sortedEpisodes.map((ep, index) => {
                  const isActive = pathname === `/episode/${ep.episodeId}`;
                  return (
                    <motion.div
                      key={ep.episodeId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02, duration: 0.2 }}
                    >
                      <Link
                        href={`/episode/${ep.episodeId}`}
                        className={`block w-full text-center p-2 text-sm rounded-lg transition-colors font-medium ${isActive
                            ? 'bg-accent text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                      >
                        {String(ep.title).replace(/Episode /i, '')}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
