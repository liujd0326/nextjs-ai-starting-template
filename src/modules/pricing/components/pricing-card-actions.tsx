"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { Button } from "@/components/ui/button";
import { PricingPlan } from "@/config/site";
import { createCreditPackagePaymentAction } from "@/modules/payment/actions/payment-actions";
import { createSubscriptionAction } from "@/modules/payment/actions/subscription-actions";
import { SubscriptionPlan } from "@/modules/payment/types/payment";

interface PricingCardActionsProps {
  plan: PricingPlan;
  isYearly: boolean;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const PricingCardActions = ({ 
  plan, 
  isYearly, 
  className, 
  variant 
}: PricingCardActionsProps) => {
  // const router = useRouter(); // Removed for now
  const [isPending, startTransition] = useTransition();
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const handleSubscription = async () => {
    startTransition(async () => {
      try {
        let result;
        
        // Handle Enterprise plan as one-time payment
        if (plan.name === "Enterprise") {
          result = await createCreditPackagePaymentAction();
        } else {
          // Convert plan name to subscription plan type
          const subscriptionPlan = plan.name.toLowerCase() as SubscriptionPlan;
          const interval = isYearly ? 'year' : 'month';
          result = await createSubscriptionAction(subscriptionPlan, interval);
        }
        
        if (result.success) {
          // Redirect to Stripe Checkout
          window.location.href = result.checkoutUrl;
        } else {
          // Check if error is due to authentication
          if (result.error === "Please sign in to continue") {
            setShowSignInDialog(true);
          } else {
            toast.error("Failed to start checkout", {
              description: result.error
            });
          }
        }
      } catch (error: unknown) {
        toast.error("Failed to start checkout", {
          description: (error as Error).message || "Please try again later."
        });
      }
    });
  };

  // Free plan - redirect to sign up
  if (plan.free) {
    return (
      <Button
        asChild
        className={className}
        variant={variant}
      >
        <Link href="/sign-in">
          {plan.buttonText}
        </Link>
      </Button>
    );
  }

  // All paid plans - create subscription or one-time payment
  return (
    <>
      <Button
        onClick={handleSubscription}
        disabled={isPending}
        className={className}
        variant={variant}
      >
        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isPending ? "Processing..." : plan.buttonText}
      </Button>

      <SignInDialog
        open={showSignInDialog}
        onOpenChange={setShowSignInDialog}
        callbackURL="/pricing"
        onSuccess={() => {
          // 登录成功后重新尝试支付
          setShowSignInDialog(false);
          setTimeout(() => {
            handleSubscription();
          }, 1000); // 延迟1秒确保认证状态已更新
        }}
      />
    </>
  );
};