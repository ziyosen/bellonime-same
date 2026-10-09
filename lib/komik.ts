// ============================================================
// KomikService — sumber: Sanka API WestManga (sankavollerei.web.id)
// Fetch LANGSUNG dari BROWSER user (CORS Sanka terbuka *; IP
// datacenter kena Cloudflare challenge). Rate limit Sanka 45
// req/menit (3 warning = ban) — lazy per halaman + cache.
// ============================================================

export const KOMIK_BASE = 'https://www.sankavollerei.web.id/comic/westmanga';

export interface KomikCard {
  title: string;
  slug: string;
  poster?: string;
  chapter?: string;
  rating?: string;
  type?: string;
  [k: string]: unknown;
}

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 jam

function readCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`komik:${key}`);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data as T;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`komik:${key}`, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* kuota penuh — abaikan */
  }
}

// rate-limit guard: jeda minimal antar request (max ~40 req/menit, di bawah limit 45)
const MIN_INTERVAL = 1600; // ms
let lastFetch = 0;
let queue: Promise<void> = Promise.resolve();

function throttle<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const wait = lastFetch + MIN_INTERVAL - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastFetch = Date.now();
  });
  queue = run.then(() => undefined, () => undefined);
  return run.then(fn);
}

export async function komikFetch<T>(path: string): Promise<T | null> {
  const cached = readCache<T>(path);
  if (cached) return cached;
  try {
    const data = await throttle(async () => {
      const res = await fetch(`${KOMIK_BASE}${path}`, { headers: { Accept: 'application/json' } });
      if (!res.ok) return null;
      return (await res.json()) as T;
    });
    if (data) writeCache(path, data);
    return data;
  } catch {
    return null;
  }
}

// --- ambil array kartu dari respons (nama field bervariasi per endpoint) ---
function extractCards(data: Record<string, unknown> | null): KomikCard[] {
  if (!data) return [];
  const lists = Object.values(data).filter((v): v is KomikCard[] => Array.isArray(v));
  const out: KomikCard[] = [];
  for (const list of lists) {
    for (const it of list) {
      if (it && typeof it === 'object' && (it as KomikCard).slug) out.push(it);
    }
  }
  return out;
}

// --- kategori list (semua pagination 1-10) ---
export type KomikCategory =
  | 'list' | 'latest' | 'popular' | 'ongoing' | 'completed'
  | 'manga' | 'manhua' | 'manhwa' | 'az' | 'za'
  | 'added' | 'colored' | 'uncolored' | 'projects' | 'others';

export async function getKomikList(cat: KomikCategory, page = 1): Promise<KomikCard[]> {
  const data = await komikFetch<Record<string, unknown>>(`/${cat}?page=${page}`);
  return extractCards(data);
}

export async function getKomikHome(): Promise<Record<string, unknown> | null> {
  return komikFetch<Record<string, unknown>>('/home');
}

export async function getKomikGenres(): Promise<{ name?: string; id?: string | number }[]> {
  const data = await komikFetch<{ genres?: unknown[] } | unknown[]>('/genres');
  if (!data) return [];
  return (Array.isArray(data) ? data : (data.genres || [])) as { name?: string; id?: string | number }[];
}

export async function getKomikByGenre(id: string | number, page = 1): Promise<KomikCard[]> {
  const data = await komikFetch<Record<string, unknown>>(`/genre/${id}?page=${page}`);
  return extractCards(data);
}

export async function filterKomikGenres(ids: (string | number)[]): Promise<KomikCard[]> {
  const data = await komikFetch<Record<string, unknown>>(`/genres-filter?genre=${ids.join(',')}`);
  return extractCards(data);
}

export async function searchKomik(q: string, page = 1): Promise<KomikCard[]> {
  const data = await komikFetch<Record<string, unknown>>(`/search?q=${encodeURIComponent(q)}&page=${page}`);
  return extractCards(data);
}

// --- detail & baca ---
export interface KomikChapterInfo {
  id?: number;
  number?: string;
  slug?: string;
  updated_at?: { time?: number; formatted?: string };
}

export interface KomikDetail {
  // respons API: { data: { id, title, sinopsis, slug, cover, status, country_id, rating, chapters[] ... } }
  id?: number;
  title?: string;
  slug?: string;
  sinopsis?: string;
  cover?: string;
  rating?: number;
  status?: string;
  country_id?: string;
  chapters?: KomikChapterInfo[];
  [k: string]: unknown;
}

export async function getKomikDetail(slug: string): Promise<KomikDetail | null> {
  const raw = await komikFetch<{ data?: KomikDetail }>(`/detail/${slug}`);
  return raw?.data ?? null;
}

export interface KomikChapter {
  // respons API: { data: { id, number, images: string[], content: {...}, ... } }
  id?: number;
  number?: string;
  images?: string[];
  content?: { title?: string; slug?: string; cover?: string; rating?: number };
  [k: string]: unknown;
}

export async function getKomikChapter(slug: string): Promise<KomikChapter | null> {
  const raw = await komikFetch<{ data?: KomikChapter }>(`/chapter/${slug}`);
  return raw?.data ?? null;
}
