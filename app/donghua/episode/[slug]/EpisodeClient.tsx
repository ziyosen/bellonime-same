'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getDonghuaEpisode, serverEmbedUrl } from '@/lib/services';

interface EpData {
  streaming?: {
    servers?: { server_id?: string; quality?: string; name?: string }[];
    main_url?: string;
  };
  navigation?: { prev?: string; next?: string };
}

export default function DonghuaEpisodeClient({ slugPromise }: { slugPromise: Promise<{ slug: string }> }) {
  const { slug } = use(slugPromise);
  const [ep, setEp] = useState<EpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const d = await getDonghuaEpisode(slug);
      if (!alive) return;
      setEp(d);
      setActiveSrc(d?.streaming?.main_url || null);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [slug]);

  const servers = ep?.streaming?.servers || [];
  const nav = ep?.navigation;

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-6 max-w-4xl mx-auto">
        <div className="aspect-video rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-4xl mx-auto">
      {/* Player */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mb-4">
        {activeSrc ? (
          <iframe
            src={activeSrc}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media"
            title="Player"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
            Server tidak tersedia — pilih server di bawah.
          </div>
        )}
      </div>

      {/* Navigasi prev/next */}
      <div className="flex justify-between gap-2 mb-4">
        {nav?.prev ? (
          <Link href={`/donghua/episode/${nav.prev}`} className="text-xs px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            ← Episode Sebelumnya
          </Link>
        ) : <span />}
        {nav?.next ? (
          <Link href={`/donghua/episode/${nav.next}`} className="text-xs px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Episode Selanjutnya →
          </Link>
        ) : <span />}
      </div>

      {/* Daftar server */}
      {servers.length > 0 && (
        <>
          <h2 className="text-sm font-semibold mb-2 text-slate-800 dark:text-slate-200">Server Nonton</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {servers.map((s, i) => {
              const id = s.server_id || '';
              const src = id ? serverEmbedUrl(id) : '';
              return (
                <button
                  key={id || i}
                  onClick={() => src && setActiveSrc(src)}
                  className={`text-xs px-3 py-1.5 rounded-full ${activeSrc === src ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  {s.name || s.quality || `Server ${i + 1}`}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
