import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SANKA_SOURCES, fetchSankaDetail } from '@/lib/sanka';

export default async function SumberItemPage({
  params,
}: {
  params: Promise<{ source: string; id: string }>;
}) {
  const { source: sourceSlug, id } = await params;
  const source = SANKA_SOURCES[sourceSlug];
  if (!source) notFound();

  const decodedId = decodeURIComponent(id);
  const detail = await fetchSankaDetail(source, decodedId);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
      <Link href={`/sumber/${source.slug}`} className="text-sm text-sky-500 hover:underline">
        ← Kembali ke {source.label}
      </Link>

      {!detail ? (
        <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          Detail untuk item ini belum bisa diambil dari endpoint sumber. ID: {decodedId}
        </div>
      ) : (
        <article className="mt-6">
          <div className="grid gap-6 md:grid-cols-[240px_1fr]">
            {detail.poster ? (
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800">
                <Image src={detail.poster} alt={detail.title || decodedId} fill className="object-cover" unoptimized />
              </div>
            ) : null}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-sky-500">{source.badge}</div>
              <h1 className="mt-2 text-2xl font-bold">{detail.title || decodedId}</h1>
              <p className="mt-2 break-all text-xs text-slate-400">Endpoint detail: {detail.endpoint}</p>
              {detail.paragraphs.slice(0, 5).map((paragraph, idx) => (
                <p key={idx} className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {paragraph}
                </p>
              ))}
              {detail.links.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {detail.links.slice(0, 12).map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:border-sky-400 hover:text-sky-500 dark:border-slate-700"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {detail.images.length ? (
            <section className="mt-8">
              <h2 className="text-lg font-bold">Baca Chapter</h2>
              <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900">
                {detail.images.slice(0, 120).map((src, idx) => (
                  <div key={src} className="relative w-full">
                    <Image src={src} alt={`${detail.title || decodedId} halaman ${idx + 1}`} width={1200} height={1600} className="h-auto w-full" unoptimized />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {detail.items.length ? (
            <section className="mt-8">
              <h2 className="text-lg font-bold">Daftar Episode / Chapter</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {detail.items.slice(0, 60).map((item) => (
                  <Link
                    key={`${item.id}-${item.title}`}
                    href={`/sumber/${source.slug}/item/${encodeURIComponent(item.id)}`}
                    className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold shadow-sm hover:border-sky-400 dark:border-slate-800 dark:bg-slate-900"
                  >
                    {item.title}
                    {item.meta ? <span className="mt-1 block text-xs font-normal text-slate-400">{item.meta}</span> : null}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      )}
    </main>
  );
}
