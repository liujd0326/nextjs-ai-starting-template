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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your subscription, billing, and usage
            </p>
          </div>
          
        </div>
      </MotionDiv>

      {/* Current Plan */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Current Plan
                </CardTitle>
                <CardDescription>
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
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
                <p className="text-muted-foreground mb-4">
                  You&apos;re currently on the free plan with {(user.monthlyCredits || 0) + (user.purchasedCredits || 0)} total credits.
                </p>
                <Button asChild>
                  <a href="/pricing">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Usage Overview
            </CardTitle>
            <CardDescription>
              Your current month&apos;s usage statistics
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {(user.monthlyCredits || 0) + (user.purchasedCredits || 0)}
                </p>
                <p className="text-sm text-blue-800">Total Credits</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {user.purchasedCredits || 0}
                </p>
                <p className="text-sm text-green-800">Purchased Credits</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {user.monthlyCredits || 0}
                </p>
                <p className="text-sm text-purple-800">Monthly Allowance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Account Information */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details and settings
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-lg">{user.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>
    </div>
  );
};