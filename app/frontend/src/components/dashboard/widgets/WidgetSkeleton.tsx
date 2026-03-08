export function WidgetSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
      <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200" />
      <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />
    </div>
  );
}
