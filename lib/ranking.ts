// Ranking mingguan/bulanan/alltime dari homepage samehadaku.li (widget wpop embed di HTML).
// Sumber resmi widget ts-wpop: Weekly / Monthly / All — persis seperti tampilan aslinya.

const SH_URL = 'https://samehadaku.li/';
const SH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: 'text/html',
};

export type RankItem = {
  rank: number;
  title: string;
  img: string;
  url: string;
  genres: string[];
  rating?: string;
  animeId: string;
};

type CacheEntry = { at: number; data: Record<string, RankItem[]> };
let cache: CacheEntry | null = null;
const TTL = 5 * 60 * 1000; // 5 menit

function parseRanking(html: string): Record<string, RankItem[]> {
  const out: Record<string, RankItem[]> = {};
  for (const rng of ['weekly', 'monthly', 'alltime'] as const) {
    const m =
      html.match(new RegExp(`wpop-${rng}'><ul>([\\s\\S]*?)</ul>`)) ||
      html.match(new RegExp(`wpop-${rng}"><ul>([\\s\\S]*?)</ul>`));
    if (!m) continue;
    const seg = m[1];
    const items: RankItem[] = [];
    for (const part of seg.split('<li><div class="ctr">').slice(1)) {
      const rankNum = part.match(/^(\d+)/)?.[1];
      if (!rankNum) continue;
      const b = part.split('</li>')[0];
      const li = [null, rankNum, b] as unknown as RegExpMatchArray;
      const url = b.match(/href="([^"]+)"/)?.[1] || '';
      const img = b.match(/data-src="([^"]+)"/)?.[1] || '';
      const title = b.match(/alt="([^"]+)"/)?.[1] || '';
      const gen = b.match(/<b>Genres<\/b>:([\s\S]*?)<\/span>/)?.[1] || '';
      const genres = [...gen.matchAll(/>([^<>]+)<\/a>/g)].map((g) => g[1].trim());
      const rating = b.match(/numscore">([\d.]+)</)?.[1];
      // animeId dari slug URL: /anime/<slug>/
      const animeId = url.match(/\/anime\/([^/]+)\/?/)?.[1] || '';
      items.push({ rank: Number(li[1]), title, img, url, genres, rating, animeId });
    }
    out[rng] = items;
  }
  return out;
}

export async function getRanking(): Promise<Record<string, RankItem[]>> {
  if (cache && Date.now() - cache.at < TTL) return cache.data;
  try {
    const res = await fetch(SH_URL, { headers: SH_HEADERS, next: { revalidate: 300 } });
    if (!res.ok) return cache?.data || {};
    const html = await res.text();
    const data = parseRanking(html);
    if (Object.keys(data).length) cache = { at: Date.now(), data };
    return data;
  } catch {
    return cache?.data || {};
  }
}
