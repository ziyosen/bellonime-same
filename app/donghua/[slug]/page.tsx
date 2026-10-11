'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Play, Star, ArrowLeft } from 'lucide-react';
import { fetchDonghuaDetail, type DonghuaDetail } from '@/lib/donghua';

export default function DonghuaDetailPage() {
  const params = useParams();
  const slug = String(params.slug || '');
  const [detail, setDetail] = useState<DonghuaDetail | null>(null);
  const [error, setError] = useState('');
  const [ascending, setAscending] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchDonghuaDetail(slug);
        if (alive) setDetail(data);
      } catch {
        if (alive) setError('Detail Donghua ini belum bisa diambil dari sumbernya.');
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const episodes = useMemo(() => {
    const list = [...(detail?.episodes_list || [])];
    list.sort((a, b) => Number(a.episode_number || 0) - Number(b.episode_number || 0));
    return ascending ? list : [...list].reverse();
  }, [detail, ascending]);

  return (
    <main className="min-h-screen bg-[#070b12] pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-6xl px-3 pt-[74px] sm:px-6 md:pt-20 lg:px-8">
        <Link href="/donghua" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300 hover:text-orange-200">
          <ArrowLeft size={16} /> Kembali ke Donghua
        </Link>

        {!detail && !error ? (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">Memuat detail...</div>
        ) : error ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">{error}</div>
        ) : detail ? (
          <>
            <section className="mt-5 grid gap-6 md:grid-cols-[240px_1fr]">
              <div className="relative aspect-[2/3] w-44 overflow-hidden rounded-3xl bg-white/[0.06] sm:w-full">
                {detail.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={detail.poster} alt={detail.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <h1 className="text-2xl font-black leading-tight sm:text-4xl">{detail.title}</h1>
                {detail.alter_title ? <p className="mt-1 text-sm text-slate-400">{detail.alter_title}</p> : null}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] font-semibold text-slate-300">
                  {detail.rating ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-3 py-1 text-amber-300">
                      <Star size={12} fill="currentColor" /> {detail.rating}
                    </span>
                  ) : null}
                  {detail.status ? <span className="rounded-full bg-white/[0.06] px-3 py-1">{detail.status}</span> : null}
                  {detail.type ? <span className="rounded-full bg-white/[0.06] px-3 py-1">{detail.type}</span> : null}
                  {detail.episodes_count ? <span className="rounded-full bg-white/[0.06] px-3 py-1">{detail.episodes_count} episode</span> : null}
                </div>
                {detail.synopsis ? <p className="mt-4 text-sm leading-relaxed text-slate-300">{detail.synopsis}</p> : null}
                {episodes.length ? (
                  <Link
                    href={`/donghua/episode/${episodes[0].slug}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400"
                  >
                    <Play size={17} fill="currentColor" /> Tonton Episode Pertama
                  </Link>
                ) : null}
                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-3">
                  {detail.studio ? (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Studio</dt>
                      <dd className="mt-0.5 font-medium text-slate-100">{detail.studio}</dd>
                    </div>
                  ) : null}
                  {detail.released ? (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tayang</dt>
                      <dd className="mt-0.5 font-medium text-slate-100">{detail.released}</dd>
                    </div>
                  ) : null}
                  {detail.duration ? (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Durasi</dt>
                      <dd className="mt-0.5 font-medium text-slate-100">{detail.duration}</dd>
                    </div>
                  ) : null}
                </dl>
                {detail.genres?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {detail.genres.map((g) => (
                      <span key={g.slug} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[12px] font-semibold text-slate-200">
                        {g.name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>

            <section className="mt-10">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold text-white">Daftar Episode</h2>
                <button
                  onClick={() => setAscending((v) => !v)}
                  className="rounded-full bg-white/[0.06] px-4 py-2 text-[12px] font-bold text-slate-200 transition hover:bg-orange-500 hover:text-white"
                >
                  Urutan: {ascending ? 'Terlama' : 'Terbaru'}
                </button>
              </div>
              <p className="mb-4 text-sm text-slate-400">{episodes.length} episode tersedia</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                {episodes.map((ep) => (
                  <Link
                    key={ep.slug}
                    href={`/donghua/episode/${ep.slug}`}
                    className="rounded-xl bg-white/[0.06] px-2 py-3 text-center text-[13px] font-bold text-slate-100 transition hover:bg-orange-500 hover:text-white"
                  >
                    {ep.episode_number || ep.episode}
                  </Link>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
