import { API_BASE_URL, API_HEADERS } from '@/lib/config';
import type { ApiResponse, AnimeDetail } from '@/types/anime';

export async function getAnimeDetail(animeId: string): Promise<AnimeDetail> {
  console.log('Fetching Anime Detail:', { url: `${API_BASE_URL}/samehadaku/anime/${animeId}`, headers: API_HEADERS });
  const response = await fetch(
    `${API_BASE_URL}/samehadaku/anime/${animeId}`,
    {
      headers: API_HEADERS,
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Gagal mengambil detail anime');
  }

  const result: ApiResponse<AnimeDetail> = await response.json();
  return result.data;
}
