import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SANKA_SOURCES, fetchSankaItems } from '@/lib/sanka';

export default async function SumberSourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ source: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { source: sourceSlug } = await params;
  const { q = '' } = await searchParams;
  const source = SANKA_SOURCES[sourceSlug];
  if (!source) notFound();

  const { items, message } = await fetchSankaItems(source, q.trim());

  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
      <Link href="/sumber" className="text-sm text-sky-500 hover:underline">
        ← Semua sumber
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-sky-500">{source.badge}</div>
          <h1 className="mt-1 text-2xl font-bold">{source.label}</h1>
        </div>
        <form className="flex gap-2" action={`/sumber/${source.slug}`}>
          <input
            name="q"
            defaultValue={q}
            placeholder={`Cari di ${source.label}...`}
            className="w-64 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Cari</button>
        </form>
      </div>

      {message ? (
        <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {message}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <article
            key={`${item.id}-${item.title}`}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {item.poster ? (
              <div className="relative aspect-[3/4] bg-slate-200 dark:bg-slate-800">
                <Image src={item.poster} alt={item.title} fill className="object-cover" unoptimized />
              </div>
            ) : null}
            <div className="p-3">
              <Link href={`/sumber/${source.slug}/item/${encodeURIComponent(item.id)}`} className="hover:text-sky-500">
                <h2 className="line-clamp-2 text-sm font-semibold">{item.title}</h2>
              </Link>
              {item.meta ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.meta}</p> : null}
              <p className="mt-2 break-all text-[11px] text-slate-400">{item.id}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
