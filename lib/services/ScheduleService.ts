import { ApiResponse, Schedule } from "@/types/anime";
import { API_BASE_URL, API_HEADERS } from "@/lib/config";
// lib/services/ScheduleService.ts
export async function getScheduleData(): Promise<Schedule> {
  try {
    const response = await fetch(`${API_BASE_URL}/samehadaku/schedule`, {
      headers: API_HEADERS,
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000), // endpoint schedule sering hang ~20s — jangan biarkan home ikut lambat
    });
    if (!response.ok) {
      return { days: [] } as unknown as Schedule;
    }
    const result: ApiResponse<Schedule> = await response.json();
    return result.data;
  } catch {
    return { days: [] } as unknown as Schedule; // fail fast: home tetap tampil tanpa jadwal
  }

}