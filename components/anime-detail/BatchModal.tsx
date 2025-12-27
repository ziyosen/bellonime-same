'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { fetchBatchDetail } from '@/app/actions/anime';
import type { Batchdetail } from '@/types/anime';
import DownloadSection from '@/components/episode/DownloadSection';

interface BatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    batchId: string;
    title: string;
}

export default function BatchModal({ isOpen, onClose, batchId, title }: BatchModalProps) {
    const [data, setData] = useState<Batchdetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && batchId) {
            setLoading(true);
            setError(null);
            setData(null);

            fetchBatchDetail(batchId)
                .then((result) => {
                    if (result) {
                        setData(result);
                    } else {
                        setError('Gagal memuat data batch.');
                    }
                })
                .catch(() => {
                    setError('Terjadi kesalahan saat memuat data.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isOpen, batchId]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 line-clamp-1 pr-4">
                                    {title}
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                        <Loader2 size={40} className="animate-spin text-accent" />
                                        <p className="text-slate-500 dark:text-slate-400">Memuat link download...</p>
                                    </div>
                                ) : error ? (
                                    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full text-red-500">
                                            <AlertCircle size={32} />
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300">{error}</p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            Coba Lagi
                                        </button>
                                    </div>
                                ) : data ? (
                                    <div className="space-y-6">
                                        {/* Reuse DownloadSection but strip container styles if needed, or just use as is */}
                                        <div className="download-section-wrapper">
                                            <DownloadSection formats={data.downloadUrl.formats} />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
