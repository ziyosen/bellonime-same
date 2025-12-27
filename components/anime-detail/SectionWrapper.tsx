'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function SectionWrapper({
  children,
  isLoaded,
}: {
  children: React.ReactNode;
  isLoaded: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isLoaded ? 'loaded' : 'loading'}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-soft-lg">
          {children}
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
