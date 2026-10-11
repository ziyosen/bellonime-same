import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { fetchUnifiedLatest } from '@/lib/unified';

export const metadata = {
  title: 'Anime Terbaru',
  description: 'Daftar anime terbaru yang baru diperbarui.',
};

export default async function TerbaruPage() {
  const items = (await fetchUnifiedLatest()).filter((item) => item.href.startsWith('/anime/'));

  return (
    <main className="min-h-screen bg-[#070b12] pb-28 pt-[84px] text-white md:pb-12 md:pt-24">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Terbaru</h1>

        {items.length ? (
          <div className="mt-7 grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {items.map((item) => (
              <Link key={item.key} href={item.href} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/[0.06]">
                  {item.poster ? (
                    <Image src={item.poster} alt={item.title} fill sizes="180px" className="object-cover transition duration-300 group-hover:scale-105" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center text-xs text-slate-400">Tidak ada poster</div>
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-extrabold text-white">New</span>
                  {item.score ? (
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[10px] font-bold text-amber-300">
                      <Star size={10} fill="currentColor" /> {item.score}
                    </span>
                  ) : null}
                  {item.episodes ? (
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2 py-1 text-[10px] font-bold text-white">Eps {item.episodes}</span>
                  ) : null}
                </div>
                <h2 className="mt-2.5 line-clamp-2 h-[38px] overflow-hidden text-[13px] font-semibold leading-[1.45] text-slate-100">{item.title}</h2>
                {item.meta ? <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">{item.meta}</p> : null}
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl bg-white/[0.05] px-5 py-6 text-sm text-slate-300">Daftar terbaru lagi kosong dari sumbernya. Coba lagi sebentar ya.</p>
        )}
      </div>
    </main>
  );
}
