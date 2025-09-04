export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-light-300 bg-white p-4">
            <div className="h-20 w-20 animate-pulse rounded-md bg-light-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-light-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-light-200" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-md bg-light-200" />
              <div className="h-4 w-8 animate-pulse rounded bg-light-200" />
              <div className="h-8 w-8 animate-pulse rounded-md bg-light-200" />
            </div>
            <div className="h-4 w-16 animate-pulse rounded bg-light-200" />
            <div className="h-8 w-8 animate-pulse rounded-md bg-light-200" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-light-300 bg-white p-6">
        <div className="h-6 w-32 animate-pulse rounded bg-light-200 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-20 animate-pulse rounded bg-light-200" />
              <div className="h-4 w-12 animate-pulse rounded bg-light-200" />
            </div>
          ))}
        </div>
        <div className="mt-6 h-12 w-full animate-pulse rounded-md bg-light-200" />
      </div>
    </div>
  );
}
