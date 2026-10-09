import Image from 'next/image';
import Link from 'next/link';
import { fetchUnifiedSearch } from '@/lib/unified';

export default async function UnifiedSearchSection({ query }: { query: string }) {
  const items = (await fetchUnifiedSearch(query)).filter((item) => item.href.startsWith('/sumber/'));
  if (!items.length) return null;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Gabungan Sumber Lain</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Tambahan dari Winbu/Otakudesu luar yang belum ada di katalog utama.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {items.map((item) => (
          <Link key={item.key} href={item.href} className="group block">
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
              {item.poster ? (
                <Image src={item.poster} alt={item.title} fill className="object-cover" unoptimized />
              ) : null}
              <div className="absolute left-0 top-3 rounded-r-full bg-sky-500 px-3 py-1 text-[11px] font-bold leading-none text-white shadow">
                New
              </div>
            </div>
            <h3 className="mt-2 line-clamp-2 text-sm font-semibold">{item.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
