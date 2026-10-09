'use client';

import { use, useEffect, useState } from 'react';
import KomikTagline from '@/components/komik/KomikTagline';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Star } from 'lucide-react';
import {
  chapterUpdatedLabel,
  fetchWestDetail,
  type WestDetail,
} from '@/lib/westmanga';

export default function KomikDetailPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [detail, setDetail] = useState<WestDetail | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [ascending, setAscending] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchWestDetail(slug);
        if (alive) setDetail(data);
      } catch {
        if (alive) setError('Detail komik ini belum bisa diambil dari sumbernya.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const chapters = detail
    ? [...detail.chapters].sort((a, b) => {
        const na = Number(a.number) || 0;
        const nb = Number(b.number) || 0;
        return ascending ? na - nb : nb - na;
      })
    : [];
  const firstChapter = detail?.chapters.length
    ? [...detail.chapters].sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0))[0]
    : null;

  return (
    <main className="min-h-screen bg-[#070b12] pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-5xl px-3 pt-[58px] sm:px-6 md:pt-16 lg:px-8">
        <KomikTagline />
        <Link href="/komik" className="inline-flex items-center gap-2 text-sm font-semibold text-rose-300 hover:text-rose-200">
          <ArrowLeft size={16} /> Kembali ke Komik
        </Link>

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">Memuat detail...</div>
        ) : error || !detail ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">
            {error || 'Detail komik ini belum bisa diambil dari sumbernya.'}
          </div>
        ) : (
          <>
            <section className="mt-6 grid gap-5 rounded-[28px] bg-white/[0.04] p-4 ring-1 ring-white/10 sm:grid-cols-[170px_1fr] sm:p-6">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-slate-800">
                {detail.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={detail.cover} alt={detail.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <h1 className="text-2xl font-black leading-tight sm:text-3xl">{detail.title}</h1>
                {detail.alternativeName ? <p className="mt-1 text-sm text-slate-400">{detail.alternativeName}</p> : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {detail.rating ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1.5 text-[12px] font-bold text-amber-300">
                      <Star size={13} fill="currentColor" /> {detail.rating}
                    </span>
                  ) : null}
                  {detail.status ? (
                    <span className="rounded-full bg-white/[0.07] px-3 py-1.5 text-[12px] font-bold text-slate-200">{detail.status}</span>
                  ) : null}
                  {detail.totalViews ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 text-[12px] font-bold text-slate-200">
                      <Eye size={13} /> {detail.totalViews.toLocaleString('id-ID')}
                    </span>
                  ) : null}
                  <span className="rounded-full bg-white/[0.07] px-3 py-1.5 text-[12px] font-bold text-slate-200">
                    {chapters.length} chapter
                  </span>
                </div>
                {detail.sinopsis ? <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-300">{detail.sinopsis}</p> : null}
                {firstChapter?.slug ? (
                  <Link
                    href={`/komik/baca/${firstChapter.slug}`}
                    className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-rose-500 px-5 text-sm font-extrabold text-white transition hover:bg-rose-400"
                  >
                    <BookOpen size={16} /> Baca Chapter Pertama
                  </Link>
                ) : null}
              </div>
            </section>

            <div className="mt-5 grid gap-3 rounded-[24px] bg-white/[0.04] p-4 text-sm ring-1 ring-white/10 sm:grid-cols-3 sm:p-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Pengarang</p>
                <p className="mt-1 font-semibold text-slate-100">{detail.author || '-'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Status</p>
                <p className="mt-1 font-semibold text-slate-100">{detail.status || '-'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Asal</p>
                <p className="mt-1 font-semibold text-slate-100">{detail.countryId || '-'}</p>
              </div>
            </div>

            {detail.genres.length ? (
              <section className="mt-6">
                <h2 className="mb-3 text-base font-extrabold text-white">Genre</h2>
                <div className="flex flex-wrap gap-2">
                  {detail.genres.map((g) => (
                    <Link
                      key={`${g.id}-${g.name}`}
                      href={`/komik/genre/${g.id}`}
                      className="rounded-full bg-white/[0.06] px-4 py-2 text-[12px] font-semibold text-slate-200 transition hover:bg-rose-500 hover:text-white"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">Daftar Chapter</h2>
                <button
                  onClick={() => setAscending((v) => !v)}
                  className="rounded-full bg-white/[0.06] px-3.5 py-2 text-[12px] font-bold text-slate-200 transition hover:bg-rose-500 hover:text-white"
                >
                  Urutan: {ascending ? 'Terlama' : 'Terbaru'}
                </button>
              </div>
              {!chapters.length ? (
                <div className="rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">
                  Chapter komik ini belum tersedia dari sumbernya.
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                  {chapters.map((ch) =>
                    ch.slug ? (
                      <Link
                        key={ch.slug}
                        href={`/komik/baca/${ch.slug}`}
                        title={chapterUpdatedLabel(ch) || undefined}
                        className="flex h-11 items-center justify-center rounded-xl bg-white/[0.06] text-[13px] font-extrabold text-slate-100 transition hover:bg-rose-500 hover:text-white"
                      >
                        {ch.number ?? ch.title ?? 'Ch'}
                      </Link>
                    ) : null,
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
