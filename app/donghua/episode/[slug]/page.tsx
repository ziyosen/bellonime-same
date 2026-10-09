'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchDonghuaEpisode, type DonghuaEpisode } from '@/lib/donghua';

export default function DonghuaEpisodePage() {
  const params = useParams();
  const slug = String(params.slug || '');
  const [episode, setEpisode] = useState<DonghuaEpisode | null>(null);
  const [error, setError] = useState('');
  const [activeUrl, setActiveUrl] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchDonghuaEpisode(slug);
        if (!alive) return;
        setEpisode(data);
        setActiveUrl(data.streaming?.main_url?.url || data.streaming?.servers?.[0]?.url || '');
      } catch {
        if (alive) setError('Episode ini belum bisa diambil dari sumbernya.');
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const servers = useMemo(() => episode?.streaming?.servers || [], [episode]);
  const detailSlug = episode?.navigation?.all_episodes?.slug || '';

  return (
    <main className="min-h-screen bg-[#070b12] pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-6xl px-3 pt-[74px] sm:px-6 md:pt-20 lg:px-8">
        {detailSlug ? (
          <Link href={`/donghua/${detailSlug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200">
            <ArrowLeft size={16} /> Kembali ke detail
          </Link>
        ) : (
          <Link href="/donghua" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200">
            <ArrowLeft size={16} /> Kembali ke Donghua
          </Link>
        )}

        {!episode && !error ? (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">Memuat episode...</div>
        ) : error ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">{error}</div>
        ) : episode ? (
          <>
            <h1 className="mt-4 text-xl font-black leading-tight sm:text-2xl">{episode.episode}</h1>

            <div className="mt-4 flex items-center gap-2">
              {episode.navigation?.previous_episode ? (
                <Link href={`/donghua/episode/${episode.navigation.previous_episode.slug}`} className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-4 py-2 text-[12px] font-bold text-slate-100 transition hover:bg-sky-500">
                  <ChevronLeft size={14} /> Sebelumnya
                </Link>
              ) : null}
              {episode.navigation?.next_episode ? (
                <Link href={`/donghua/episode/${episode.navigation.next_episode.slug}`} className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-4 py-2 text-[12px] font-bold text-slate-100 transition hover:bg-sky-500">
                  Berikutnya <ChevronRight size={14} />
                </Link>
              ) : null}
            </div>

            <section className="mt-5 overflow-hidden rounded-3xl bg-black shadow-2xl">
              {activeUrl ? (
                <iframe
                  key={activeUrl}
                  src={activeUrl}
                  className="aspect-video w-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                  referrerPolicy="no-referrer"
                  title={episode.episode}
                />
              ) : (
                <div className="flex aspect-video items-center justify-center px-6 text-center text-sm text-slate-400">
                  Player episode ini belum tersedia dari sumbernya.
                </div>
              )}
            </section>

            {servers.length ? (
              <section className="mt-5 rounded-3xl bg-white/[0.04] p-4 sm:p-5">
                <h2 className="text-base font-extrabold text-white">Server Nonton</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">Kalau server utama macet, coba server lain di bawah ini.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {servers.map((server) => (
                    <button
                      key={`${server.name}-${server.url}`}
                      onClick={() => setActiveUrl(server.url)}
                      className={`rounded-full px-4 py-2 text-[12px] font-bold transition ${
                        activeUrl === server.url ? 'bg-sky-500 text-white' : 'bg-white/[0.06] text-slate-200 hover:bg-sky-500 hover:text-white'
                      }`}
                    >
                      {server.name}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}
