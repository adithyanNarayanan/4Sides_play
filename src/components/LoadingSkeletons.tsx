export function HeroSkeleton() {
  return (
    <section className="relative w-full h-[100dvh] min-h-[500px] lg:min-h-[600px] overflow-hidden bg-[#181818]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-[#222]" />
      <div className="relative h-full flex items-center">
        <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-20 sm:pt-24 pb-32 sm:pb-0">
          <div className="max-w-2xl space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-4 w-20 bg-white/10 rounded" />
              <div className="h-4 w-12 bg-white/10 rounded" />
              <div className="h-4 w-16 bg-white/10 rounded" />
            </div>
            <div className="h-16 w-3/4 bg-white/10 rounded" />
            <div className="flex items-center gap-2">
              <div className="h-5 w-12 bg-white/10 rounded" />
              <div className="h-5 w-8 bg-white/10 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-2/3 bg-white/10 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-white/10 rounded-full" />
              <div className="h-8 w-16 bg-white/10 rounded-full" />
              <div className="h-8 w-16 bg-white/10 rounded-full" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-32 bg-white/10 rounded-lg" />
              <div className="h-12 w-32 bg-white/10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MovieRowSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div className="py-8">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="h-7 w-48 bg-white/10 rounded mb-6 animate-pulse" />
      </div>
      <div className="flex gap-4 overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 pb-8 pt-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] animate-pulse">
            <div className="aspect-[2/3] bg-white/10 rounded-lg" />
            <div className="mt-2 h-4 w-3/4 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-white/10 rounded-lg" />
          <div className="mt-3 h-4 w-3/4 bg-white/10 rounded" />
          <div className="mt-2 h-3 w-1/2 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#1a1a1a] to-[#222]" />
        <div className="absolute inset-0 flex items-end pb-24 sm:pb-40">
          <div className="max-w-[1920px] mx-auto w-full px-6 sm:px-12 lg:px-20">
            <div className="max-w-4xl space-y-8 animate-pulse">
              <div className="flex gap-4">
                <div className="h-8 w-16 bg-white/10 rounded-md" />
                <div className="h-8 w-16 bg-white/10 rounded-md" />
                <div className="h-8 w-16 bg-white/10 rounded-md" />
              </div>
              <div className="h-20 w-3/4 bg-white/10 rounded" />
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-white/10 rounded-full" />
                <div className="h-10 w-24 bg-white/10 rounded-full" />
              </div>
              <div className="flex gap-4">
                <div className="h-16 w-40 bg-white/10 rounded-2xl" />
                <div className="h-16 w-16 bg-white/10 rounded-2xl" />
                <div className="h-16 w-16 bg-white/10 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoriesSkeleton() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-[1920px] mx-auto">
        <div className="h-8 w-56 bg-white/10 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}
