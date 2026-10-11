import { ApiResponse } from "@/types/anime";

// ===== Sanka Movies Service — katalog movie lengkap dari Sanka (Animasu) =====
// Endpoint: https://www.sankavollerei.web.id/anime/animasu/movies?page=N
// Format: { status, creator, source, animes: [{title, slug, poster, episode, type}], pagination }

const SANKA_BASE = "https://www.sankavollerei.web.id";

export interface SankaMovieItem {
  title: string;
  slug: string;
  poster: string;
  releaseDate: string;
  score: string;
}

export interface SankaMoviesResult {
  animeList: SankaMovieItem[];
  hasNext: boolean;
  hasPrev: boolean;
  currentPage: number;
}

export async function getSankaMovies(page = 1): Promise<SankaMoviesResult> {
  try {
    const response = await fetch(`${SANKA_BASE}/anime/animasu/movies?page=${page}`, {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 }, // cache 1 jam — hemat rate limit Sanka (45 req/menit)
      signal: AbortSignal.timeout(6000), // fail fast
    });
    if (!response.ok) {
      return { animeList: [], hasNext: false, hasPrev: false, currentPage: page };
    }
    const json = await response.json();
    const animes = (json?.animes || []).map(
      (a: { title: string; slug: string; poster: string; episode: string; type: string }) => ({
        title: a.title || "",
        slug: a.slug || "",
        poster: a.poster || "",
        releaseDate: a.episode || "", // di Sanka "episode" berisi tanggal rilis untuk movie
        score: (a.type || "").replace("★", "").trim(),
      })
    );
    return {
      animeList: animes,
      hasNext: !!json?.pagination?.hasNext,
      hasPrev: !!json?.pagination?.hasPrev,
      currentPage: json?.pagination?.currentPage || page,
    };
  } catch {
    return { animeList: [], hasNext: false, hasPrev: false, currentPage: page };
  }
}
