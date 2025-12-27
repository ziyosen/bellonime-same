import { getAnimeDetail, getEpisodeData } from '@/lib/services';
import type { Episode, AnimeDetail } from '@/types/anime';
import EpisodePlayerSection from '@/components/episode/EpisodePlayerSection';
import EpisodeSidebar from '@/components/episode/EpisodeSidebar';
import EpisodeListMobile from '@/components/episode/EpisodeListMobile';
import DownloadSection from '@/components/episode/DownloadSection';

// Fungsi untuk SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const episode: Episode = await getEpisodeData(params.id);
    return { title: `${episode.title} - Bellonime` };
  } catch {
    return { title: 'Episode Tidak Ditemukan' };
  }
}

// Komponen Halaman
export default async function EpisodePage({ params }: { params: { id: string } }) {
  let episode: Episode;
  let anime: AnimeDetail;

  try {
    episode = await getEpisodeData(params.id);
    if (!episode) throw new Error('Episode tidak ditemukan');

    anime = await getAnimeDetail(episode.animeId);
    if (!anime) throw new Error('Anime induk tidak ditemukan');
  } catch (error) {
    console.error(error);
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Episode Tidak Ditemukan</h1>
          <p className="text-slate-600 dark:text-slate-400">Gagal memuat data episode.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Left Column: Player & Download */}
          <div className="space-y-6">
            {/* Video Player */}
            <EpisodePlayerSection episode={episode} />

            {/* Mobile Episode List */}
            {anime.episodeList && anime.episodeList.length > 0 && (
              <div className="lg:hidden">
                <EpisodeListMobile episodes={anime.episodeList} />
              </div>
            )}

            {/* Download Section */}
            {episode.downloadUrl?.formats && (
              <DownloadSection formats={episode.downloadUrl.formats} />
            )}
          </div>

          {/* Right Column: Info & Episode Sidebar (Desktop) */}
          {anime.episodeList && anime.episodeList.length > 0 && (
            <div className="hidden lg:block">
              <EpisodeSidebar
                episodes={anime.episodeList}
                episode={episode}
                anime={anime}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}