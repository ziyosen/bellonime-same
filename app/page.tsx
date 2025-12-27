import { getHomeData } from '@/lib/services';
import SlickCarousel from '@/components/home/SlickCarousel';
import MovieSection from '@/components/home/MovieSection';
import TabbedAnimeSection from '@/components/home/TabbedAnimeSection';
import GenreSection from '@/components/home/GenreSection';

export default async function HomePage() {
  const [top10Result] = await Promise.allSettled([getHomeData()]);

  if (top10Result.status === 'rejected') {
    console.error('Failed to load data:', top10Result.reason);
  }

  const top10Anime = top10Result.status === 'fulfilled'
    ? top10Result.value.top10.animeList
    : [];

  return (
    <main className="min-h-screen pb-28 md:pb-8 md:pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Carousel */}
        {top10Anime.length > 0 && (
          <section className="mb-8">
            <div className="rounded-2xl overflow-hidden shadow-soft-lg">
              <SlickCarousel animes={top10Anime} />
            </div>
          </section>
        )}

        {/* Genre Tags */}
        <section className="mb-8">
          <GenreSection />
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Anime Sections */}
          <div>
            <TabbedAnimeSection />
          </div>

          {/* Movie Sidebar */}
          <aside className="hidden lg:block">
            <MovieSection />
          </aside>
        </div>
      </div>
    </main>
  );
}
