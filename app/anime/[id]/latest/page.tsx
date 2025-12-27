import { getAnimeDetail } from '@/lib/services';
import { redirect } from 'next/navigation';

export default async function LatestEpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let targetUrl = `/anime/${id}`; // Default fallback to detail page

  try {
    const anime = await getAnimeDetail(id);

    if (anime && anime.episodeList && anime.episodeList.length > 0) {
      // Assuming the first episode in the list is the latest one
      const latestEpisode = anime.episodeList[0];
      targetUrl = `/episode/${latestEpisode.episodeId}`;
    }
  } catch (error) {
    console.error(`[LatestEpisodePage] Error fetching anime details:`, error);
  }

  // Perform redirect outside of try-catch to avoid catching NEXT_REDIRECT error
  redirect(targetUrl);
}
