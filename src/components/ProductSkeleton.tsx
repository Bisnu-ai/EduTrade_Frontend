export default function ProductSkeleton() {
  return (
    <div className="glass-morphism rounded-[24px] md:rounded-[32px] overflow-hidden border border-white/5 animate-pulse h-full flex flex-col">
      <div className="aspect-[4/5] bg-white/5" />
      <div className="p-4 md:p-6 space-y-3">
        <div className="h-4 bg-white/10 rounded-full w-3/4" />
        <div className="h-3 bg-white/5 rounded-full w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-white/10 rounded-full w-1/4" />
          <div className="h-8 bg-white/10 rounded-xl w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(8)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
