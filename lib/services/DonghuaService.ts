
// ============================================================
// DonghuaService — sumber: Sanka Vollerei API (sankavollerei.web.id)
// PENTING: fetch LANGSUNG dari BROWSER user (CORS Sanka terbuka *).
// JANGAN fetch dari server Next.js — IP datacenter kena Cloudflare
// challenge (403). Rate limit Sanka 45 req/menit (3 warning = ban):
// gunakan cache & hindari burst.
// ============================================================

export const SANKA_BASE = 'https://www.sankavollerei.web.id/anime/donghua';

const PLACEHOLDER = '/images/sankadonghub.jpg';

export interface DonghuaItem {
  title: string;
  slug: string;
  poster: string;
  type?: string;
  rating?: string;
  episode?: string;
  href?: string;
}

// --- cache sederhana in-memory + localStorage (TTL 6 jam) ---
const CACHE_TTL = 6 * 60 * 60 * 1000;

function cacheKey(path: string) {
  return `sanka:${path}`;
}

function readCache<T>(path: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(cacheKey(path));
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data as T;
  } catch {
    return null;
  }
}

function writeCache(path: string, data: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(cacheKey(path), JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // kuota localStorage penuh — abaikan
  }
}

export async function sankaFetch<T>(path: string): Promise<T | null> {
  const cached = readCache<T>(path);
  if (cached) return cached;
  try {
    const res = await fetch(`${SANKA_BASE}${path}`, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = (await res.json()) as T;
    writeCache(path, data);
    return data;
  } catch {
    return null;
  }
}

// --- derive slug seri dari slug episode ---
export function seriesSlugFromEpisode(slug: string): string | null {
  const m = slug.match(/^(.+)-episode-\d+/i);
  return m ? m[1] : null;
}

// --- peta slug-seri -> poster dari endpoint yang punya poster ---
let posterMapPromise: Promise<Map<string, string>> | null = null;

async function buildPosterMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const sources = ['/home/1', '/home/2', '/home/3', '/latest/1', '/latest/2', '/ongoing/1'];
  // sequential dengan jeda — hemat rate limit (bukan Promise.all)
  for (const p of sources) {
    const data = await sankaFetch<Record<string, unknown>>(p);
    if (!data) continue;
    const lists = Object.values(data).filter((v): v is DonghuaItem[] => Array.isArray(v));
    for (const list of lists) {
      for (const item of list) {
        if (!item?.poster || !item?.slug) continue;
        const seri = seriesSlugFromEpisode(item.slug) || item.slug;
        if (!map.has(seri)) map.set(seri, item.poster);
      }
    }
  }
  return map;
}

export function getPosterMap(): Promise<Map<string, string>> {
  if (!posterMapPromise) posterMapPromise = buildPosterMap();
  return posterMapPromise;
}

export function posterFor(slug: string, rawPoster?: string | null, map?: Map<string, string>): string {
  return rawPoster || map?.get(slug) || PLACEHOLDER;
}

// --- sort episode numerik (data Sanka acak; .reverse() tidak cukup) ---
export function sortEpisodesDesc<T extends { title: string }>(eps: T[]): T[] {
  return [...eps].sort((a, b) => {
    const na = parseFloat((a.title.match(/Ep\s+([\d.]+)/i) || [])[1] ?? '0');
    const nb = parseFloat((b.title.match(/Ep\s+([\d.]+)/i) || [])[1] ?? '0');
    return nb - na;
  });
}

// --- fetchers UI ---
interface HomeResp {
  latest_release?: DonghuaItem[];
  [k: string]: unknown;
}

export async function getDonghuaHome(page = 1): Promise<DonghuaItem[]> {
  const data = await sankaFetch<HomeResp>(`/home/${page}`);
  if (!data) return [];
  const lists = Object.values(data).filter((v): v is DonghuaItem[] => Array.isArray(v));
  const out: DonghuaItem[] = [];
  const map = await getPosterMap();
  for (const list of lists) {
    for (const it of list) {
      if (!it?.slug) continue;
      const seri = seriesSlugFromEpisode(it.slug) || it.slug;
      out.push({ ...it, poster: posterFor(seri, it.poster, map) });
    }
  }
  return out;
}

export interface ScheduleDay {
  day: string;
  animeList: { title: string; slug: string; poster: string }[];
}

export async function getDonghuaSchedule(): Promise<ScheduleDay[]> {
  const data = await sankaFetch<{ schedule?: { day: string; donghua_list: { title: string; slug: string; poster?: string }[] }[] }>('/schedule');
  if (!data?.schedule) return [];
  const map = await getPosterMap();
  return data.schedule.map((d) => ({
    day: d.day,
    animeList: (d.donghua_list || []).map((it) => ({
      title: it.title,
      slug: it.slug,
      poster: posterFor(it.slug, it.poster, map),
    })),
  }));
}

export interface DonghuaDetail {
  title: string;
  poster?: string;
  synopsis?: string;
  rating?: string;
  status?: string;
  type?: string;
  episodes_count?: string;
  episodes_list?: { episode: string; slug: string }[];
}

export async function getDonghuaDetail(slug: string) {
  const raw = await sankaFetch<DonghuaDetail>(`/detail/${slug}`);
  if (!raw) return null;
  const map = await getPosterMap();
  const episodeList = sortEpisodesDesc(
    (raw.episodes_list || []).map((e) => {
      const m = e.episode.match(/Episode\s+([\d.]+)/i);
      let title = e.episode;
      if (m) title = `Ep ${m[1]}`;
      return { title, slug: e.slug };
    })
  );
  return {
    ...raw,
    poster: posterFor(slug, raw.poster, map),
    episodeList,
  };
}

export interface DonghuaEpisode {
  streaming?: {
    servers?: { server_id?: string; quality?: string; name?: string }[];
    main_url?: string;
  };
  navigation?: { prev?: string; next?: string };
  [k: string]: unknown;
}

export async function getDonghuaEpisode(slug: string): Promise<DonghuaEpisode | null> {
  return sankaFetch<DonghuaEpisode>(`/episode/${slug}`);
}

// URL embed per server — dipakai player iframe (dipanggil dari browser)
export function serverEmbedUrl(serverId: string): string {
  return `https://www.sankavollerei.web.id/anime/server/${serverId}`;
}
