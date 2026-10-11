import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

export type ZonaCardItem = {
  title: string;
  poster: string;
  href: string;
  score?: string;
  meta?: string;
  episodes?: string;
};

// Kartu standar gaya Zona Cinema — DIPAKAI di semua grid (homepage & halaman bawah) biar konsisten.
export default function ZonaCard({ item }: { item: ZonaCardItem }) {
  const episodeLabel = item.episodes
    ? `Ep ${item.episodes}`
    : item.meta && /ep(isode)?\s*\d+/i.test(item.meta)
      ? item.meta
      : '';
  return (
    <Link href={item.href} className="group block w-full">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/[0.06] transition-transform duration-300 group-hover:-translate-y-1">
        {item.poster ? (
          <Image src={item.poster} alt={item.title} fill sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw" className="object-cover transition duration-300 group-hover:scale-105" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-slate-400">Tidak ada poster</div>
        )}
        {item.score ? (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[10px] font-bold text-amber-300">
            <Star size={10} fill="currentColor" /> {item.score}
          </span>
        ) : null}
        {episodeLabel ? (
          <span className="absolute bottom-2 left-2 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-extrabold text-white">{episodeLabel}</span>
        ) : null}
      </div>
      <h3 className="mt-2.5 line-clamp-2 h-[38px] overflow-hidden break-words text-[13px] font-semibold leading-[1.45] text-slate-100">{item.title}</h3>
      {item.meta ? <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">{item.meta}</p> : null}
    </Link>
  );
}

// Grid standar — SAMA di semua halaman.
export function ZonaGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">{children}</div>;
}
