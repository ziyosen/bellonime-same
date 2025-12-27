import { API_BASE_URL, API_HEADERS } from '@/lib/config';
import type { ApiResponse, Ongoing } from '@/types/anime';

/**
 * Mengambil data anime ongoing, bisa berdasarkan halaman.
 * @param page Nomor halaman yang ingin diambil (opsional).
 */
export async function getOngoingData(page?: number): Promise<ApiResponse<Ongoing>> {
  const url = new URL(`${API_BASE_URL}/samehadaku/ongoing`);
  if (page) {
    url.searchParams.append('page', page.toString());
  }

  const response = await fetch(url.toString(), {
    headers: API_HEADERS,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data anime ongoing');
  }

  return response.json();
}