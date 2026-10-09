import { API_BASE_URL, API_HEADERS } from '@/lib/config';
import { SANKA_SOURCES, fetchSankaItems } from '@/lib/sanka';

export interface UnifiedItem {
  key: string;
  title: string;
  poster: string;
  href: string;
  sources: string[];
  meta: string;
  score: string;
  episodes: string;
}

export function canonicalKey(rawTitle: string): string {
  let title = ` ${rawTitle.toLowerCase()} `;
  let season: string | null = null;

  const seasonPatterns = [
    /\bseason\s*(\d+)\b/,
    /\b(\d+)(?:st|nd|rd|th)\s*season\b/,
    /\bs\s*(\d+)\b/,
  ];

  for (const pattern of seasonPatterns) {
    const match = title.match(pattern);
    if (match) {
      season = match[1];
      title = title.replace(pattern, ' ');
      break;
    }
  }

  const base = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return `${base}|${season || ''}`;
}

interface OwnCatalogItem {
  key?: string;
  title?: string;
  poster?: string;
  type?: string;
  status?: string;
  score?: string;
  episodes?: string;
  sources?: { source?: string; animeId?: string }[];
}

async function fetchOwnLatest(): Promise<UnifiedItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/katalog/terbaru?page=1`, {
      headers: API_HEADERS,
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const json = await response.json();
    const list: OwnCatalogItem[] = json?.data?.animeList || [];
    return list.map((item) => {
      const firstSource = item.sources?.[0];
      return {
        key: item.key || canonicalKey(item.title || ''),
        title: item.title || '',
        poster: item.poster || '',
        href: firstSource?.animeId ? `/anime/${firstSource.animeId}` : '/',
        sources: (item.sources || []).map((s) => s.source || 'sendiri').filter(Boolean),
        meta: item.type || item.status || '',
        score: item.score || '',
        episodes: item.episodes || '',
      };
    }).filter((item) => item.title);
  } catch {
    return [];
  }
}

async function fetchOwnSearch(q: string): Promise<UnifiedItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/katalog/search`);
    url.searchParams.set('q', q);
    url.searchParams.set('page', '1');
    const response = await fetch(url.toString(), { headers: API_HEADERS, cache: 'no-store' });
    if (!response.ok) return [];
    const json = await response.json();
    const list: OwnCatalogItem[] = json?.data?.animeList || [];
    return list.map((item) => {
      const firstSource = item.sources?.[0];
      return {
        key: item.key || canonicalKey(item.title || ''),
        title: item.title || '',
        poster: item.poster || '',
        href: firstSource?.animeId ? `/anime/${firstSource.animeId}` : '/',
        sources: (item.sources || []).map((s) => s.source || 'sendiri').filter(Boolean),
        meta: item.type || item.status || '',
        score: item.score || '',
        episodes: item.episodes || '',
      };
    }).filter((item) => item.title);
  } catch {
    return [];
  }
}

function mergeItems(groups: UnifiedItem[][]): UnifiedItem[] {
  const merged = new Map<string, UnifiedItem>();
  groups.flat().forEach((item) => {
    const key = item.key || canonicalKey(item.title);
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, { ...item, key });
      return;
    }
    const sources = [...new Set([...existing.sources, ...item.sources])];
    merged.set(key, {
      ...existing,
      poster: existing.poster || item.poster,
      href: existing.href.startsWith('/anime/') ? existing.href : item.href,
      sources,
      meta: existing.meta || item.meta,
    });
  });
  return [...merged.values()].slice(0, 48);
}

export async function fetchUnifiedLatest(): Promise<UnifiedItem[]> {
  const [own, winbu, otakudesu] = await Promise.all([
    fetchOwnLatest(),
    fetchSankaItems(SANKA_SOURCES.winbu),
    fetchSankaItems(SANKA_SOURCES.otakudesu),
  ]);

  const external = (items: Awaited<ReturnType<typeof fetchSankaItems>>['items'], source: string): UnifiedItem[] =>
    items.map((item) => ({
      key: canonicalKey(item.title),
      title: item.title,
      poster: item.poster,
      href: `/sumber/${source}?q=${encodeURIComponent(item.title)}`,
      sources: [source],
      meta: item.meta,
      score: '',
      episodes: '',
    }));

  return mergeItems([own, external(winbu.items, 'winbu'), external(otakudesu.items, 'otakudesu')]);
}

export async function fetchUnifiedSearch(q: string): Promise<UnifiedItem[]> {
  const [own, winbu, otakudesu] = await Promise.all([
    fetchOwnSearch(q),
    fetchSankaItems(SANKA_SOURCES.winbu, q),
    fetchSankaItems(SANKA_SOURCES.otakudesu, q),
  ]);

  const external = (items: Awaited<ReturnType<typeof fetchSankaItems>>['items'], source: string): UnifiedItem[] =>
    items.map((item) => ({
      key: canonicalKey(item.title),
      title: item.title,
      poster: item.poster,
      href: `/sumber/${source}?q=${encodeURIComponent(item.title)}`,
      sources: [source],
      meta: item.meta,
      score: '',
      episodes: '',
    }));

  return mergeItems([own, external(winbu.items, 'winbu'), external(otakudesu.items, 'otakudesu')]);
}
