import Link from 'next/link';
import { SANKA_SOURCES } from '@/lib/sanka';

export default function SumberPage() {
  const sources = Object.values(SANKA_SOURCES);
  return (
    <main className="mx-auto max-w-[1500px] px-4 pb-28 pt-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Sumber Tambahan</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Oploverz dan Winbu disiapkan untuk gabungan katalog utama. Donghua, Hentai, komik, komik 18+, dan novel tetap dipisah sesuai rencana.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((source) => (
          <Link
            key={source.slug}
            href={`/sumber/${source.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-orange-500">{source.badge}</div>
            <div className="mt-2 text-lg font-bold">{source.label}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
