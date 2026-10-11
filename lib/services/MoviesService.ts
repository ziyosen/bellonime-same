import { getUnionMovies } from '@/lib/services/UnionMoviesService';
import type { ApiResponse, Movies } from '@/types/anime';

/**
 * Data film anime gabungan (union wajik + Sanka, sudah deduplikasi).
 * Sumber tidak ditampilkan ke user — tampil sebagai satu list movie.
 */
export async function getMoviesData(page?: number): Promise<ApiResponse<Movies>> {
  return getUnionMovies(2);
}
