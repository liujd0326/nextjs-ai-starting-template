import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { MotionDiv } from "@/components/motion-wrapper";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Payment Successful - AI Template",
  description:
    "Your payment has been processed successfully. Start creating amazing AI-generated images now!",
};

interface PaymentSuccessPageProps {
  searchParams: Promise<{ type?: string; session_id?: string; plan?: string }>;
}

const PaymentSuccessPage = async ({
  searchParams,
}: PaymentSuccessPageProps) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const isCreditsPayment = params.type === "credits";

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-emerald-900/20 py-12 min-h-[calc(100vh-150px)]">
      <div className="max-w-2xl w-full mx-auto px-6">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl border-0 overflow-hidden"
        >
          {/* Success Icon with Animation */}
          <div className="relative p-8 text-center">
            <MotionDiv
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.6,
                type: "spring",
                bounce: 0.4,
              }}
              className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </MotionDiv>
          </div>

          {/* Main Content */}
          <div className="px-8 pb-6 text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <MotionDiv
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    y: [0, -8, 0]
                  }}
                  transition={{ 
                    delay: 0.6, 
                    duration: 0.8, 
                    type: "spring", 
                    bounce: 0.6,
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }
                  }}
                  className="text-4xl"
                >
                  🎉
                </MotionDiv>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Payment Successful!
                </h1>
                <MotionDiv
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    y: [0, -8, 0]
                  }}
                  transition={{ 
                    delay: 0.8, 
                    duration: 0.8, 
                    type: "spring", 
                    bounce: 0.6,
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: 0.5
                    }
                  }}
                  className="text-4xl"
                >
                  🎉
                </MotionDiv>
              </div>

              <p className="text-xl text-gray-700 dark:text-gray-300 mb-3 font-medium">
                {isCreditsPayment
                  ? `Great news, ${session.user.name}!`
                  : `Welcome to the premium experience, ${session.user.name}!`}
              </p>

              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                {isCreditsPayment
                  ? "Your 1000 AI credits have been added to your account and are ready to use!"
                  : "Your subscription is now active and ready to use."}
              </p>
            </MotionDiv>
          </div>

          {/* Value Proposition */}
          <div className="mx-8 mb-8">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800/30"
            >
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center justify-center gap-2">
                <span className="text-2xl">🚀</span>
                You can now:
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                {isCreditsPayment ? (
                  <>
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-emerald-200/30">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">
                        1000 AI generation credits
                      </span>
                    </div>
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-emerald-200/30">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">Credits never expire</span>
                    </div>
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-emerald-200/30">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">
                        All premium models included
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-emerald-200/30">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">
                        Generate unlimited AI images
                      </span>
                    </div>
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-emerald-200/30">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">
                        Access premium AI models
                      </span>
                    </div>
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-emerald-200/30">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">
                        Get priority processing speed
                      </span>
                    </div>
                  </>
                )}
              </div>
            </MotionDiv>
          </div>

          {/* Action Buttons */}
          <div className="px-8 pb-8">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="space-y-4"
            >
              {/* Primary CTA - Start Creating */}
              <Link
                href="/"
                className="block w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span className="text-xl">✨</span>
                Start Creating AI Images
              </Link>

              {/* Secondary CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/dashboard"
                  className="block bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 py-3 px-4 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-800/30 border border-emerald-200 dark:border-emerald-800/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <span>📊</span>
                  View Dashboard
                </Link>

                <Link
                  href="/dashboard/subscription"
                  className="block bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 py-3 px-4 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-800/30 border border-emerald-200 dark:border-emerald-800/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <span>⚙️</span>
                  {isCreditsPayment ? "View Credits" : "Manage Plan"}
                </Link>
              </div>
            </MotionDiv>
          </div>

          {/* Email Confirmation */}
          <div className="px-8 pb-6">
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="pt-6 border-t border-emerald-200/50 dark:border-emerald-700/50 text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                <span className="text-base">📧</span>
                Confirmation email sent to{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-xs">
                  {session.user.email}
                </span>
              </p>
            </MotionDiv>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
