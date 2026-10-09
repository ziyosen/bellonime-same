'use client';

import { useEffect, useState } from 'react';
import { getPopular, type WestCard } from '@/lib/westmanga';
import KomikCard from './KomikCard';

const PERIODS = [
  { key: 'today', label: 'Hari ini' },
  { key: 'week', label: 'Minggu ini' },
  { key: 'month', label: 'Bulan ini' },
  { key: 'all', label: 'Sepanjang Waktu' },
] as const;

export default function PopulerSection() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]['key']>('today');
  const [items, setItems] = useState<WestCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      const list = await getPopular(period);
      if (!alive) return;
      setItems(list.slice(0, 6)); // grid 3 kolom x 2 baris seperti westmanga
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [period]);

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-base font-bold text-slate-100">Populer</h2>

      {/* filter waktu: pill horizontal, aktif = pill terang */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
              period === p.key
                ? 'bg-slate-200 text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* grid 3 kolom mobile */}
      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-[18px] bg-slate-800/70 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {items.map((it) => (
            <KomikCard key={it.slug} item={it} />
          ))}
        </div>
      )}
    </section>
  );
}
