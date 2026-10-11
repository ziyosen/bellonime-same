import { API_BASE_URL, API_HEADERS } from '@/lib/config';
import type { AnimeDetail } from '@/types/anime';

type RawAnimeDetail = Partial<AnimeDetail> & {
  title?: string;
  episodes?: string | number | null;
  synopsis?: {
    paragraphs?: string | string[];
    connections?: AnimeDetail['synopsis']['connections'];
  };
  episodeList?: AnimeDetail['episodeList'];
};

function textValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function listValue(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => textValue(item)).filter(Boolean);
  const text = textValue(value);
  return text ? [text] : [];
}

function slugVariants(animeId: string): string[] {
  const variants = [animeId];
  const seasonMatch = animeId.match(/^(.*)-season-(\d+)$/);
  if (seasonMatch) {
    const num = Number(seasonMatch[2]);
    const suffix = num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : 'th';
    variants.push(`${seasonMatch[1]}-${num}${suffix}-season`);
  }
  const nthMatch = animeId.match(/^(.*)-(\d+)(?:st|nd|rd|th)-season$/);
  if (nthMatch) variants.push(`${nthMatch[1]}-season-${nthMatch[2]}`);
  return [...new Set(variants)];
}

async function fetchDetail(source: 'samehadaku' | 'animekiid' | 'sanka', animeId: string): Promise<RawAnimeDetail | null> {
  try {
    const base = source === 'sanka' ? 'https://www.sankavollerei.web.id/anime' : API_BASE_URL;
    const response = await fetch(`${base}/${source === 'sanka' ? 'samehadaku' : source}/anime/${animeId}`, {
      headers: API_HEADERS,
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const result = await response.json();
    const data = (result.data || null) as RawAnimeDetail | null;
    return data?.title ? data : null;
  } catch {
    return null;
  }
}

export async function getAnimeDetail(animeId: string): Promise<AnimeDetail> {
  let rawDetail: RawAnimeDetail | null = null;
  for (const variant of slugVariants(animeId)) {
    rawDetail = await fetchDetail('samehadaku', variant);
    if (rawDetail) break;
  }
  if (!rawDetail) {
    for (const variant of slugVariants(animeId)) {
      rawDetail = await fetchDetail('animekiid', variant);
      if (rawDetail) break;
    }
  }
  if (!rawDetail) {
    rawDetail = await fetchDetail('sanka', animeId);
  }
  if (!rawDetail) {
    throw new Error('Gagal mengambil detail anime');
  }
  const raw = rawDetail;
  const episodeList = (raw.episodeList || []).map((episode) => ({
    ...episode,
    title: textValue(episode.title),
    episodeId: textValue(episode.episodeId),
    href: textValue(episode.href),
    samehadakuUrl: textValue(episode.samehadakuUrl),
  }));
  const paragraphs = Array.isArray(raw.synopsis?.paragraphs)
    ? raw.synopsis.paragraphs.join('\n\n')
    : textValue(raw.synopsis?.paragraphs);
  const title = textValue(raw.title);

  return {
    title,
    poster: textValue(raw.poster),
    score: {
      value: textValue(raw.score?.value) || '0',
      users: textValue(raw.score?.users),
    },
    japanese: textValue(raw.japanese),
    synonyms: listValue(raw.synonyms),
    english: textValue(raw.english) || title,
    status: textValue(raw.status),
    type: textValue(raw.type),
    source: textValue(raw.source),
    duration: textValue(raw.duration),
    episodes: textValue(raw.episodes) || (episodeList.length ? String(episodeList.length) : '-'),
    season: textValue(raw.season),
    studios: listValue(raw.studios),
    producers: listValue(raw.producers),
    aired: textValue(raw.aired),
    trailer: textValue(raw.trailer),
    synopsis: {
      paragraphs,
      connections: raw.synopsis?.connections || [],
    },
    genreList: raw.genreList || [],
    batchList: raw.batchList || [],
    episodeList,
  };
}
