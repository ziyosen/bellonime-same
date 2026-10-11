import type { ApiResponse, Movies } from '@/types/anime';

// Movie list = API Sanka (simple). Sumber tidak ditampilkan ke user.
// Detail/episode movie Sanka-only difallback ke Sanka oleh AnimeDetailService/EpisodeService.

const SANKA_MOVIES = 'https://www.sankavollerei.web.id/anime/samehadaku/movies';
const SANKA_PAGES = 2; // page 3 = 500 (habis)

function normTitle(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export async function getUnionMovies(): Promise<ApiResponse<Movies>> {
  const bust = `_=${Date.now()}`;
  const results = await Promise.allSettled(
    Array.from({ length: SANKA_PAGES }, (_, i) =>
      fetch(`${SANKA_MOVIES}?page=${i + 1}&${bust}`, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      }).then((r) => (r.ok ? r.json() : { data: { animeList: [] } })),
    ),
  );

  const all = results.flatMap((s) => (s.status === 'fulfilled' ? s.value?.data?.animeList || [] : []));

  const seen = new Set<string>();
  const animeList = all
    .filter((m: { title?: string; animeId?: string }) => m?.title && m?.animeId)
    .filter((m: { animeId: string; title: string }) => {
      const key = m.animeId.toLowerCase();
      const norm = normTitle(m.title);
      if (seen.has(key) || seen.has(norm)) return false;
      seen.add(key);
      seen.add(norm);
      return true;
    })
    .map((m: { title: string; poster: string; type?: string; score?: string; status?: string; animeId: string; href?: string; samehadakuUrl?: string; genreList?: unknown }) => ({
      title: m.title,
      poster: m.poster || '',
      type: m.type || 'Movie',
      score: m.score || '',
      status: m.status || '',
      animeId: m.animeId,
      href: `/samehadaku/anime/${m.animeId}`,
      samehadakuUrl: m.samehadakuUrl || '',
      genreList: m.genreList || [],
    }));

  return {
    status: 'success',
    message: '',
    data: { animeList },
    pagination: null,
  } as unknown as ApiResponse<Movies>;
}
