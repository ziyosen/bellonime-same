'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Episode, ServerInfo } from '@/types/anime';
import { Clapperboard } from 'lucide-react';
import { getServerUrl } from '@/lib/services';

type FlatServer = ServerInfo & { quality: string };

export default function EpisodePlayerSection({ episode }: { episode: Episode }) {
  const servers = useMemo<FlatServer[]>(() => {
    const flat: FlatServer[] = [];
    (episode.server?.qualities || []).forEach((quality) => {
      quality.serverList.forEach((server) => {
        flat.push({ ...server, quality: quality.title });
      });
    });
    return flat;
  }, [episode.server]);

  const [activeServer, setActiveServer] = useState<FlatServer | null>(null);
  const [activeStreamUrl, setActiveStreamUrl] = useState(episode.defaultStreamingUrl);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setActiveStreamUrl(episode.defaultStreamingUrl);
    setActiveServer(servers[0] || null);
  }, [episode.defaultStreamingUrl, episode.title, servers]);

  const handleServerChange = async (server: FlatServer) => {
    setActiveServer(server);
    if (/^https?:\/\//.test(server.serverId)) {
      setActiveStreamUrl(server.serverId);
      return;
    }
    setIsLoading(true);
    try {
      const newUrl = await getServerUrl(server.serverId);
      setActiveStreamUrl(newUrl);
    } catch (error) {
      console.error('Gagal ganti server:', error);
      alert('Gagal mengganti server. Coba server lain.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <section className="relative mx-auto aspect-video w-full max-w-[900px] overflow-hidden rounded-xl bg-black shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
            <div className="text-sm font-medium text-white">Mengganti server...</div>
          </div>
        )}
        {activeStreamUrl ? (
          <iframe
            key={activeStreamUrl}
            src={activeStreamUrl}
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 z-0 h-full w-full"
            title={episode.title}
          />
        ) : (
          <div className="absolute inset-0 z-0 flex items-center justify-center px-6 text-center text-sm text-white">
            Player episode ini belum tersedia dari sumbernya.
          </div>
        )}
      </section>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Clapperboard size={16} className="text-slate-500 dark:text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Server Nonton</h2>
          {activeServer ? (
            <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold text-orange-500">
              {activeServer.title.replace(/\s+Default$/i, '')}
            </span>
          ) : null}
        </div>
        {servers.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {servers.map((server, index) => {
              const isActive = activeServer?.serverId === server.serverId;
              return (
                <button
                  key={`${server.serverId}-${index}`}
                  onClick={() => handleServerChange(server)}
                  className={`rounded-lg px-3.5 py-2 text-[13px] font-semibold transition ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Server {index + 1}
                  {server.quality && server.quality !== 'Default' ? ` • ${server.quality}` : ''}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 text-[13px] text-slate-500 dark:text-slate-400">
            Belum ada server tambahan dari sumbernya; player di atas memakai server bawaan episode.
          </p>
        )}
      </div>
    </div>
  );
}
