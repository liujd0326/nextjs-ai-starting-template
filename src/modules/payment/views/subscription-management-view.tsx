"use client";

import { AlertTriangle, Calendar, CreditCard, ExternalLink, Settings, Users, Zap } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { MotionDiv } from "@/components/motion-wrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { cancelSubscriptionAction, createBillingPortalAction } from "../actions/subscription-actions";
import { formatSubscriptionStatus, getNextBillingDate } from "../utils";

interface User {
  id: string;
  name: string;
  email: string;
  currentPlan?: string;
  monthlyCredits?: number;
  purchasedCredits?: number;
}

interface Subscription {
  id: string;
  plan: string;
  status: string;
  amount: number;
  currency: string;
  interval: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
}

interface SubscriptionManagementViewProps {
  user: User;
  subscription?: Subscription | null;
}

export const SubscriptionManagementView = ({ 
  user, 
  subscription 
}: SubscriptionManagementViewProps) => {
  const [isPending, startTransition] = useTransition();

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll still have access until the end of your billing period.")) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await cancelSubscriptionAction(true);
        if (result.success) {
          toast.success("Subscription canceled", {
            description: result.message
          });
          // Refresh page to show updated status
          window.location.reload();
        } else {
          toast.error("Failed to cancel subscription", {
            description: result.message
          });
        }
      } catch (error) {
        toast.error("Error canceling subscription", {
          description: error instanceof Error ? error.message : "Unknown error"
        });
      }
    });
  };

  const handleBillingPortal = () => {
    startTransition(async () => {
      try {
        await createBillingPortalAction();
      } catch (error) {
        toast.error("Failed to open billing portal", {
          description: error instanceof Error ? error.message : "Unknown error"
        });
      }
    });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-12 space-y-12">
        {/* Welcome Header */}
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 md:p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">
                Subscription Management 💎
              </h1>
              <p className="text-lg text-emerald-100">
                Manage your subscription, billing, and usage all in one place
              </p>
            </div>
          </div>
        </MotionDiv>

        <div className="space-y-8">
          {/* Current Plan - Full Width */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-emerald-600" />
                  Current Plan
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your active subscription details
                </CardDescription>
              </CardHeader>
            
              <CardContent>
                {subscription || (user.currentPlan && user.currentPlan !== 'free') ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex justify-between items-center md:flex-col md:items-center md:text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-sm font-medium text-gray-600 md:mb-2">Plan</span>
                        <span className="text-xl font-bold text-emerald-700 capitalize">{subscription?.plan || user.currentPlan}</span>
                      </div>
                      
                      {subscription && (
                        <>
                          <div className="flex justify-between items-center md:flex-col md:items-center md:text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <span className="text-sm font-medium text-gray-600 md:mb-2">Price</span>
                            <span className="text-xl font-bold text-gray-900">
                              {formatPrice(subscription.amount, subscription.currency)}/{subscription.interval}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center md:flex-col md:items-center md:text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <span className="text-sm font-medium text-gray-600 md:mb-2">Next Billing</span>
                            <span className="text-lg font-semibold text-gray-900">
                              {getNextBillingDate(new Date(subscription.currentPeriodEnd))}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Cancellation Warning */}
                    {subscription && subscription.cancelAtPeriodEnd && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Your subscription is scheduled to cancel on{" "}
                          {getNextBillingDate(new Date(subscription.currentPeriodEnd))}.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                      <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <a href="/pricing">
                          <Zap className="w-4 h-4 mr-2" />
                          Upgrade Plan
                        </a>
                      </Button>

                      {subscription && (
                        <Button
                          onClick={handleBillingPortal}
                          disabled={isPending}
                          variant="outline"
                          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Billing Portal
                        </Button>
                      )}
                      
                      {(user.currentPlan && user.currentPlan !== 'free') && (
                        <Button
                          onClick={handleCancelSubscription}
                          disabled={isPending}
                          variant="destructive"
                        >
                          Cancel Subscription
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Subscription</h3>
                    <p className="text-gray-600 mb-6">
                      You&apos;re on the free plan with <span className="font-semibold text-emerald-600">{(user.monthlyCredits || 0) + (user.purchasedCredits || 0)} total credits</span>.
                    </p>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <a href="/pricing">
                        <Zap className="w-4 h-4 mr-2" />
                        Upgrade Now
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </MotionDiv>

          {/* Bottom Row - Two Cards Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Usage Overview */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-emerald-600" />
                    Usage Overview
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Your current usage statistics
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300">
                      <p className="text-4xl font-bold text-white mb-1">
                        {(user.monthlyCredits || 0) + (user.purchasedCredits || 0)}
                      </p>
                      <p className="text-emerald-100 text-sm font-medium">Total Credits</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.12)] hover:bg-white transition-all duration-300 border border-white/50">
                        <p className="text-2xl font-bold text-gray-800 mb-1">
                          {user.purchasedCredits || 0}
                        </p>
                        <p className="text-emerald-600 text-sm font-medium">Purchased</p>
                      </div>
                      
                      <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.12)] hover:bg-white transition-all duration-300 border border-white/50">
                        <p className="text-2xl font-bold text-gray-800 mb-1">
                          {user.monthlyCredits || 0}
                        </p>
                        <p className="text-emerald-600 text-sm font-medium">Monthly</p>
                      </div>
                    </div>
                  </div>
                  
                  {((user.monthlyCredits || 0) + (user.purchasedCredits || 0)) < 10 && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Low Credit Balance</p>
                          <p className="text-xs text-amber-700 mt-1">Consider upgrading your plan or purchasing additional credits.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </MotionDiv>

            {/* Account Information */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Settings className="h-6 w-6 text-emerald-600" />
                    Account Information
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Your account details
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 flex flex-col h-full">
                  <div className="grid grid-cols-1 gap-4 flex-grow">
                    <div className="p-4 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 backdrop-blur-sm rounded-xl shadow-[0_4px_20px_rgb(5,150,105,0.08)] hover:shadow-[0_6px_25px_rgb(5,150,105,0.12)] transition-all duration-300 border border-emerald-100/30">
                      <p className="text-sm font-semibold text-emerald-700 mb-1">Name</p>
                      <p className="text-xl font-bold text-gray-900">{user.name}</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 backdrop-blur-sm rounded-xl shadow-[0_4px_20px_rgb(5,150,105,0.08)] hover:shadow-[0_6px_25px_rgb(5,150,105,0.12)] transition-all duration-300 border border-emerald-100/30">
                      <p className="text-sm font-semibold text-emerald-700 mb-1">Email</p>
                      <p className="text-lg font-semibold text-gray-900 break-all">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-emerald-100/50 mt-auto">
                    <p className="text-sm text-gray-600 text-center">
                      Need to update your account? Contact our support team.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </MotionDiv>
          </div>
        </div>
    </div>
  );
};