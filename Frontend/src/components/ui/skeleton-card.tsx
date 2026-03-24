const SkeletonCard = () => {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-full bg-secondary/50" />
        <div className="flex-1">
          <div className="h-6 bg-secondary/50 rounded w-3/4 mb-2" />
          <div className="h-4 bg-secondary/50 rounded w-1/2 mb-4" />
          <div className="h-9 bg-secondary/50 rounded w-full" />
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
