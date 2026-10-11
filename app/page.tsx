import ZonaHome from '@/components/home/ZonaHome';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0f] pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-[1500px] px-3 pt-0 sm:px-6 md:pt-16 lg:px-8">
        <ZonaHome />
      </div>
    </main>
  );
}
