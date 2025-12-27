import { ApiResponse, Schedule } from "@/types/anime";
import { API_BASE_URL, API_HEADERS } from "@/lib/config";
// lib/services/ScheduleService.ts
export async function getScheduleData(): Promise<Schedule> {
  const response = await fetch(`${API_BASE_URL}/samehadaku/schedule`, {
    headers: API_HEADERS,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data jadwal anime");
  }

  const result: ApiResponse<Schedule> = await response.json();
  return result.data;
}