import Link from 'next/link';
import type { DonghuaCard } from '@/lib/donghua';

export default function DonghuaGrid({ items }: { items: DonghuaCard[] }) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
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
              <span className="absolute bottom-2 left-2 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-extrabold text-white">{item.episodeLabel}</span>
            ) : null}
          </div>
          <h2 className="mt-2.5 line-clamp-2 h-[38px] overflow-hidden text-[13px] font-semibold leading-[1.45] text-slate-100">{item.title}</h2>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">{[item.type, item.status].filter(Boolean).join(' • ')}</p>
        </Link>
      ))}
    </div>
  );
}
