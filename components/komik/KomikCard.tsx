import Link from 'next/link';
import { Clock3, Star } from 'lucide-react';
import { chapterUpdatedLabel, type WestCard } from '@/lib/westmanga';
import { FlagBadge } from './FlagBadge';

export default function KomikCard({ item }: { item: WestCard }) {
  const lastCh = item.lastChapters?.[0];
  const updated = chapterUpdatedLabel(lastCh);
  return (
    <Link href={`/komik/detail/${item.slug}`} className="group block w-[118px] shrink-0 sm:w-[132px]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-gradient-to-br from-slate-800 to-slate-900 ring-1 ring-white/10">
        {item.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.cover}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-2 text-center text-[11px] font-bold text-slate-300">
            {item.title}
          </div>
        )}
        <span className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/70 to-transparent" />
        {/* CH pill di atas gambar dihapus: tampil dobel dengan baris CH+waktu di bawah kartu */}

        {/* bendera negara tepat: JPN/KOR/CHN */}
        {item.countryId ? (
          <span className="absolute right-2 top-2 z-10">
            <FlagBadge country={item.countryId} />
          </span>
        ) : null}
        {(() => { const c = item.color; return (typeof c === 'boolean' ? c : String(c || '').toLowerCase() === 'colored'); })() ? (
          <span className="absolute bottom-2 right-2 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-extrabold text-black">
            COLOR
          </span>
        ) : null}
        {item.rating ? (
          <span className="absolute left-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
            <Star size={10} fill="currentColor" /> {item.rating}
          </span>
        ) : null}
      </div>
      <h3 className="mt-2.5 h-[38px] overflow-hidden text-[12px] font-semibold leading-[1.45] text-slate-100 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-[13px]">
        {item.title}
      </h3>
      <div className="mt-1 flex items-center justify-between gap-1">
        {lastCh?.number ? (
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-200">CH {lastCh.number}</span>
        ) : <span />}
        {updated ? (
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">{updated}</span>
        ) : <span />}
      </div>
    </Link>
  );
}
