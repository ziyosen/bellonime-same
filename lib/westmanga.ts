const SANKA_BASE = 'https://www.sankavollerei.web.id';
const WEST = `${SANKA_BASE}/comic/westmanga`;

export type WestChapterRef = {
  id?: number | string;
  number?: number | string;
  slug?: string;
  title?: string;
  updated_at?: { formatted?: string; time?: number } | string;
};

export type WestCard = {
  title: string;
  slug: string;
  cover: string;
  rating?: number | string;
  status?: string;
  type?: string;
  countryId?: string;
  totalViews?: number;
  color?: boolean;
  hot?: boolean;
  lastChapters?: WestChapterRef[];
};

export type WestGenre = { id: number | string; name: string; slug?: string };

export type WestDetail = {
  title: string;
  slug: string;
  cover: string;
  sinopsis?: string;
  alternativeName?: string;
  author?: string;
  status?: string;
  rating?: number | string;
  totalViews?: number;
  countryId?: string;
  genres: WestGenre[];
  chapters: WestChapterRef[];
};

const cache = new Map<string, { at: number; data: unknown }>();

async function fetchJson<T>(url: string): Promise<T> {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < 60_000) return hit.data as T;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Sumber menjawab ${res.status}`);
  const data = (await res.json()) as T;
  cache.set(url, { at: Date.now(), data });
  return data;
}

type RawCard = Record<string, unknown>;

function toCard(raw: RawCard): WestCard | null {
  const slug = String(raw.slug || '');
  const title = String(raw.title || '');
  if (!slug || !title) return null;
  const chaptersRaw = Array.isArray(raw.lastChapters) ? (raw.lastChapters as RawCard[]) : [];
  return {
    title,
    slug,
    cover: String(raw.cover || raw.poster || raw.image || ''),
    rating: (raw.rating as number | string | undefined) ?? undefined,
    status: raw.status ? String(raw.status) : undefined,
    type: raw.content_type ? String(raw.content_type) : undefined,
    countryId: raw.country_id ? String(raw.country_id) : undefined,
    totalViews: typeof raw.total_views === 'number' ? raw.total_views : undefined,
    color: raw.color === true,
    hot: raw.hot === true,
    lastChapters: chaptersRaw.map((c) => ({
      id: c.id as number | string | undefined,
      number: c.number as number | string | undefined,
      slug: c.slug ? String(c.slug) : undefined,
      title: c.title ? String(c.title) : undefined,
      updated_at: c.updated_at as WestChapterRef['updated_at'],
    })),
  };
}

function toCards(list: unknown): WestCard[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const out: WestCard[] = [];
  for (const item of list) {
    const card = toCard(item as RawCard);
    if (card && !seen.has(card.slug)) {
      seen.add(card.slug);
      out.push(card);
    }
  }
  return out;
}

export type WestHome = {
  mirrorUpdate: WestCard[];
  newProject: WestCard[];
  popular: WestCard[];
  projectUpdate: WestCard[];
};

export async function fetchWestHome(): Promise<WestHome> {
  const json = await fetchJson<{ data?: Record<string, unknown> }>(`${WEST}/home`);
  const d = json.data || {};
  return {
    mirrorUpdate: toCards(d.mirror_update),
    newProject: toCards(d.new_project),
    popular: toCards(d.popular),
    projectUpdate: toCards(d.project_update),
  };
}

export const WEST_CATEGORIES: { kind: string; label: string }[] = [
  { kind: 'latest', label: 'Terbaru' },
  { kind: 'list', label: 'Semua Komik' },
  { kind: 'popular', label: 'Populer' },
  { kind: 'ongoing', label: 'Sedang Berjalan' },
  { kind: 'completed', label: 'Tamat' },
  { kind: 'manga', label: 'Manga' },
  { kind: 'manhua', label: 'Manhua' },
  { kind: 'manhwa', label: 'Manhwa' },
  { kind: 'projects', label: 'Project' },
  { kind: 'others', label: 'Lainnya' },
  { kind: 'colored', label: 'Berwarna' },
  { kind: 'uncolored', label: 'Hitam Putih' },
  { kind: 'added', label: 'Baru Ditambahkan' },
  { kind: 'az', label: 'A-Z' },
  { kind: 'za', label: 'Z-A' },
];

export function westCategoryLabel(kind: string): string {
  return WEST_CATEGORIES.find((c) => c.kind === kind)?.label || kind;
}

export async function fetchWestList(kind: string, page = 1): Promise<WestCard[]> {
  const json = await fetchJson<{ data?: unknown }>(`${WEST}/${kind}?page=${page}`);
  return toCards(json.data);
}

export async function fetchWestGenres(): Promise<WestGenre[]> {
  const json = await fetchJson<{ data?: unknown }>(`${WEST}/genres`);
  if (!Array.isArray(json.data)) return [];
  return (json.data as RawCard[])
    .map((g) => ({
      id: (g.id as number | string) ?? '',
      name: String(g.name || ''),
      slug: g.slug ? String(g.slug) : undefined,
    }))
    .filter((g) => g.name);
}

export async function fetchWestGenre(genreId: string, page = 1): Promise<WestCard[]> {
  const json = await fetchJson<{ data?: unknown }>(`${WEST}/genre/${encodeURIComponent(genreId)}?page=${page}`);
  return toCards(json.data);
}

export async function fetchWestSearch(q: string, page = 1): Promise<WestCard[]> {
  const json = await fetchJson<{ data?: unknown }>(
    `${WEST}/search?q=${encodeURIComponent(q)}&page=${page}`,
  );
  return toCards(json.data);
}

function cleanHtmlText(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const text = String(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&#x27;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return text || undefined;
}

export async function fetchWestDetail(slug: string): Promise<WestDetail> {
  const json = await fetchJson<{ data?: RawCard }>(`${WEST}/detail/${encodeURIComponent(slug)}`);
  const d = json.data || {};
  const genresRaw = Array.isArray(d.genres) ? (d.genres as RawCard[]) : [];
  const chaptersRaw = Array.isArray(d.chapters) ? (d.chapters as RawCard[]) : [];
  return {
    title: String(d.title || slug),
    slug: String(d.slug || slug),
    cover: String(d.cover || ''),
    sinopsis: cleanHtmlText(d.sinopsis),
    alternativeName: d.alternative_name ? String(d.alternative_name) : undefined,
    author: d.author ? String(d.author) : undefined,
    status: d.status ? String(d.status) : undefined,
    rating: (d.rating as number | string | undefined) ?? undefined,
    totalViews: typeof d.total_views === 'number' ? d.total_views : undefined,
    countryId: d.country_id ? String(d.country_id) : undefined,
    genres: genresRaw.map((g) => ({
      id: (g.id as number | string) ?? '',
      name: String(g.name || ''),
      slug: g.slug ? String(g.slug) : undefined,
    })),
    chapters: chaptersRaw.map((c) => ({
      id: c.id as number | string | undefined,
      number: c.number as number | string | undefined,
      slug: c.slug ? String(c.slug) : undefined,
      title: c.title ? String(c.title) : undefined,
      updated_at: c.updated_at as WestChapterRef['updated_at'],
    })),
  };
}

export type WestChapter = {
  number?: number | string;
  title?: string;
  seriesTitle?: string;
  images: string[];
};

export async function fetchWestChapter(slug: string): Promise<WestChapter> {
  const json = await fetchJson<{ data?: RawCard }>(`${WEST}/chapter/${encodeURIComponent(slug)}`);
  const d = json.data || {};
  const content = (d.content as RawCard | undefined) || {};
  const images = Array.isArray(d.images) ? (d.images as unknown[]).map(String) : [];
  return {
    number: d.number as number | string | undefined,
    title: content.title ? String(content.title) : undefined,
    seriesTitle: content.title ? String(content.title) : undefined,
    images,
  };
}

export function chapterUpdatedLabel(ch?: WestChapterRef): string {
  if (!ch?.updated_at) return '';
  if (typeof ch.updated_at !== 'string' && typeof ch.updated_at?.time === 'number') {
    const diff = Math.max(0, Math.floor(Date.now() / 1000) - ch.updated_at.time);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} mnt`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} minggu`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} bln`;
    return `${Math.floor(diff / 31536000)} thn`;
  }
  if (typeof ch.updated_at === 'string') return ch.updated_at;
  const formatted = ch.updated_at.formatted || '';
  return formatted.replace(/\s+\d{2}:\d{2}$/, '').replace(/(\d{1,2} \w{3}) \d{4}/, '$1');
}
