'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { fetchDonghuaGenre, type DonghuaCard } from '@/lib/donghua';

function formatGenreName(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function DonghuaGenrePage() {
  const params = useParams();
  const slug = String(params.slug || '');
  const [items, setItems] = useState<DonghuaCard[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchDonghuaGenre(slug, 1);
        if (alive) setItems(data);
      } catch {
        if (alive) setError('Daftar genre ini belum bisa diambil dari sumbernya.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#070b12] pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-7xl px-3 pt-[74px] sm:px-6 md:pt-20 lg:px-8">
        <Link href="/donghua" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200">
          <ArrowLeft size={16} /> Kembali ke Donghua
        </Link>
        <h1 className="mt-4 text-2xl font-black sm:text-3xl">{formatGenreName(slug)}</h1>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">Memuat...</div>
        ) : error ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">{error}</div>
        ) : !items.length ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl bg-white/[0.05] p-6 text-center text-sm text-slate-300">
            Belum ada Donghua yang tampil untuk genre ini dari sumbernya.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {items.map((item) => (
              <Link key={item.slug} href={`/donghua/${item.slug}`} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/[0.06]">
                  {item.poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.poster} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center text-xs text-slate-400">Tidak ada poster</div>
                  )}
                  {item.episodeLabel ? (
                    <span className="absolute bottom-2 left-2 rounded-full bg-sky-500 px-2 py-1 text-[10px] font-extrabold text-white">{item.episodeLabel}</span>
                  ) : null}
                </div>
                <h2 className="mt-2.5 line-clamp-2 h-[38px] overflow-hidden text-[13px] font-semibold leading-[1.45] text-slate-100">{item.title}</h2>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">{[item.type, item.status].filter(Boolean).join(' • ')}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
