import { API_BASE_URL, API_HEADERS } from "@/lib/config";
import type { Episode } from "@/types/anime";

type RawEpisode = {
  episodeId?: string;
  title?: string;
  animeId?: string;
  poster?: string;
  releasedOn?: string;
  defaultEmbed?: string;
  defaultStreamingUrl?: string;
  embedList?: string[];
  serverList?: unknown[];
  server?: { qualities?: { title?: string; serverList?: { title?: string; serverId?: string; href?: string }[] }[] };
  navigation?: { all?: string; next?: string; prev?: string };
  downloadUrl?: Episode['downloadUrl'];
  genreList?: Episode['genreList'];
  synopsis?: Episode['synopsis'];
};

function textValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function animeIdFromEpisode(raw: RawEpisode, episodeId: string): string {
  if (raw.animeId) return raw.animeId;
  const all = raw.navigation?.all || '';
  const match = all.match(/\/anime\/([^/]+)\/?$/);
  if (match) return decodeURIComponent(match[1]);
  return episodeId
    .replace(/-episode-\d+(?:-subtitle-indonesia)?$/i, '')
    .replace(/-subtitle-indonesia$/i, '');
}

function episodeNavItem(url: string | undefined, fallbackTitle: string) {
  if (!url) return null;
  const clean = url.replace(/\/$/, '');
  const episodeId = decodeURIComponent(clean.split('/').pop() || '');
  if (!episodeId) return null;
  return {
    title: fallbackTitle,
    episodeId,
    href: `/samehadaku/episode/${episodeId}`,
    samehadakuUrl: url,
  };
}

async function fetchEpisode(source: 'samehadaku' | 'animekiid' | 'sanka', episodeId: string): Promise<RawEpisode | null> {
  try {
    const base = source === 'sanka' ? 'https://www.sankavollerei.web.id/anime' : API_BASE_URL;
    const response = await fetch(`${base}/samehadaku/episode/${episodeId}`, {
      headers: API_HEADERS,
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const result = await response.json();
    const data = (result.data || null) as RawEpisode | null;
    return data?.title || data?.defaultEmbed || data?.defaultStreamingUrl ? data : null;
  } catch {
    return null;
  }
}

export async function getEpisodeData(episodeId: string): Promise<Episode> {
  const rawEpisode = (await fetchEpisode('samehadaku', episodeId)) || (await fetchEpisode('animekiid', episodeId)) || (await fetchEpisode('sanka', episodeId));
  if (!rawEpisode) {
    throw new Error("Gagal mengambil data episode anime");
  }
  const raw = rawEpisode;
  const embedList = (raw.embedList || []).filter((url) => typeof url === 'string' && /^https?:\/\//.test(url));
  const defaultStreamingUrl = raw.defaultStreamingUrl || raw.defaultEmbed || embedList[0] || '';
  const animeId = animeIdFromEpisode(raw, episodeId);
  const prevEpisode = episodeNavItem(raw.navigation?.prev, 'Sebelumnya');
  const nextEpisode = episodeNavItem(raw.navigation?.next, 'Berikutnya');

  return {
    title: textValue(raw.title),
    animeId,
    poster: textValue(raw.poster),
    releasedOn: textValue(raw.releasedOn),
    defaultStreamingUrl,
    hasPrevEpisode: Boolean(prevEpisode),
    prevEpisode,
    hasNextEpisode: Boolean(nextEpisode),
    nextEpisode,
    synopsis: raw.synopsis || { paragraphs: '', connections: [] },
    genreList: raw.genreList || [],
    server: {
      qualities: embedList.length
        ? [
            {
              title: 'Default',
              serverList: embedList.map((url, index) => ({
                title: `Server ${index + 1} Default`,
                serverId: url,
                href: url,
              })),
            },
          ]
        : (raw.server?.qualities || []).map((q: { title?: string; serverList?: { title?: string; serverId?: string; href?: string }[] }) => ({
            title: q.title || 'Default',
            serverList: (q.serverList || []).map((srv: { title?: string; serverId?: string; href?: string }) => ({
              title: srv.title || 'Server',
              serverId: srv.serverId || srv.href || '',
              href: srv.href || srv.serverId || '',
            })),
          })).filter((q: { serverList: unknown[] }) => q.serverList.length),
    },
    downloadUrl: raw.downloadUrl || { formats: [] },
    recomendedEpisodeList: [],
    movie: { href: '', samehadakuUrl: '', animeList: [] },
  };
}

export async function getServerUrl(serverId: string): Promise<string> {
  if (/^https?:\/\//.test(serverId)) return serverId;
  let response = await fetch(`${API_BASE_URL}/samehadaku/server/${serverId}`, {
    headers: API_HEADERS,
  });
  if (!response.ok) {
    // Fallback: server Sanka (movie Sanka-only pakai serverId format Sanka)
    response = await fetch(`https://www.sankavollerei.web.id/anime/samehadaku/server/${serverId}`, {
      headers: API_HEADERS,
    });
  }
  if (!response.ok) {
    throw new Error('Gagal mengambil URL server');
  }
  const result = await response.json();
  return result.data.url;
}
