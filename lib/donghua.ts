export const SANKA_BASE = 'https://www.sankavollerei.web.id';

export interface DonghuaCard {
  title: string;
  slug: string;
  poster: string;
  status: string;
  type: string;
  episodeLabel: string;
}

export interface DonghuaEpisodeItem {
  episode: string;
  episode_number?: string;
  slug: string;
  release_date?: string;
}

export interface DonghuaDetail {
  title: string;
  alter_title?: string;
  poster: string;
  rating?: string;
  status?: string;
  studio?: string;
  released?: string;
  duration?: string;
  type?: string;
  episodes_count?: number;
  synopsis?: string;
  genres?: { name: string; slug: string }[];
  episodes_list?: DonghuaEpisodeItem[];
}

export interface DonghuaEpisode {
  episode: string;
  streaming?: {
    main_url?: { name: string; url: string };
    servers?: { name: string; url: string }[];
  };
  navigation?: {
    all_episodes?: { slug: string };
    previous_episode?: { slug: string; episode?: string } | null;
    next_episode?: { slug: string; episode?: string } | null;
  };
  episodes_list?: { episode: string; slug: string }[];
}

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

export function seriesSlugFrom(rawSlug: string): string {
  return (rawSlug || '').replace(/-episode-\d+.*$/i, '');
}

export function cleanSeriesTitle(rawTitle: string): string {
  return (rawTitle || '')
    .replace(/\s+Episode\s+\d+.*$/i, '')
    .replace(/\s+Subtitle Indonesia.*$/i, '')
    .trim();
}

function episodeLabelFrom(rawTitle: string, rawSlug: string): string {
  const fromSlug = (rawSlug || '').match(/episode-(\d+)/i);
  if (fromSlug) return `Ep ${fromSlug[1]}`;
  const fromTitle = (rawTitle || '').match(/Episode\s+(\d+)/i);
  return fromTitle ? `Ep ${fromTitle[1]}` : '';
}

function toCard(item: Record<string, unknown>): DonghuaCard {
  const rawSlug = String(item.slug || '');
  const rawTitle = String(item.title || item.episode || '');
  return {
    title: cleanSeriesTitle(rawTitle) || rawTitle,
    slug: seriesSlugFrom(rawSlug),
    poster: String(item.poster || item.image || ''),
    status: String(item.status || ''),
    type: String(item.type || 'Donghua'),
    episodeLabel: episodeLabelFrom(rawTitle, rawSlug),
  };
}

function dedupeCards(cards: DonghuaCard[]): DonghuaCard[] {
  const seen = new Map<string, DonghuaCard>();
  for (const card of cards) {
    if (!card.slug) continue;
    if (!seen.has(card.slug)) seen.set(card.slug, card);
  }
  return [...seen.values()];
}

export async function fetchDonghuaHome(page = 1) {
  const data = await fetchJson(`/anime/donghua/home/${page}`);
  return {
    latest: dedupeCards(((data.latest_release || []) as Record<string, unknown>[]).map(toCard)),
    completed: dedupeCards(((data.completed_donghua || []) as Record<string, unknown>[]).map(toCard)),
  };
}

export async function fetchDonghuaList(kind: 'latest' | 'ongoing' | 'completed', page = 1): Promise<DonghuaCard[]> {
  const data = await fetchJson(`/anime/donghua/${kind}/${page}`);
  const list = (data.data ||
    data.latest_donghua ||
    data.ongoing_donghua ||
    data.completed_donghua ||
    data.latest_release ||
    data.results ||
    []) as Record<string, unknown>[];
  return dedupeCards(list.map(toCard));
}

export async function fetchDonghuaListCached(
  kind: 'latest' | 'ongoing' | 'completed',
  page = 1,
): Promise<DonghuaCard[]> {
  const key = `donghua-list-${kind}-${page}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as { at: number; items: DonghuaCard[] };
      if (Date.now() - parsed.at < 6 * 60 * 60 * 1000) return parsed.items;
    }
  } catch {
    // abaikan cache rusak
  }
  const items = await fetchDonghuaList(kind, page);
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), items }));
  } catch {
    // penyimpanan penuh, abaikan
  }
  return items;
}

export async function fetchDonghuaCompletedPages(pages = 10): Promise<DonghuaCard[]> {
  const all: DonghuaCard[] = [];
  const batchSize = 3;
  for (let start = 1; start <= pages; start += batchSize) {
    const batch: Promise<DonghuaCard[]>[] = [];
    for (let p = start; p < start + batchSize && p <= pages; p++) {
      batch.push(fetchDonghuaList('completed', p).catch(() => []));
    }
    const results = await Promise.all(batch);
    for (const r of results) all.push(...r);
    if (results.every((r) => r.length === 0)) break;
  }
  return dedupeCards(all);
}

export async function fetchDonghuaGenres(): Promise<{ name: string; slug: string }[]> {
  const data = await fetchJson('/anime/donghua/genres');
  const list = (data.data || []) as { name: string; slug: string }[];
  const seen = new Set<string>();
  return list.filter((g) => {
    if (!g.slug || !g.name || g.name.trim().length <= 2) return false;
    const key = g.name.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchDonghuaGenre(slug: string, page = 1): Promise<DonghuaCard[]> {
  const data = await fetchJson(`/anime/donghua/genres/${encodeURIComponent(slug)}/${page}`);
  const list = (data.data || []) as Record<string, unknown>[];
  return dedupeCards(list.map(toCard));
}

export async function fetchDonghuaSchedule(): Promise<{ day: string; list: DonghuaCard[] }[]> {
  const data = await fetchJson('/anime/donghua/schedule');
  const days = (data.schedule || []) as { day: string; donghua_list?: Record<string, unknown>[] }[];
  return days.map((d) => ({
    day: d.day,
    list: dedupeCards((d.donghua_list || []).map(toCard)),
  }));
}

export async function fetchDonghuaSearch(keyword: string, page = 1): Promise<DonghuaCard[]> {
  const data = (await fetchJson(`/anime/donghua/search/${encodeURIComponent(keyword)}/${page}`)) as {
    data?: Record<string, unknown>[];
  };
  return dedupeCards(((data.data || []) as Record<string, unknown>[]).map(toCard));
}

export async function fetchDonghuaAz(letter: string, page = 1): Promise<DonghuaCard[]> {
  const data = (await fetchJson(`/anime/donghua/az-list/${encodeURIComponent(letter)}/${page}`)) as {
    donghua_list?: Record<string, unknown>[];
  };
  return dedupeCards(((data.donghua_list || []) as Record<string, unknown>[]).map(toCard));
}

export async function fetchDonghuaSeason(year: string): Promise<DonghuaCard[]> {
  const data = (await fetchJson(`/anime/donghua/seasons/${encodeURIComponent(year)}`)) as {
    data?: Record<string, unknown>[];
  };
  return dedupeCards(((data.data || []) as Record<string, unknown>[]).map(toCard));
}

export async function fetchDonghuaDetail(slug: string): Promise<DonghuaDetail> {
  return fetchJson(`/anime/donghua/detail/${encodeURIComponent(slug)}`);
}

export async function fetchDonghuaEpisode(slug: string): Promise<DonghuaEpisode> {
  return fetchJson(`/anime/donghua/episode/${encodeURIComponent(slug)}`);
}
