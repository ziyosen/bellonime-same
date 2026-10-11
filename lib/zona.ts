import type { Anime } from '@/types/anime';
import type { ZonaCardItem } from '@/components/ZonaCard';

// Konverter dari tipe data apa pun ke kartu standar Zona.
export function animeToZona(a: Anime): ZonaCardItem {
  return {
    title: a.title ?? 'Tanpa Judul',
    poster: a.poster ?? '',
    href: `/anime/${a.animeId}`,
    score: a.score ?? undefined,
    meta: a.releasedOn || a.status || undefined,
    episodes: a.episodes || undefined,
  };
}
