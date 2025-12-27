import { ApiResponse, Genres } from "@/types/anime";
import { API_BASE_URL, API_HEADERS } from "@/lib/config";

export async function getGenresData(): Promise<ApiResponse<Genres>> {
  const response = await fetch(`${API_BASE_URL}/samehadaku/genres`, {
    headers: API_HEADERS,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data genres");
  }

  return response.json();
}