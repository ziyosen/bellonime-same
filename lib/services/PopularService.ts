import { API_BASE_URL, API_HEADERS } from '@/lib/config';
import type { ApiResponse, Popular } from '@/types/anime';

/**
 * Mengambil data anime populer, bisa berdasarkan halaman.
 * @param page Nomor halaman yang ingin diambil (opsional).
 */
export async function getPopularData(page?: number): Promise<ApiResponse<Popular>> {
  // Tambahkan parameter 'page' ke URL jika ada
  const url = new URL(`${API_BASE_URL}/samehadaku/popular`);
  if (page) {
    url.searchParams.append('page', page.toString());
  }

  const response = await fetch(url, {
    headers: API_HEADERS,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data anime populer');
  }


  return response.json();
}