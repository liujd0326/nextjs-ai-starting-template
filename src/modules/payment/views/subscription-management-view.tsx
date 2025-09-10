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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
              Subscription Management
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage your subscription, billing, and usage all in one place
            </p>
          </div>
        </MotionDiv>

        {/* Current Plan */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-xl">
                    <CreditCard className="w-6 h-6 mr-3 text-indigo-600" />
                    Current Plan
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    Your active subscription details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          
          <CardContent className="space-y-6">
            {subscription || (user.currentPlan && user.currentPlan !== 'free') ? (
              <>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Plan</p>
                    <p className="text-2xl font-bold capitalize">{subscription?.plan || user.currentPlan}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold">
                      {subscription 
                        ? `${formatPrice(subscription.amount, subscription.currency)}/${subscription.interval}`
                        : 'Credit-based'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Billing</p>
                    <p className="text-lg font-semibold">
                      {subscription 
                        ? getNextBillingDate(new Date(subscription.currentPeriodEnd))
                        : 'No billing cycle'}
                    </p>
                  </div>
                </div>

                {/* Cancellation Warning */}
                {subscription && subscription.cancelAtPeriodEnd && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your subscription is scheduled to cancel on{" "}
                      {getNextBillingDate(new Date(subscription.currentPeriodEnd))}.
                      You&apos;ll still have access to all features until then.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button asChild variant="default" className="flex-1">
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
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Billing Portal
                    </Button>
                  )}
                  
                  {/* Show cancel button if user has any paid plan (subscription or credit-based) */}
                  {(user.currentPlan && user.currentPlan !== 'free') && (
                    <Button
                      onClick={handleCancelSubscription}
                      disabled={isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 px-6">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Active Subscription</h3>
                  <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
                    You&apos;re currently on the free plan with <span className="font-semibold text-indigo-600">{(user.monthlyCredits || 0) + (user.purchasedCredits || 0)} total credits</span>.
                  </p>
                </div>
                <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  <a href="/pricing">
                    <Zap className="w-5 h-5 mr-2" />
                    Upgrade Now
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </MotionDiv>

        {/* Usage Overview */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl">
                <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
                Usage Overview
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Your current month&apos;s usage statistics
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -translate-y-10 translate-x-10"></div>
                  <p className="text-3xl font-bold text-blue-700 mb-2">
                    {(user.monthlyCredits || 0) + (user.purchasedCredits || 0)}
                  </p>
                  <p className="text-sm font-medium text-blue-800">Total Credits</p>
                </div>
                
                <div className="relative overflow-hidden text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -translate-y-10 translate-x-10"></div>
                  <p className="text-3xl font-bold text-green-700 mb-2">
                    {user.purchasedCredits || 0}
                  </p>
                  <p className="text-sm font-medium text-green-800">Purchased Credits</p>
                </div>
                
                <div className="relative overflow-hidden text-center p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl border border-purple-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -translate-y-10 translate-x-10"></div>
                  <p className="text-3xl font-bold text-purple-700 mb-2">
                    {user.monthlyCredits || 0}
                  </p>
                  <p className="text-sm font-medium text-purple-800">Monthly Allowance</p>
                </div>
              </div>
              
              {((user.monthlyCredits || 0) + (user.purchasedCredits || 0)) < 10 && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mr-3" />
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
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl">
                <Settings className="w-6 h-6 mr-3 text-indigo-600" />
                Account Information
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Your account details and settings
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/50">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Name</p>
                  <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/50">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-muted-foreground">
                  Need to update your account information? Contact our support team for assistance.
                </p>
              </div>
            </CardContent>
          </Card>
        </MotionDiv>
      </div>
    </div>
  );
};