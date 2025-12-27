import { getAnimeDetail } from '@/lib/services';
import Image from 'next/image';
import Link from 'next/link';
import { Star, PlayCircle, Film, Calendar, Tv, Tag } from 'lucide-react';
import type { AnimeDetail } from '@/types/anime';
import Synopsis from '@/components/anime-detail/Synopsis';
import EpisodeList from '@/components/anime-detail/EpisodeList';
import SectionWrapper from '@/components/anime-detail/SectionWrapper';
import SkeletonSynopsis from '@/components/anime-detail/SkeletonSynopsis';
import SkeletonEpisodes from '@/components/anime-detail/SkeletonEpisodes';
import BatchSection from '@/components/anime-detail/BatchSection';

// Stats Card Component
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-soft-md">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
      </div>
    </div>
  );
}

// SEO Metadata
export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const anime = await getAnimeDetail(params.id);
    return {
      title: `${anime.english} - Bellonime`,
      description: anime.synopsis?.paragraphs.slice(0, 160),
    };
  } catch {
    return { title: 'Anime Tidak Ditemukan', description: 'Gagal memuat data anime.' };
  }
}

// Anime Detail Page
export default async function AnimeDetailPage({ params }: { params: { id: string } }) {
  let anime: AnimeDetail | null = null;
  try {
    anime = await getAnimeDetail(params.id);
  } catch {
    anime = null;
  }

  const isLoaded = Boolean(anime);

  if (!anime) {
    return (
      <main className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-slate-600 dark:text-slate-400">Anime tidak ditemukan</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-28 md:pb-8">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden bg-slate-200">
        {/* Loading Skeleton */}
        <div className="absolute inset-0 animate-shimmer" />

        {/* Backdrop Image */}
        <Image
          src={anime.poster}
          alt={anime.english}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay - Manual dark mode */}
        <div className="absolute inset-0 hero-gradient" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              {anime.english}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
              {anime.japanese}
            </p>
            {anime.trailer && (
              <Link
                href={anime.trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors shadow-soft-lg"
              >
                <PlayCircle size={20} />
                <span className="font-semibold">Tonton Trailer</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Tv size={20} />} label="Tipe" value={anime.type} />
          <StatCard icon={<Film size={20} />} label="Episode" value={anime.episodes} />
          <StatCard icon={<Calendar size={20} />} label="Musim" value={anime.season} />
          <StatCard icon={<Star size={20} />} label="Skor" value={anime.score.value} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Synopsis */}
            <SectionWrapper isLoaded={isLoaded}>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Sinopsis</h2>
              {anime ? <Synopsis text={anime.synopsis.paragraphs} /> : <SkeletonSynopsis />}
            </SectionWrapper>

            {/* Connections */}
            {anime?.synopsis?.connections && anime.synopsis.connections.length > 0 && (
              <SectionWrapper isLoaded={isLoaded}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Musim Lainnya</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {anime.synopsis.connections.map((conn) => (
                    <Link
                      key={conn.animeId}
                      href={conn.animeId}
                      className="block p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-medium text-slate-900 dark:text-slate-100 hover:bg-accent hover:text-white hover:border-accent transition-all shadow-soft"
                    >
                      {conn.title}
                    </Link>
                  ))}
                </div>
              </SectionWrapper>
            )}

            {/* Batch Downloads */}
            {anime && anime.batchList && anime.batchList.length > 0 && (
              <SectionWrapper isLoaded={isLoaded}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Batch Download</h2>
                <BatchSection batches={anime.batchList} />
              </SectionWrapper>
            )}

            {/* Episodes */}
            <SectionWrapper isLoaded={isLoaded}>
              {anime ? <EpisodeList episodes={anime.episodeList} /> : <SkeletonEpisodes />}
            </SectionWrapper>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Poster */}
            <SectionWrapper isLoaded={isLoaded}>
              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-soft-xl">
                <Image
                  src={anime.poster}
                  alt={`Poster ${anime.english}`}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
            </SectionWrapper>

            {/* Genres */}
            <SectionWrapper isLoaded={isLoaded}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">Genre</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genreList.map(genre => (
                  <Link
                    key={genre.genreId}
                    href={`/genres/${genre.genreId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-accent hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <Tag size={14} />
                    {genre.title}
                  </Link>
                ))}
              </div>
            </SectionWrapper>
          </aside>
        </div>
      </div>
    </main>
  );
}
