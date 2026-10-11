'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { fetchDonghuaAz, type DonghuaCard } from '@/lib/donghua';
import DonghuaGrid from '@/components/donghua/DonghuaGrid';

export default function DonghuaAzPage() {
  const params = useParams();
  const letter = String(params.letter || 'a');
  const [items, setItems] = useState<DonghuaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchDonghuaAz(letter, 1);
        if (alive) setItems(data);
      } catch {
        if (alive) setError('Daftar huruf ini belum bisa diambil dari sumbernya.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [letter]);

  return (
    <main className="min-h-screen bg-[#070b12] pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-[1500px] px-3 pt-[74px] sm:px-6 md:pt-20 lg:px-8">
        <Link href="/donghua" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300 hover:text-orange-200">
          <ArrowLeft size={16} /> Kembali ke Donghua
        </Link>
        <h1 className="mt-4 text-2xl font-black sm:text-3xl">Huruf {letter.toUpperCase()}</h1>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">Memuat...</div>
        ) : error ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">{error}</div>
        ) : !items.length ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">
            Belum ada Donghua yang tampil untuk huruf ini dari sumbernya.
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
