import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionLoading() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-12 space-y-12">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 md:p-8 lg:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="relative z-10">
          <Skeleton className="h-8 md:h-10 w-3/4 md:w-80 lg:w-96 mb-2 bg-white/20" />
          <Skeleton className="h-5 md:h-6 w-full md:w-96 lg:w-[500px] bg-white/10" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Current Plan - Full Width */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Skeleton className="w-6 h-6 mr-3" />
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48 mt-2" />
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* No Active Subscription Skeleton */}
            <div className="text-center py-12">
              <Skeleton className="w-16 h-16 mx-auto rounded-full mb-4" />
              <Skeleton className="h-5 md:h-6 w-32 md:w-48 mx-auto mb-2" />
              <Skeleton className="h-4 md:h-5 w-48 md:w-64 mx-auto mb-6" />
              <Skeleton className="h-10 w-28 md:w-32 mx-auto rounded" />
            </div>
          </CardContent>
        </Card>

        {/* Bottom Row - Two Cards Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Usage Overview Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Skeleton className="w-6 h-6 mr-3" />
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-48 mt-2" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="text-center p-6 md:p-8 bg-emerald-50 rounded-xl border border-emerald-200">
                  <Skeleton className="h-8 md:h-10 w-12 md:w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-20 md:w-24 mx-auto" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="text-center p-4 md:p-6 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <Skeleton className="h-5 md:h-6 w-12 md:w-14 mx-auto mb-2" />
                      <Skeleton className="h-4 w-14 md:w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Skeleton className="w-6 h-6 mr-3" />
                <Skeleton className="h-6 w-40" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-32 mt-2" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              <div className="pt-4 border-t">
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
