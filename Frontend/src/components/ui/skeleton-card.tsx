const SkeletonCard = () => {
  return (
    <div className="glass-card h-full p-5 sm:p-6 overflow-hidden">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
        <div className="h-14 w-14 rounded-2xl bg-surface-muted shimmer" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-5 w-2/3 rounded-md bg-surface-muted shimmer" />
          <div className="h-4 w-1/3 rounded-md bg-surface-muted shimmer" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 pt-1">
            <div className="h-12 rounded-xl bg-surface-muted shimmer" />
            <div className="h-12 rounded-xl bg-surface-muted shimmer" />
            <div className="hidden h-12 rounded-xl bg-surface-muted shimmer sm:block" />
          </div>
          <div className="h-10 w-full rounded-lg bg-surface-muted shimmer" />
        </div>
      </div>
    </div>
  );
};

const SkeletonList = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export { SkeletonCard, SkeletonList };
