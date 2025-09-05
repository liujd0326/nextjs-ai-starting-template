import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Payment Successful - AI Template",
  description:
    "Your payment has been processed successfully. Start creating amazing AI-generated images now!",
};

interface PaymentSuccessPageProps {
  searchParams: Promise<{ type?: string; session_id?: string; plan?: string }>;
}

const PaymentSuccessPage = async ({ searchParams }: PaymentSuccessPageProps) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const isCreditsPayment = params.type === 'credits';

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 min-h-[calc(100vh-150px)]">
      <div className="max-w-2xl w-full mx-auto px-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 text-center border-0">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Main Content */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            🎉 Payment Successful!
          </h1>

          <p className="text-lg text-gray-600 mb-2">
            {isCreditsPayment 
              ? `Great news, ${session.user.name}!` 
              : `Welcome to the premium experience, ${session.user.name}!`}
          </p>

          <p className="text-gray-500 mb-8">
            {isCreditsPayment 
              ? "Your 1000 AI credits have been added to your account and are ready to use!" 
              : "Your subscription is now active and ready to use."}
          </p>

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🚀 You can now:
            </h2>
            <div className="space-y-3 text-gray-700">
              {isCreditsPayment ? (
                <>
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    1000 AI generation credits
                  </div>
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Credits never expire
                  </div>
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    All premium models included
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Generate unlimited AI images
                  </div>
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Access premium AI models
                  </div>
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Get priority processing speed
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Primary CTA - Start Creating */}
            <Link
              href={isCreditsPayment ? "/" : "/"}
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              ✨ Start Creating Now
            </Link>

            {/* Secondary CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/dashboard"
                className="block bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                📊 Dashboard
              </Link>

              <Link
                href="/subscription"
                className="block bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                ⚙️ Manage Subscription
              </Link>
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              📧 Confirmation email sent to{" "}
              <span className="font-medium text-gray-700">
                {session.user.email}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
