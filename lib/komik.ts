// lib/komik.ts — data layer komik WestManga (Sanka API, prefix /comic/westmanga)
// Catatan: Sanka memblokir IP datacenter via Cloudflare — fetch idealnya client-side
// dari browser user (CORS terbuka *). Modul ini aman dipakai di client component.
import { SANKA_BASE } from './donghua';

export interface KomikChapterRef {
  number: string;
  slug: string;
  updated?: string;
}

export interface KomikCard {
  title: string;
  slug: string;
  cover: string;
  status: string;
  country: string;
  rating?: string;
  hot: boolean;
  colored: boolean;
  lastChapters: KomikChapterRef[];
}

export interface KomikDetail {
  title: string;
  alternativeTitle?: string;
  slug: string;
  cover: string;
  synopsis?: string;
  author?: string;
  status: string;
  country: string;
  rating?: string;
  totalViews?: number;
  hot: boolean;
  colored: boolean;
  genres: { id: number; name: string }[];
  chapters: KomikChapterRef[];
}

export interface KomikGenre {
  id: number;
  name: string;
  slug: string;
}

export interface KomikPage {
  cards: KomikCard[];
  currentPage: number;
  lastPage: number;
}

export type KomikListKind =
  | 'list' | 'latest' | 'popular' | 'ongoing' | 'completed'
  | 'manga' | 'manhua' | 'manhwa' | 'az' | 'za'
  | 'added' | 'colored' | 'uncolored' | 'projects' | 'others';

const jsonCache = new Map<string, { at: number; promise: Promise<unknown> }>();

async function fetchJson(path: string) {
  const cached = jsonCache.get(path);
  if (cached && Date.now() - cached.at < 60_000) return cached.promise;
  const promise = (async () => {
    const res = await fetch(`${SANKA_BASE}${path}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Sumber menjawab ${res.status}`);
    return res.json();
  })();
  jsonCache.set(path, { at: Date.now(), promise });
  promise.catch(() => jsonCache.delete(path));
  return promise;
}

function toChapterRef(ch: Record<string, unknown>): KomikChapterRef {
  const updatedAt = ch.updated_at as { formatted?: string } | undefined;
  return {
    number: String(ch.number ?? ''),
    slug: String(ch.slug ?? ''),
    updated: updatedAt?.formatted,
  };
}

function toCard(item: Record<string, unknown>): KomikCard {
  const raw = (item as Record<string, unknown>).content as Record<string, unknown> | undefined;
  const it = raw ?? item;
  const lastChapters = (it.lastChapters || []) as Record<string, unknown>[];
  return {
    title: String(it.title ?? ''),
    slug: String(it.slug ?? ''),
    cover: String(it.cover ?? ''),
    status: String(it.status ?? ''),
    country: String(it.country_id ?? ''),
    rating: it.rating != null ? String(it.rating) : undefined,
    hot: Boolean(it.hot),
    colored: Boolean(it.color),
    lastChapters: lastChapters.map(toChapterRef),
  };
}

function sortChapters(chapters: KomikChapterRef[]): KomikChapterRef[] {
  // sort NUMERIK dari number (bisa "12.1", "1195") — API datang ACAK urutannya
  return [...chapters].sort(
    (a, b) => (parseFloat(a.number) || 0) - (parseFloat(b.number) || 0),
  );
}

function dedupeCards(cards: KomikCard[]): KomikCard[] {
  const seen = new Map<string, KomikCard>();
  for (const card of cards) {
    if (!card.slug) continue;
    if (!seen.has(card.slug)) seen.set(card.slug, card);
  }
  return [...seen.values()];
}

export async function fetchKomikList(kind: KomikListKind, page = 1): Promise<KomikPage> {
  const suffix = kind === 'list' || kind === 'others' || kind === 'projects' || kind === 'uncolored' || kind === 'added' || kind === 'colored' || kind === 'az' || kind === 'za'
    ? (page > 1 ? `?page=${page}` : '')
    : `?page=${page}`;
  const data = (await fetchJson(`/comic/westmanga/${kind}${suffix}`)) as Record<string, unknown>;
  const list = ((data.data || data.results || []) as Record<string, unknown>[]).map(toCard);
  const pagination = (data.pagination || {}) as Record<string, unknown>;
  return {
    cards: dedupeCards(list),
    currentPage: Number(pagination.current_page ?? page),
    lastPage: Number(pagination.last_page ?? 1),
  };
}

export async function fetchKomikHome() {
  const data = (await fetchJson('/comic/westmanga/home')) as Record<string, unknown>;
  const d = (data.data || {}) as Record<string, unknown>;
  const pick = (keys: string[]) => {
    for (const k of keys) {
      if (Array.isArray(d[k])) return (d[k] as Record<string, unknown>[]).map(toCard);
    }
    return [];
  };
  return {
    mirrorUpdate: dedupeCards(pick(['mirror_update', 'latest_update', 'latest'])),
    popular: dedupeCards(pick(['popular', 'popular_comic'])),
    completed: dedupeCards(pick(['completed', 'completed_comic'])),
    hot: dedupeCards(pick(['hot', 'hot_comic'])),
  };
}

export async function fetchKomikDetail(slug: string): Promise<KomikDetail> {
  const data = (await fetchJson(`/comic/westmanga/detail/${slug}`)) as Record<string, unknown>;
  const d = (data.data || {}) as Record<string, unknown>;
  const genres = (d.genres || []) as Record<string, unknown>[];
  const chapters = (d.chapters || []) as Record<string, unknown>[];
  return {
    title: String(d.title ?? ''),
    alternativeTitle: String(d.alternative_name ?? '') || undefined,
    slug: String(d.slug ?? slug),
    cover: String(d.cover ?? ''),
    synopsis: String(d.sinopsis ?? '') || undefined,
    author: String(d.author ?? '') || undefined,
    status: String(d.status ?? ''),
    country: String(d.country_id ?? ''),
    rating: d.rating != null ? String(d.rating) : undefined,
    totalViews: Number(d.total_views ?? 0),
    hot: Boolean(d.hot),
    colored: Boolean(d.color),
    genres: genres.map((g) => ({ id: Number(g.id), name: String(g.name) })),
    chapters: sortChapters(chapters.map(toChapterRef)),
  };
}

export async function fetchKomikChapter(slug: string): Promise<{ title: string; number: string; images: string[]; contentTitle: string; contentSlug: string; chapters: KomikChapterRef[] }> {
  const data = (await fetchJson(`/comic/westmanga/chapter/${slug}`)) as Record<string, unknown>;
  const d = (data.data || {}) as Record<string, unknown>;
  const content = (d.content || {}) as Record<string, unknown>;
  const chapters = (d.chapters || []) as Record<string, unknown>[];
  return {
    title: String(d.title ?? ''),
    number: String(d.number ?? ''),
    images: ((d.images || []) as unknown[]).map((u) => String(u)),
    contentTitle: String(content.title ?? ''),
    contentSlug: String(content.slug ?? ''),
    chapters: sortChapters(chapters.map(toChapterRef)),
  };
}

export async function fetchKomikGenres(): Promise<KomikGenre[]> {
  const data = (await fetchJson('/comic/westmanga/genres')) as Record<string, unknown>;
  return ((data.data || []) as Record<string, unknown>[]).map((g) => ({
    id: Number(g.id),
    name: String(g.name),
    slug: String(g.slug),
  }));
}

export async function fetchKomikSearch(q: string): Promise<KomikCard[]> {
  const data = (await fetchJson(`/comic/westmanga/search?q=${encodeURIComponent(q)}`)) as Record<string, unknown>;
  return dedupeCards(((data.data || []) as Record<string, unknown>[]).map(toCard));
}

export async function fetchKomikGenreFilter(ids: string, page = 1): Promise<KomikPage> {
  const data = (await fetchJson(`/comic/westmanga/genres-filter?ids=${encodeURIComponent(ids)}&page=${page}`)) as Record<string, unknown>;
  const list = ((data.data || []) as Record<string, unknown>[]).map(toCard);
  const pagination = (data.pagination || {}) as Record<string, unknown>;
  return {
    cards: dedupeCards(list),
    currentPage: Number(pagination.current_page ?? page),
    lastPage: Number(pagination.last_page ?? 1),
  };
}
