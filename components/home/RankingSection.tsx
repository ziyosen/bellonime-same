'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { RankItem } from '@/lib/ranking';

const TABS = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'alltime', label: 'All' },
] as const;

type RangeKey = (typeof TABS)[number]['key'];

// Section Ranking (Weekly/Monthly/All) — pengganti sementara Jadwal Rilis.
// Kalau jadwal rilis dari sumber balik, section Jadwal Rilis dirender di atasnya.
export default function RankingSection({ data }: { data: Record<string, RankItem[]> }) {
  const [range, setRange] = useState<RangeKey>('weekly');
  const [items, setItems] = useState<RankItem[]>([]);

  useEffect(() => {
    setItems(data[range] || []);
  }, [range, data]);

  if (!items.length) return null;

  return (
    <section className="mt-7">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">Ranking</h2>
      </div>

      {/* Tab Weekly / Monthly / All */}
      <div className="mb-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setRange(t.key)}
            className={`rounded-full px-4 py-2 text-[12px] font-bold transition ${
              range === t.key
                ? 'bg-orange-500 text-white'
                : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ol className="space-y-2.5">
        {items.map((it) => (
          <li key={`${range}-${it.rank}`}>
            <Link
              href={it.animeId ? `/anime/${it.animeId}` : it.url}
              className="group flex items-center gap-3.5 rounded-2xl bg-white/[0.05] p-3 transition hover:bg-white/[0.09]"
            >
              <span
                className={`w-7 shrink-0 text-center text-lg font-black ${
                  it.rank === 1 ? 'text-amber-400' : it.rank === 2 ? 'text-slate-300' : it.rank === 3 ? 'text-orange-400' : 'text-slate-500'
                }`}
              >
                {it.rank}
              </span>
              <img
                src={it.img}
                alt={it.title}
                loading="lazy"
                className="h-16 w-11 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-slate-100 group-hover:text-orange-300">
                  {it.title}
                </p>
                {it.genres.length ? (
                  <p className="mt-0.5 truncate text-[11px] text-slate-400">{it.genres.join(', ')}</p>
                ) : null}
              </div>
              {it.rating ? (
                <span className="shrink-0 text-[12px] font-bold text-orange-400">{it.rating}</span>
              ) : (
                <Star size={14} className="shrink-0 text-slate-500" />
              )}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
