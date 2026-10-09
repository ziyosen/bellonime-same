'use client';

import { use, useEffect, useState } from 'react';
import KomikTagline from '@/components/komik/KomikTagline';
import Link from 'next/link';
import { ArrowLeft, ListOrdered } from 'lucide-react';
import { fetchWestChapter, type WestChapter } from '@/lib/westmanga';

function seriesSlugFromChapter(chapterSlug: string): string {
  return chapterSlug.replace(/-chapter-[\d.-]+.*$/i, '');
}

export default function KomikBacaPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [chapter, setChapter] = useState<WestChapter | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchWestChapter(slug);
        if (alive) setChapter(data);
      } catch {
        if (alive) setError('Chapter ini belum bisa diambil dari sumbernya.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const seriesSlug = seriesSlugFromChapter(slug);

  return (
    <main className="min-h-screen bg-[#05070c] pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-3xl px-3 pt-[58px] sm:px-6 md:pt-16">
        <KomikTagline />
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/komik" className="inline-flex items-center gap-2 text-sm font-semibold text-rose-300 hover:text-rose-200">
            <ArrowLeft size={16} /> Komik
          </Link>
          {seriesSlug !== slug ? (
            <Link
              href={`/komik/detail/${seriesSlug}`}
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-[12px] font-bold text-slate-200 transition hover:bg-rose-500 hover:text-white"
            >
              <ListOrdered size={14} /> Daftar Chapter
            </Link>
          ) : null}
        </div>

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">Memuat chapter...</div>
        ) : error || !chapter ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">
            {error || 'Chapter ini belum bisa diambil dari sumbernya.'}
          </div>
        ) : (
          <>
            <h1 className="mt-5 text-xl font-black leading-tight sm:text-2xl">
              {chapter.seriesTitle || 'Baca Komik'}
              {chapter.number ? <span className="text-rose-300"> — Chapter {chapter.number}</span> : null}
            </h1>
            {!chapter.images.length ? (
              <div className="mx-auto mt-10 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">
                Gambar chapter ini belum tersedia dari sumbernya.
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-[20px] bg-black ring-1 ring-white/10">
                {chapter.images.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={`${src}-${i}`} src={src} alt={`Halaman ${i + 1}`} loading="lazy" className="w-full" />
                ))}
              </div>
            )}
            {seriesSlug !== slug ? (
              <Link
                href={`/komik/detail/${seriesSlug}`}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-rose-500 px-5 text-sm font-extrabold text-white transition hover:bg-rose-400"
              >
                <ListOrdered size={16} /> Kembali ke Daftar Chapter
              </Link>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
