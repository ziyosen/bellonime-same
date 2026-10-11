import { API_BASE_URL, API_HEADERS } from '@/lib/config';
import type { ApiResponse, Movies } from '@/types/anime';

// Sumber movie gabungan (UNION):
// 1. Wajik /samehadaku/movies (28 judul fresh)
// 2. Sanka /anime/samehadaku/movies (beberapa halaman pertama)
// Deduplikasi by animeId + judul ternormalisasi — user tidak melihat sumber.
// Lengkapnya di-deploy VPS dulu untuk review (staging), belum produksi.

const SANKA_BASE = 'https://www.sankavollerei.web.id';
const CACHE_BUSTER = () => `_=${Date.now()}`;

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
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/the movie|movie$/g, '');
}

function normalizeMovie(m: RawMovie) {
  const animeId = m.animeId || (m.href || '').split('/').pop() || '';
  return {
    title: m.title || '',
    poster: m.poster || '',
    type: m.type || 'Movie',
    score: m.score || '',
    status: m.status || '',
    animeId,
    href: m.href ? `/samehadaku/anime/${m.animeId}` : `/anime/${animeId}`,
    samehadakuUrl: m.samehadakuUrl || '',
    genreList: m.genreList || [],
  };
}

export async function getUnionMovies(pages = 2): Promise<ApiResponse<Movies>> {
  const cacheBust = CACHE_BUSTER();

  const tasks: Promise<RawMovie[]>[] = [
    // 1. Wajik — daftar movie utama
    fetch(`${API_BASE_URL}/samehadaku/movies?${cacheBust}`, {
      headers: API_HEADERS,
      next: { revalidate: 3600 },
    })
      .then((r) => (r.ok ? r.json() : { data: { animeList: [] } }))
      .then((j) => j?.data?.animeList || [])
      .catch(() => []),

    // 2. Sanka — beberapa halaman pertama
    ...Array.from({ length: pages }, (_, i) =>
      fetch(`${SANKA_BASE}/anime/samehadaku/movies?page=${i + 1}&${cacheBust}`, {
        headers: API_HEADERS,
        next: { revalidate: 3600 },
      })
        .then((r) => (r.ok ? r.json() : { data: { animeList: [] } }))
        .then((j) => j?.data?.animeList || [])
        .catch(() => []),
    ),
  ];

  const settled = await Promise.allSettled(tasks);
  const all: RawMovie[] = settled.flatMap((s) => (s.status === 'fulfilled' ? s.value : []));

  // Deduplikasi: prioritaskan entri dari Wajik (urutan pertama), lalu Sanka.
  const seen = new Set<string>();
  const unique: RawMovie[] = [];
  for (const m of all) {
    if (!m?.title) continue;
    const id = (m.animeId || '').toLowerCase();
    const key = id || normTitle(m.title);
    if (!key || seen.has(key) || seen.has(normTitle(m.title))) continue;
    seen.add(key);
    seen.add(normTitle(m.title));
    unique.push(m);
  }

  return {
    status: 'success',
    message: '',
    data: { animeList: unique.map(normalizeMovie) },
    pagination: null,
  } as unknown as ApiResponse<Movies>;
}
