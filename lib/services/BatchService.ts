import { API_BASE_URL, API_HEADERS } from '@/lib/config';
import type { ApiResponse, Batch } from '@/types/anime';

/**
 * Mengambil data anime batch, bisa berdasarkan halaman.
 * @param page Nomor halaman yang ingin diambil (opsional).
 */
export async function getBatchData(page?: number): Promise<ApiResponse<Batch>> {
  const url = new URL(`${API_BASE_URL}/samehadaku/batch`);

  if (page) {
    url.searchParams.append('page', page.toString());
  }

  const response = await fetch(url.toString(), {
    headers: API_HEADERS,
    next: { revalidate: 86400 }, // Cukup revalidasi sekali sehari
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data anime batch');
  }

  return response.json();
}