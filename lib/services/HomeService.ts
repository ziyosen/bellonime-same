import { API_BASE_URL, API_HEADERS } from '@/lib/config'; // <-- Impor dari file config
import type { ApiResponse, Home } from '@/types/anime';

export async function getHomeData(): Promise<Home> {
  // Langsung pakai tanpa perlu deklarasi ulang
  const response = await fetch(`${API_BASE_URL}/samehadaku/home`, {
    headers: API_HEADERS,
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data home');
  }

  const result: ApiResponse<Home> = await response.json();
  return result.data;
}