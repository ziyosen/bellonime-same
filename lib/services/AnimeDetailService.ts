// lib/services/AnimeDetailService.ts
import { API_BASE_URL } from '@/lib/config';
import type { ApiResponse, AnimeDetail } from '@/types/anime';

export async function getAnimeDetail(animeId: string): Promise<AnimeDetail> {
  const response = await fetch(
    `${API_BASE_URL}/samehadaku/anime/${animeId}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Gagal mengambil detail anime');
  }

  const result: ApiResponse<AnimeDetail> = await response.json();
  return result.data;
}
