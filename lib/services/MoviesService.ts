import { API_BASE_URL, API_HEADERS } from '@/lib/config';
import type { ApiResponse, Movies } from '@/types/anime';

/**
 * Mengambil data film anime, bisa berdasarkan halaman.
 * @param page Nomor halaman yang ingin diambil (opsional).
 */
export async function getMoviesData(page?: number): Promise<ApiResponse<Movies>> {
  const url = new URL(`${API_BASE_URL}/samehadaku/movies`);

  if (page) {
    url.searchParams.append('page', page.toString());
  }

  const response = await fetch(url.toString(), {
    headers: API_HEADERS,
    next: { revalidate: 86400 }, // Revalidasi sekali sehari (24 jam)
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data film anime');
  }

  return response.json();
}