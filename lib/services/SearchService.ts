import { API_BASE_URL, API_HEADERS } from '@/lib/config';
import type { ApiResponse, Search } from '@/types/anime';

/**
 * Mengambil data hasil pencarian berdasarkan query dan halaman.
 * @param query Kata kunci pencarian.
 * @param page Nomor halaman yang ingin diambil (opsional).
 */
export async function getSearchData(query: string, page: number = 1): Promise<ApiResponse<Search>> {
  // URL: /samehadaku/search?q={query}&page={page}
  const url = new URL(`${API_BASE_URL}/samehadaku/search`);
  url.searchParams.append('q', query);
  url.searchParams.append('page', page.toString());

  const response = await fetch(url.toString(), {
    headers: API_HEADERS,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data pencarian');
  }

  const result: ApiResponse<Search> = await response.json();
  return result;
}