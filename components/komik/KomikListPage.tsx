'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import KomikGrid from '@/components/komik/KomikGrid';
import KomikTagline from '@/components/komik/KomikTagline';
import { fetchWestList, fetchWestGenre, fetchWestSearch, type WestCard } from '@/lib/westmanga';

type Mode =
  | { type: 'kategori'; kind: string }
  | { type: 'genre'; genreId: string }
  | { type: 'search'; query: string };

export default function KomikListPage({
  title,
  mode,
  totalPages = 10,
}: {
  title: string;
  mode: Mode;
  totalPages?: number;
}) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<WestCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [title]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    (async () => {
      try {
        let data: WestCard[] = [];
        if (mode.type === 'kategori') data = await fetchWestList(mode.kind, page);
        else if (mode.type === 'genre') data = await fetchWestGenre(mode.genreId, page);
        else data = await fetchWestSearch(mode.query, page);
        if (alive) setItems(data);
      } catch {
        if (alive) setError('Daftar ini belum bisa diambil dari sumbernya.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, title]);

  return (
    <main className="min-h-screen bg-black pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-[1500px] px-3 pt-[58px] sm:px-6 md:pt-16 lg:px-8">
        <KomikTagline />
        <Link href="/komik" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300 hover:text-orange-200">
          <ArrowLeft size={16} /> Kembali ke Komik
        </Link>
        <h1 className="mt-4 text-2xl font-black sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-slate-400">
          Halaman {page} dari {totalPages}
        </p>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">Memuat...</div>
        ) : error ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">{error}</div>
        ) : !items.length ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">
            Belum ada komik yang tampil di halaman ini dari sumbernya.
          </div>
        ) : (
          <div className="mt-6">
            <KomikGrid items={items} />
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="inline-flex h-10 items-center gap-1 rounded-full bg-white/[0.06] px-4 text-[13px] font-bold text-slate-200 transition enabled:hover:bg-orange-500 enabled:hover:text-white disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-10 w-10 rounded-full text-[13px] font-extrabold transition ${
                p === page ? 'bg-orange-500 text-white' : 'bg-white/[0.06] text-slate-200 hover:bg-orange-500 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="inline-flex h-10 items-center gap-1 rounded-full bg-white/[0.06] px-4 text-[13px] font-bold text-slate-200 transition enabled:hover:bg-orange-500 enabled:hover:text-white disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </main>
  );
}
