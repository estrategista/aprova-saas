import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-md bg-navy-800", className)} {...props} />
  );
}

export function EditalCardSkeleton() {
  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
    </div>
  );
}

export function TextEditorSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="w-48 shrink-0 hidden lg:block space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 rounded-lg" />
        ))}
      </div>
      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-[400px] rounded-lg" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
