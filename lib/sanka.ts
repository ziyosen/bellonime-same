export const SANKA_BASE = 'https://www.sankavollerei.web.id';

export interface SankaSource {
  slug: string;
  label: string;
  badge: string;
  home: string;
  search?: (q: string) => string;
}

export const SANKA_SOURCES: Record<string, SankaSource> = {
  winbu: {
    slug: 'winbu',
    label: 'Winbu',
    badge: 'Gabung katalog utama',
    home: '/anime/winbu/home',
    search: (q) => `/anime/winbu/search?q=${encodeURIComponent(q)}&page=1`,
  },
  oploverz: {
    slug: 'oploverz',
    label: 'Oploverz',
    badge: 'Gabung katalog utama',
    home: '/anime/oploverz/home?page=1',
    search: (q) => `/anime/oploverz/search/${encodeURIComponent(q)}`,
  },
  otakudesu: {
    slug: 'otakudesu',
    label: 'Otakudesu',
    badge: 'Sumber luar siap pakai',
    home: '/anime/home',
    search: (q) => `/anime/search/${encodeURIComponent(q)}`,
  },
  donghub: {
    slug: 'donghub',
    label: 'Donghua',
    badge: 'Bagian terpisah: Donghua',
    home: '/anime/donghub/home?page=1',
    search: (q) => `/anime/donghub/search/${encodeURIComponent(q)}`,
  },
  nekopoi: {
    slug: 'nekopoi',
    label: 'Hentai nime',
    badge: '18+ bagian terpisah',
    home: '/anime/nekopoi/home',
    search: (q) => `/anime/nekopoi/search?q=${encodeURIComponent(q)}&page=1`,
  },
  westmanga: {
    slug: 'westmanga',
    label: 'Komik — Westmanga',
    badge: 'Baca komik',
    home: '/comic/westmanga/latest',
    search: (q) => `/comic/westmanga/search/${encodeURIComponent(q)}`,
  },
  bacakomik: {
    slug: 'bacakomik',
    label: 'Komik — BacaKomik',
    badge: 'Baca komik',
    home: '/comic/bacakomik/latest',
    search: (q) => `/comic/bacakomik/search/${encodeURIComponent(q)}`,
  },
  mangasusuku: {
    slug: 'mangasusuku',
    label: 'Komik 18+ — Mangasusuku',
    badge: 'Koleksi 18+ terpisah',
    home: '/comic/mangasusuku/home/1',
    search: (q) => `/comic/mangasusuku/search/${encodeURIComponent(q)}/1`,
  },
  novel: {
    slug: 'novel',
    label: 'Novel',
    badge: 'Baca novel',
    home: '/novel/home',
    search: (q) => `/novel/search?q=${encodeURIComponent(q)}`,
  },
  sakuranovel: {
    slug: 'sakuranovel',
    label: 'SakuraNovel',
    badge: 'Baca novel',
    home: '/novel/sakuranovel/home',
    search: (q) => `/novel/sakuranovel/search?q=${encodeURIComponent(q)}`,
  },
  alqanime: { slug: 'alqanime', label: 'Alqanime', badge: 'Anime tambahan', home: '/anime/alqanime/home', search: (q) => `/anime/alqanime/search/${encodeURIComponent(q)}` },
  animasu: { slug: 'animasu', label: 'Animasu', badge: 'Anime tambahan', home: '/anime/animasu/home', search: (q) => `/anime/animasu/search/${encodeURIComponent(q)}` },
  animekompi: { slug: 'animekompi', label: 'Animekompi', badge: 'Anime tambahan', home: '/anime/animekompi/home', search: (q) => `/anime/animekompi/search?q=${encodeURIComponent(q)}` },
  animekuindo: { slug: 'animekuindo', label: 'Animekuindo', badge: 'Anime tambahan', home: '/anime/animekuindo/home', search: (q) => `/anime/animekuindo/search/${encodeURIComponent(q)}` },
  anoboy: { slug: 'anoboy', label: 'Anoboy', badge: 'Anime tambahan', home: '/anime/anoboy/home', search: (q) => `/anime/anoboy/search/${encodeURIComponent(q)}` },
  donghua: { slug: 'donghua', label: 'Donghua (Sanka)', badge: 'Bagian terpisah: Donghua', home: '/anime/donghua/home/1', search: (q) => `/anime/donghua/search/${encodeURIComponent(q)}/1` },
  kura: { slug: 'kura', label: 'Kuramanime (Sanka)', badge: 'Anime tambahan', home: '/anime/kura/home', search: (q) => `/anime/kura/search/${encodeURIComponent(q)}` },
  kusonime: { slug: 'kusonime', label: 'Kusonime', badge: 'Anime tambahan', home: '/anime/kusonime/latest', search: (q) => `/anime/kusonime/search/${encodeURIComponent(q)}` },
  nimegami: { slug: 'nimegami', label: 'Nimegami', badge: 'Anime tambahan', home: '/anime/nimegami/home', search: (q) => `/anime/nimegami/search/${encodeURIComponent(q)}` },
  stream: { slug: 'stream', label: 'Stream', badge: 'Anime tambahan', home: '/anime/stream/popular', search: (q) => `/anime/stream/search/${encodeURIComponent(q)}` },
  comic: { slug: 'comic', label: 'Komik Gabungan', badge: 'Baca komik', home: '/comic/homepage', search: (q) => `/comic/search?q=${encodeURIComponent(q)}` },
  kiryuu: { slug: 'kiryuu', label: 'Komik — Kiryuu', badge: 'Baca komik', home: '/comic/kiryuu/home', search: (q) => `/comic/kiryuu/search/${encodeURIComponent(q)}/1` },
  komikindo: { slug: 'komikindo', label: 'Komik — Komikindo', badge: 'Baca komik', home: '/comic/komikindo/list', search: (q) => `/comic/komikindo/search/${encodeURIComponent(q)}/1` },
  komikstation: { slug: 'komikstation', label: 'Komik — Komikstation', badge: 'Baca komik', home: '/comic/komikstation/home', search: (q) => `/comic/komikstation/search/${encodeURIComponent(q)}/1` },
  maid: { slug: 'maid', label: 'Komik — Maid', badge: 'Baca komik', home: '/comic/maid/api' },
  mangakita: { slug: 'mangakita', label: 'Komik — Mangakita', badge: 'Baca komik', home: '/comic/mangakita/home', search: (q) => `/comic/mangakita/search/${encodeURIComponent(q)}/1` },
  meganei: { slug: 'meganei', label: 'Komik — Meganei', badge: 'Baca komik', home: '/comic/meganei/home/1', search: (q) => `/comic/meganei/search/${encodeURIComponent(q)}` },
  shinigami: { slug: 'shinigami', label: 'Komik — Shinigami', badge: 'Baca komik', home: '/comic/shinigami/home', search: (q) => `/comic/shinigami/search/${encodeURIComponent(q)}` },
  softkomik: { slug: 'softkomik', label: 'Komik — Softkomik', badge: 'Baca komik', home: '/comic/softkomik/home', search: (q) => `/comic/softkomik/search?q=${encodeURIComponent(q)}` },

};

export interface SankaItem {
  title: string;
  poster: string;
  id: string;
  meta: string;
}

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return '';
}

function collect(value: unknown, out: SankaItem[], seen: Set<string>) {
  if (!value || out.length >= 60) return;
  if (Array.isArray(value)) {
    value.forEach((item) => collect(item, out, seen));
    return;
  }
  if (typeof value !== 'object') return;

  const obj = value as Record<string, unknown>;
  const id = pickString(obj, ['slug', 'id', 'animeId', 'comicId', 'novelId']);
  const chapterNumber = pickString(obj, ['number', 'chapter', 'episode']);
  const title =
    pickString(obj, ['title', 'name', 'judul']) ||
    (id && chapterNumber ? `Chapter ${chapterNumber}` : '') ||
    (id ? id.replace(/[-_]+/g, ' ').trim() : '');
  const poster = pickString(obj, ['poster', 'image', 'cover', 'thumbnail', 'img']);

  if (title && id) {
    const key = `${title}|${id}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({
        title,
        id,
        poster,
        meta: pickString(obj, ['type', 'status', 'episode', 'episodes', 'chapter', 'rating', 'score']),
      });
    }
  }

  Object.values(obj).forEach((child) => collect(child, out, seen));
}

export async function fetchSankaItems(source: SankaSource, q = ''): Promise<{ items: SankaItem[]; message: string }> {
  const path = q && source.search ? source.search(q) : source.home;
  try {
    const response = await fetch(`${SANKA_BASE}${path}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 300 }, // cache 5 menit — balik ke home instan (klaim review Muse, sebelumnya masih no-store)
      signal: AbortSignal.timeout(3000), // fail fast: sumber luar dari IP datacenter sering CF-blocked & ngantung lama
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json) {
      return { items: [], message: `Sumber menjawab ${response.status}` };
    }
    const items: SankaItem[] = [];
    collect(json, items, new Set<string>());
    return {
      items,
      message: items.length ? '' : 'Belum ada data yang bisa ditampilkan dari sumber ini.',
    };
  } catch {
    return { items: [], message: 'Sumber luar sedang tidak terjangkau.' };
  }
}

export interface SankaDetail {
  title: string;
  poster: string;
  paragraphs: string[];
  links: { label: string; url: string }[];
  items: SankaItem[];
  images: string[];
  endpoint: string;
}

function collectDetail(value: unknown, detail: SankaDetail, seenText: Set<string>) {
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach((item) => collectDetail(item, detail, seenText));
    return;
  }
  if (typeof value === 'string') {
    const text = value.trim();
    if (/^https?:\/\/\S+\.(?:jpe?g|png|webp)(?:\?\S*)?$/i.test(text) && !detail.images.includes(text)) {
      detail.images.push(text);
    }
    if (text.length > 80 && !seenText.has(text)) {
      seenText.add(text);
      detail.paragraphs.push(text);
    }
    return;
  }
  if (typeof value !== 'object') return;

  const obj = value as Record<string, unknown>;
  if (!detail.title) detail.title = pickString(obj, ['title', 'name', 'judul']);
  if (!detail.poster) detail.poster = pickString(obj, ['poster', 'image', 'cover', 'thumbnail', 'img']);

  Object.entries(obj).forEach(([key, child]) => {
    if (typeof child === 'string' && /^https?:\/\//.test(child) && detail.links.length < 30) {
      if (!detail.links.some((link) => link.url === child)) detail.links.push({ label: key, url: child });
    }
    collectDetail(child, detail, seenText);
  });
}

function detailCandidates(source: SankaSource, id: string): string[] {
  const encoded = encodeURIComponent(id);
  const parts = source.home.split('/').filter(Boolean);
  const root = parts[0] || '';
  const prefix = parts[1] || '';

  if (root === 'anime') {
    if (!prefix || ['home', 'search', 'anime', 'episode', 'genre'].includes(prefix)) {
      return [`/anime/anime/${encoded}`, `/anime/episode/${encoded}`, `/anime/batch/${encoded}`];
    }
    return [
      `/anime/${prefix}/detail/${encoded}`,
      `/anime/${prefix}/anime/${encoded}`,
      `/anime/${prefix}/episode/${encoded}`,
      `/anime/${prefix}/watch/${encoded}`,
    ];
  }

  if (root === 'comic') {
    if (!prefix || ['search', 'comic', 'chapter'].includes(prefix)) {
      return [`/comic/comic/${encoded}`, `/comic/chapter/${encoded}`];
    }
    if (/chapter/i.test(id)) {
      return [
        `/comic/${prefix}/chapter/${encoded}`,
        `/comic/${prefix}/detail/${encoded}`,
        `/comic/${prefix}/manga/${encoded}`,
        `/comic/${prefix}/info/${encoded}`,
      ];
    }
    return [
      `/comic/${prefix}/detail/${encoded}`,
      `/comic/${prefix}/manga/${encoded}`,
      `/comic/${prefix}/chapter/${encoded}`,
      `/comic/${prefix}/info/${encoded}`,
    ];
  }

  if (root === 'novel') {
    if (prefix === 'sakuranovel') {
      return [`/novel/sakuranovel/detail/${encoded}`, `/novel/sakuranovel/read/${encoded}`];
    }
    return [`/novel/chapters/${encoded}`, `/novel/genre/${encoded}`];
  }

  return [];
}

export async function fetchSankaDetail(source: SankaSource, id: string): Promise<SankaDetail | null> {
  for (const path of detailCandidates(source, id)) {
    try {
      const response = await fetch(`${SANKA_BASE}${path}`, {
        headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store',
      });
      if (!response.ok) continue;
      const json = await response.json().catch(() => null);
      if (!json) continue;
      const collected: SankaItem[] = [];
      collect(json, collected, new Set<string>());
      const chapterItems = collected.filter((item) => /chapter|episode/i.test(`${item.id} ${item.title} ${item.meta}`));
      const items = chapterItems.length ? chapterItems : collected;
      const detail: SankaDetail = { title: '', poster: '', paragraphs: [], links: [], items, images: [], endpoint: path };
      collectDetail(json, detail, new Set<string>());
      if (detail.title || detail.poster || detail.paragraphs.length || items.length) return detail;
    } catch {
      continue;
    }
  }
  return null;
}
