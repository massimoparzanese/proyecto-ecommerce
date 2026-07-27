export default function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-lg border border-border p-4 shadow-sm"
        >
          <div className="mb-4 h-48 rounded bg-muted"></div>
          <div className="mb-2 h-4 w-3/4 rounded bg-muted"></div>
          <div className="h-4 w-1/2 rounded bg-muted"></div>
        </div>
      ))}
    </div>
  );
}
