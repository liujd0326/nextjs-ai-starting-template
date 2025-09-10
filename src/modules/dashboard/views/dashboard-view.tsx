import {
  Activity,
  Clock,
  CreditCard,
  History,
  ImageIcon,
  Palette,
  Plus,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { MotionDiv } from "@/components/motion-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  currentPlan?: string | null;
  monthlyCredits?: number | null;
  purchasedCredits?: number | null;
}

interface DashboardViewProps {
  user: User;
}

export const DashboardView = ({ user }: DashboardViewProps) => {
  const totalCredits =
    (user.monthlyCredits || 0) + (user.purchasedCredits || 0);
  const planName = user.currentPlan || "free";
  const isLowCredits = totalCredits < 5;

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-8 lg:px-12 py-8 md:py-16 space-y-12 md:space-y-20">
      {/* Welcome Header */}
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              Welcome back, {user.name || "User"}! 👋
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-emerald-100">
              Ready to transform your images with AI? Let's create something
              amazing together.
            </p>
          </div>
        </div>
      </MotionDiv>

      {/* Credits & Plan Overview */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg px-3 sm:px-4 md:px-5 py-6 md:py-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-emerald-600" />
                  Your AI Credits
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {planName === "free"
                    ? "Free Plan"
                    : `${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan`}
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800 border-emerald-200"
              >
                {planName.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-2xl md:text-3xl font-bold text-emerald-700">
                  {totalCredits}
                </p>
                <p className="text-emerald-600 text-sm font-medium">
                  Total Credits
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xl md:text-2xl font-semibold text-gray-700">
                  {user.monthlyCredits || 0}
                </p>
                <p className="text-gray-600 text-sm">Monthly</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xl md:text-2xl font-semibold text-gray-700">
                  {user.purchasedCredits || 0}
                </p>
                <p className="text-gray-600 text-sm">Purchased</p>
              </div>
            </div>

            {isLowCredits && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  <p className="text-amber-800 text-sm font-medium">
                    Running low on credits!
                  </p>
                </div>
                <p className="text-amber-700 text-xs mt-1">
                  Consider upgrading your plan for unlimited creativity.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Link href="/pricing">
                  <Plus className="mr-2 h-4 w-4" />
                  Buy Credits
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <Link href="/dashboard/subscription">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Plan
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Main Feature */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Transform Your Images
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            Upload your images and let AI enhance, stylize, and transform them
            into something extraordinary
          </p>
        </div>

        <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg max-w-4xl mx-auto">
          <CardHeader className="text-center pb-8 md:pb-12 px-4 sm:px-6 md:px-12">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Palette className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Image to Image Generation
            </CardTitle>
            <CardDescription className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
              Transform and enhance your existing images with powerful AI.
              Change styles, improve quality, or completely reimagine your
              photos.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-12 md:pb-16 px-4 sm:px-6 md:px-12">
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 text-lg font-semibold"
            >
              <Link href="/create">
                <Palette className="mr-3 h-5 w-5" />
                Start Creating
              </Link>
            </Button>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Quick Links */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Quick Access
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Manage your account and explore more features
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-6xl mx-auto">
          <Link href="/dashboard/generations" className="group">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <CardContent className="p-4 sm:p-6 md:p-10 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <History className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">History</h3>
                <p className="text-sm text-gray-600">View your creations</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/subscription" className="group">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <CardContent className="p-4 sm:p-6 md:p-10 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <CreditCard className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Billing</h3>
                <p className="text-sm text-gray-600">Manage subscription</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/pricing" className="group">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <CardContent className="p-4 sm:p-6 md:p-10 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Upgrade</h3>
                <p className="text-sm text-gray-600">Get more credits</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/blog" className="group">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <CardContent className="p-4 sm:p-6 md:p-10 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <Clock className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Blog</h3>
                <p className="text-sm text-gray-600">Tips & tutorials</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </MotionDiv>
    </div>
  );
};
