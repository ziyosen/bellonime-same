'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import KomikListPage from '@/components/komik/KomikListPage';

function SearchInner() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  return <KomikListPage title={q ? `Hasil: ${q}` : 'Pencarian Komik'} mode={{ type: 'search', query: q }} totalPages={10} />;
}

export default function KomikSearchPageRoute() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-black text-sm text-slate-400">
          Memuat pencarian...
        </main>
      }
    >
      <SearchInner />
    </Suspense>
  );
}
