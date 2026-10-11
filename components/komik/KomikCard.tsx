import Link from 'next/link';
import { Flame, Palette } from 'lucide-react';
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
        {item.countryId ? (
          <span className="absolute right-2 top-2 z-10">
            <FlagBadge country={item.countryId} size={22} />
          </span>
        ) : null}
        {item.color ? (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-amber-400 px-1.5 py-1 text-[9px] font-black tracking-wide text-slate-900">
            <Palette size={10} /> COLOR
          </span>
        ) : null}
        {item.hot ? (
          <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white shadow">
            <Flame size={13} fill="currentColor" />
          </span>
        ) : null}
      </div>
      <h3 className="mt-2.5 line-clamp-1 text-[13px] font-bold text-slate-100">{item.title}</h3>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="shrink-0 whitespace-nowrap rounded-full bg-white/[0.05] px-2.5 py-1.5 text-[10px] font-extrabold tracking-wide text-slate-200 ring-1 ring-white/10">
          {lastCh?.number ? `CH ${lastCh.number}` : 'CH -'}
        </span>
        <span className="min-w-0 flex-1 truncate whitespace-nowrap rounded-full bg-white/[0.05] px-2.5 py-1.5 text-right text-[10px] font-semibold text-slate-400 ring-1 ring-white/10">
          {updated || item.status || ''}
        </span>
      </div>
    </Link>
  );
}
