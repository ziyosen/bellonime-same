'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDonghuaHome, getDonghuaSchedule, type DonghuaItem, type ScheduleDay } from '@/lib/services';

export default function DonghuaClient() {
  const [latest, setLatest] = useState<DonghuaItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [home, sched] = await Promise.all([getDonghuaHome(1), getDonghuaSchedule()]);
      if (!alive) return;
      setLatest(home);
      setSchedule(sched);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Donghua</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Rilisan Terbaru</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {latest.slice(0, 18).map((it) => (
                <Link
                  key={it.slug}
                  href={`/donghua/detail/${it.slug}`}
                  className="group rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900"
                >
                  <div className="relative aspect-[2/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.poster}
                      alt={it.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-xs line-clamp-2 text-slate-800 dark:text-slate-200">{it.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {schedule.map((d) => (
            <section key={d.day} className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">{d.day}</h2>
              <div className="flex flex-wrap gap-2">
                {d.animeList.map((it) => (
                  <Link
                    key={it.slug}
                    href={`/donghua/detail/${it.slug}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {it.title}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
