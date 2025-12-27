'use client';

import { useState } from 'react';
import BatchModal from './BatchModal';
import { Download } from 'lucide-react';

interface BatchSectionProps {
    batches: {
        title: string;
        batchId: string;
        href: string;
        samehadakuUrl: string;
    }[];
}

export default function BatchSection({ batches }: BatchSectionProps) {
    const [selectedBatch, setSelectedBatch] = useState<{ id: string; title: string } | null>(null);

    if (!batches || batches.length === 0) return null;

    return (
        <>
            <div className="space-y-3">
                {batches.map((batch) => (
                    <button
                        key={batch.batchId}
                        onClick={() => setSelectedBatch({ id: batch.batchId, title: batch.title })}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-left font-medium text-slate-900 dark:text-slate-100 hover:bg-accent hover:text-white hover:border-accent transition-all shadow-soft group"
                    >
                        <span className="line-clamp-1">{batch.title}</span>
                        <Download size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                ))}
            </div>

            <BatchModal
                isOpen={!!selectedBatch}
                onClose={() => setSelectedBatch(null)}
                batchId={selectedBatch?.id || ''}
                title={selectedBatch?.title || ''}
            />
        </>
    );
}
