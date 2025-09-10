import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-96 mx-auto mb-2" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>

        {/* Current Plan Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Skeleton className="w-6 h-6 mr-3" />
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-48 mt-2" />
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        
          <CardContent className="space-y-6">
            {/* No Active Subscription Skeleton */}
            <div className="text-center py-12 px-6">
              <Skeleton className="w-20 h-20 mx-auto rounded-full mb-4" />
              <Skeleton className="h-8 w-64 mx-auto mb-3" />
              <Skeleton className="h-5 w-80 mx-auto mb-6" />
              <Skeleton className="h-12 w-40 mx-auto rounded-xl" />
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center">
              <Skeleton className="w-6 h-6 mr-3" />
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48 mt-2" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <Skeleton className="h-8 w-16 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center">
              <Skeleton className="w-6 h-6 mr-3" />
              <Skeleton className="h-6 w-40" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48 mt-2" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <Skeleton className="h-4 w-12 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <Skeleton className="h-4 w-12 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            <div className="pt-4 border-t">
              <Skeleton className="h-4 w-96" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}