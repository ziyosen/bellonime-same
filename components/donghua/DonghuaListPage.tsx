'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchDonghuaListCached, type DonghuaCard } from '@/lib/donghua';
import DonghuaGrid from '@/components/donghua/DonghuaGrid';

export default function DonghuaListPage({
  title,
  kind,
  totalPages,
}: {
  title: string;
  kind: 'latest' | 'ongoing' | 'completed';
  totalPages: number;
}) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<DonghuaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    (async () => {
      try {
        const data = await fetchDonghuaListCached(kind, page);
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
  }, [kind, page]);

  return (
    <main className="min-h-screen bg-[#070b12] pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-[1500px] px-3 pt-[74px] sm:px-6 md:pt-20 lg:px-8">
        <Link href="/donghua" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300 hover:text-orange-200">
          <ArrowLeft size={16} /> Kembali ke Donghua
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
            Belum ada Donghua yang tampil di halaman ini dari sumbernya.
          </div>
        ) : (
          <div className="mt-6">
            <DonghuaGrid items={items} />
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
