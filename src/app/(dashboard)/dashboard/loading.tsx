import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-12 py-16 space-y-20">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="relative z-10">
          <Skeleton className="h-10 w-80 mb-2 bg-white/20" />
          <Skeleton className="h-6 w-96 bg-white/10" />
        </div>
      </div>

      {/* Credits Card */}
      <Card className="border-0 shadow-lg px-5 py-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Skeleton className="h-6 w-14 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Main Feature */}
      <div>
        <div className="text-center mb-8">
          <Skeleton className="h-9 w-64 mx-auto mb-3" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        
        <Card className="border-0 shadow-lg max-w-4xl mx-auto">
          <CardHeader className="text-center pb-12 px-12">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-8" />
            <Skeleton className="h-8 w-80 mx-auto mb-2" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </CardHeader>
          <CardContent className="text-center pb-16 px-12">
            <Skeleton className="h-12 w-48 mx-auto" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div>
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-10 text-center">
                <Skeleton className="w-12 h-12 rounded-full mx-auto mb-4" />
                <Skeleton className="h-5 w-16 mx-auto mb-1" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}