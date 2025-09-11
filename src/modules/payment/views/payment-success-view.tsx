"use client";

import { ArrowRight, CheckCircle, CreditCard } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { MotionDiv } from "@/components/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSuccessViewProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const PaymentSuccessView = ({ user }: PaymentSuccessViewProps) => {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(searchParams.get("session_id"));
    setPlan(searchParams.get("plan"));
  }, [searchParams]);

  const getPlanDetails = (planName: string | null) => {
    const plans = {
      starter: {
        name: "Starter",
        credits: "100",
        features: [
          "100 AI generations per month",
          "High-quality image generation",
          "Multiple AI models",
          "Priority support",
        ],
      },
      pro: {
        name: "Pro",
        credits: "500",
        features: [
          "500 AI generations per month",
          "Premium AI models access",
          "Advanced customization",
          "Priority processing",
        ],
      },
      credits_pack: {
        name: "Credits Pack",
        credits: "1000",
        features: [
          "1000 AI generations",
          "All premium models access",
          "Priority processing",
          "Credits never expire",
        ],
      },
    };

    return plans[planName as keyof typeof plans] || plans.starter;
  };

  const planDetails = getPlanDetails(plan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <MotionDiv
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-4"
            >
              <CheckCircle className="w-16 h-16 text-green-600" />
            </MotionDiv>

            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </CardTitle>

            <p className="text-gray-600 text-lg">
              Welcome to the {planDetails.name} plan, {user.name}!
            </p>

            {sessionId && (
              <p className="text-sm text-gray-500 mt-2">
                Session ID: {sessionId}
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Plan Details */}
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Your {planDetails.name} Plan
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Monthly Credits</p>
                  <p className="text-2xl font-bold text-green-600">
                    {planDetails.credits}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Features</p>
                  <ul className="space-y-1">
                    {planDetails.features.slice(0, 3).map((feature, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </MotionDiv>

            {/* What's Next */}
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What&apos;s Next?
              </h3>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-sm font-semibold text-blue-600">
                      1
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Start Creating</p>
                    <p className="text-sm text-gray-600">
                      Go to your dashboard and start generating amazing AI
                      content
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-sm font-semibold text-blue-600">
                      2
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Manage Subscription
                    </p>
                    <p className="text-sm text-gray-600">
                      Access billing portal to manage your subscription anytime
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-sm font-semibold text-blue-600">
                      3
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Get Support</p>
                    <p className="text-sm text-gray-600">
                      Reach out if you have any questions or need assistance
                    </p>
                  </div>
                </div>
              </div>
            </MotionDiv>

            {/* Action Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <Button asChild className="flex-1" size="lg">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link href="/subscription">Manage Subscription</Link>
              </Button>
            </MotionDiv>

            {/* Email Confirmation */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center pt-4 border-t border-gray-200"
            >
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to{" "}
                <span className="font-medium text-gray-900">{user.email}</span>
              </p>
            </MotionDiv>
          </CardContent>
        </Card>
      </MotionDiv>
    </div>
  );
};
