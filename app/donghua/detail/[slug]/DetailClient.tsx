'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getDonghuaDetail, type DonghuaItem } from '@/lib/services';

interface EpisodeEntry { title: string; slug: string; }

export default function DonghuaDetailClient({ slugPromise }: { slugPromise: Promise<{ slug: string }> }) {
  const { slug } = use(slugPromise);
  const [detail, setDetail] = useState<(DonghuaItem & { episodeList?: EpisodeEntry[]; synopsis?: string; rating?: string; status?: string; type?: string; episodes_count?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const d = await getDonghuaDetail(slug);
      if (!alive) return;
      setDetail(d as typeof detail);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-6 max-w-5xl mx-auto">
        <div className="flex gap-6">
          <div className="w-40 aspect-[2/3] rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-slate-600 dark:text-slate-400">Donghua tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div className="w-40 shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={detail.poster} alt={detail.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{detail.title}</h1>
          <div className="flex flex-wrap gap-2 text-xs mb-3">
            {detail.rating && detail.rating !== 'N/A' && (
              <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">⭐ {detail.rating}</span>
            )}
            {detail.status && <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{detail.status}</span>}
            {detail.type && <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{detail.type}</span>}
            {detail.episodes_count && <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{detail.episodes_count} episode</span>}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">{detail.synopsis}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Episode ({detail.episodeList?.length ?? 0})</h2>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {(detail.episodeList || []).map((ep) => (
          <Link
            key={ep.slug}
            href={`/donghua/episode/${ep.slug}`}
            className="text-center text-xs py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {ep.title.replace('Ep ', '')}
          </Link>
        ))}
      </div>
    </div>
  );
}
