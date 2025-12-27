'use client';

import { useState, useMemo } from 'react';
import type { DownloadFormat } from '@/types/anime';
import { Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DownloadSection({ formats = [] }: { formats?: DownloadFormat[] }) {
  // Kumpulkan semua kualitas unik sebagai tab
  const allQualities = useMemo(
    () => Array.from(new Set(formats.flatMap(f => f.qualities.map(q => q.title.trim())))),
    [formats]
  );
  const [activeTab, setActiveTab] = useState(allQualities[0] || '');

  // Filter link berdasarkan tab kualitas yang aktif
  const downloadLinks = useMemo(() =>
    formats.flatMap(format =>
      format.qualities
        .filter(q => q.title.trim() === activeTab)
        .flatMap(q => q.urls.map(url => ({
          ...url,
          format: format.title,
          quality: q.title
        })))
    ),
    [activeTab, formats]
  );

  if (!formats || formats.length === 0) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          <Download size={20} />
          <span>Link Download</span>
        </h3>

        {/* Tab Pilihan Kualitas */}
        <div className="flex items-center gap-2 flex-wrap">
          {allQualities.map(quality => (
            <button
              key={quality}
              onClick={() => setActiveTab(quality)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === quality
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
            >
              {activeTab === quality && (
                <motion.div
                  layoutId="download-quality-bg"
                  className="absolute inset-0 bg-accent rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{quality}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Link dalam Grid - WITH ANIMATION */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {downloadLinks.map((link, index) => (
            <motion.a
              key={link.title + link.format}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-accent hover:text-white dark:hover:bg-accent text-center transition-all duration-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <ExternalLink size={24} className="transition-transform group-hover:scale-110" />
              <div className="text-xs font-medium leading-tight">
                <p className="font-semibold">{link.title}</p>
                <p className="text-slate-500 dark:text-slate-400 group-hover:text-white/80 mt-1">
                  {link.format}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}