export default function GenreDetailLoading() {
  return (
    <main className="min-h-screen bg-[#070b12] pb-28 pt-[84px] text-white md:pb-12 md:pt-24">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-6 lg:px-8">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-white/10" />
        <div className="mt-7 grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-[2/3] animate-pulse rounded-2xl bg-white/[0.07]" />
              <div className="mt-2 h-4 animate-pulse rounded bg-white/10" />
              <div className="mt-1.5 h-3 w-2/3 animate-pulse rounded bg-white/[0.07]" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
