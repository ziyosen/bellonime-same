import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { fetchUnifiedLatest } from '@/lib/unified';

export default async function UnifiedAnimeSection() {
  const items = await fetchUnifiedLatest();

  if (!items.length) return null;

  return (
    <section className="mt-4 bg-[#070b12] text-white">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-[26px] font-semibold leading-tight tracking-tight sm:text-3xl">
          New Update Anime
        </h2>
        <Link href="/jadwal" className="shrink-0 text-sm font-semibold text-orange-400 hover:text-orange-300">
          Lihat Jadwal &gt;
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-6">
        {items.map((item) => (
          <Link key={item.key} href={item.href} className="group block min-w-0">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-800">
              {item.poster ? (
                <Image
                  src={item.poster}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  unoptimized
                />
              ) : null}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <span className="absolute left-0 top-3 rounded-r-full bg-orange-500 px-3 py-1 text-[12px] font-bold leading-none text-white shadow">
                New
              </span>
              {(item.score || item.meta) && (
                <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  {item.score || item.meta}
                </span>
              )}
              {item.episodes && (
                <span className="absolute bottom-2 left-2 text-[12px] font-medium text-white/95">
                  Eps {item.episodes}
                </span>
              )}
            </div>
            <h3 className="mt-2 line-clamp-2 min-h-[2.5rem] break-words text-[13px] font-medium leading-snug text-slate-100">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
