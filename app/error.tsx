'use client';

import { useEffect } from 'react';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    const message = `${error?.name || ''} ${error?.message || ''}`;
    const isChunkError = /chunk|loading css|failed to fetch dynamically/i.test(message);
    const retryKey = 'anime-ui-error-retry';
    if (isChunkError && !sessionStorage.getItem(retryKey)) {
      sessionStorage.setItem(retryKey, '1');
      window.location.reload();
    }
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070b12] px-5 pb-28 pt-24 text-white">
      <div className="max-w-sm text-center">
        <h1 className="text-xl font-extrabold">Halaman gagal dimuat</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Biasanya karena file halaman baru saja diperbarui. Coba muat ulang ya.
        </p>
        <button
          onClick={() => {
            sessionStorage.removeItem('anime-ui-error-retry');
            reset();
            window.location.reload();
          }}
          className="mt-5 rounded-full bg-sky-500 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-sky-400"
        >
          Muat Ulang
        </button>
      </div>
    </main>
  );
}
