import { ApiResponse, GenresDetail } from "@/types/anime";
import { API_BASE_URL, API_HEADERS } from "@/lib/config";

// Tambahkan 'page?: number' sebagai argumen kedua
export async function getGenresDetailData(genreId: string, page?: number): Promise<ApiResponse<GenresDetail>> {
  const url = new URL(`${API_BASE_URL}/samehadaku/genres/${genreId}`);
  if (page) {
    url.searchParams.append('page', page.toString());
  }

  const response = await fetch(url.toString(), {
    headers: API_HEADERS,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data detail genre");
  }

  return response.json();
}