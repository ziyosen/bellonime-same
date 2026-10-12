import { API_BASE_URL, API_HEADERS } from '@/lib/config';
import type { ApiResponse, Movies } from '@/types/anime';

// Movie list gabungan (UNION, dedup, tampil sebagai satu list tanpa label sumber):
// 1. WAJIK /samehadaku/movies — hanya judul Slime/Rimuru (arah bos)
// 2. SANKA /anime/samehadaku/movies — semua (2 halaman, page 3 = 500/habis)
// Detail/episode movie Sanka-only difallback ke API Sanka oleh AnimeDetailService/EpisodeService.

const SANKA_BASE = 'https://www.sankavollerei.web.id/anime/samehadaku';
const SANKA_PAGES = 2;

type RawMovie = {
  title?: string;
  poster?: string;
  type?: string;
  score?: string;
  status?: string;
  animeId?: string;
  href?: string;
  samehadakuUrl?: string;
  genreList?: unknown;
};

function normTitle(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function normalizeMovie(m: RawMovie) {
  return {
    title: m.title || '',
    poster: m.poster || '',
    type: m.type || 'Movie',
    score: m.score || '',
    status: m.status || '',
    animeId: m.animeId || '',
    href: `/anime/${m.animeId}`,
    samehadakuUrl: m.samehadakuUrl || '',
    genreList: m.genreList || [],
  };
}

async function fetchWajikMovies(): Promise<RawMovie[]> {
  try {
    const r = await fetch(`${API_BASE_URL}/samehadaku/movies?_=${Date.now()}`, {
      headers: API_HEADERS,
      next: { revalidate: 3600 },
    });
    if (!r.ok) return [];
    const list = (await r.json())?.data?.animeList || [];
    return list.filter((x: { title?: string; animeId?: string }) => {
      const t = `${x.title || ''} ${x.animeId || ''}`.toLowerCase();
      return t.includes('slime') || t.includes('rimuru');
    });
  } catch {
    return [];
  }
}

async function fetchSankaMovies(): Promise<RawMovie[]> {
  const results = await Promise.allSettled(
    Array.from({ length: SANKA_PAGES }, (_, i) =>
      fetch(`${SANKA_BASE}/movies?page=${i + 1}&_=${Date.now()}`, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      }).then((r) => (r.ok ? r.json() : { data: { animeList: [] } })),
    ),
  );
  return results.flatMap((s) => (s.status === 'fulfilled' ? s.value?.data?.animeList || [] : []));
}

export async function getUnionMovies(): Promise<ApiResponse<Movies>> {
  const [wajik, sanka] = await Promise.all([fetchWajikMovies(), fetchSankaMovies()]);
  const all = [...wajik, ...sanka];

  const seen = new Set<string>();
  const animeList = all
    .filter((m: RawMovie) => m?.title && m?.animeId)
    .filter((m: RawMovie) => {
      const key = (m.animeId || '').toLowerCase();
      const norm = normTitle(m.title || '');
      if (!key || seen.has(key) || (norm && seen.has(norm))) return false;
      seen.add(key);
      if (norm) seen.add(norm);
      return true;
    })
    .map(normalizeMovie);

  return {
    status: 'success',
    message: '',
    data: { animeList },
    pagination: null,
  } as unknown as ApiResponse<Movies>;
}
