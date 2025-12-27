import { API_BASE_URL, API_HEADERS } from '@/lib/config';
import type { ApiResponse, Recent } from '@/types/anime';

export async function getRecentData(page?: number): Promise<ApiResponse<Recent>> {
  const url = new URL(`${API_BASE_URL}/samehadaku/recent`);
  if (page) {
    url.searchParams.append('page', page.toString());
  }

  const response = await fetch(url.toString(), {
    headers: API_HEADERS,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data anime terbaru');
  }

  return response.json();
}
