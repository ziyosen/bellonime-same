'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { fetchDonghuaSearch, type DonghuaCard } from '@/lib/donghua';
import DonghuaGrid from '@/components/donghua/DonghuaGrid';

function SearchInner() {
  const searchParams = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const [items, setItems] = useState<DonghuaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchDonghuaSearch(query, 1);
        if (alive) setItems(data);
      } catch {
        if (alive) setError('Pencarian belum bisa diambil dari sumbernya.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [query]);

  return (
    <main className="min-h-screen bg-[#070b12] pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-7xl px-3 pt-[74px] sm:px-6 md:pt-20 lg:px-8">
        <Link href="/donghua" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200">
          <ArrowLeft size={16} /> Kembali ke Donghua
        </Link>
        <h1 className="mt-4 text-2xl font-black sm:text-3xl">Cari: {query || '-'}</h1>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">Mencari...</div>
        ) : error ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">{error}</div>
        ) : !items.length ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">
            Belum ada hasil yang tampil untuk kata ini dari sumbernya.
          </div>
        ) : (
          <div className="mt-6">
            <DonghuaGrid items={items} />
          </div>
        )}
      </div>
    </main>
  );
}

export default function DonghuaSearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b12]" />}>
      <SearchInner />
    </Suspense>
  );
}
