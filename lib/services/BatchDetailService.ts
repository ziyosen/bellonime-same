import { ApiResponse, Batchdetail } from "@/types/anime";
import { API_BASE_URL, API_HEADERS } from "@/lib/config";
// lib/services/BatchDetailService.ts
export async function getBatchDetailData(batchId: string): Promise<Batchdetail> {
  const response = await fetch(`${API_BASE_URL}/samehadaku/batch/${batchId}`, {
    headers: API_HEADERS,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil detail anime batch");
  }

  const result: ApiResponse<Batchdetail> = await response.json();
  return result.data;
}