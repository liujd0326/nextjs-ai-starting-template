import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GenerationsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header Skeleton */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-3xl p-10 relative overflow-hidden animate-pulse">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <Skeleton className="h-12 w-80 mb-3 bg-white/30" />
                <Skeleton className="h-6 w-96 bg-white/20" />
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center lg:items-center gap-4">
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <Skeleton className="h-4 w-12 bg-white/30" />
                  <Skeleton className="h-8 w-32 bg-white/40 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-20 bg-white/20 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card 
            key={i} 
            className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-pulse"
          >
            <CardHeader className="px-6 pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20 rounded-full bg-emerald-100/50" />
                <div className="bg-gradient-to-r from-emerald-100/30 to-teal-100/30 px-3 py-1 rounded-full">
                  <Skeleton className="h-4 w-20 bg-emerald-200/50" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {/* Image Skeleton */}
              <div className="relative mb-6">
                <Skeleton className="w-full h-48 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50" />
                {/* Image counter skeleton */}
                <div className="absolute top-3 right-3">
                  <Skeleton className="h-6 w-8 rounded-full bg-emerald-200/70" />
                </div>
                {/* Image indicators skeleton */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="w-3 h-3 rounded-full bg-white/60" />
                  ))}
                </div>
              </div>

              {/* Download Button Skeleton */}
              <Skeleton className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-200/50 to-teal-200/50" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}