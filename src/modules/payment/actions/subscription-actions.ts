"use server";

// Import to register providers
import "../providers";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";

import { PaymentService } from "../services/payment-service";
import { SubscriptionPlan } from "../types/payment";
import { createCheckoutUrls } from "../utils";

/**
 * Create a subscription checkout session
 */
export async function createSubscriptionAction(
  plan: SubscriptionPlan,
  interval: 'month' | 'year'
): Promise<{ success: true; checkoutUrl: string } | { success: false; error: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Please sign in to continue" };
    }

    // Don't create subscription for free plan
    if (plan === 'free') {
      return { success: false, error: "Free plan doesn't require payment" };
    }

    const paymentService = new PaymentService();
    const baseUrl = siteConfig.url;
    
    const urls = createCheckoutUrls(baseUrl, plan);
    
    const trialDays = getTrialDays(plan);
    console.log(`[DEBUG] Creating subscription for plan: ${plan}, trialDays: ${trialDays}`);
    
    const subscriptionParams = {
      userId: session.user.id,
      plan,
      interval,
      successUrl: urls.successUrl,
      cancelUrl: urls.cancelUrl,
      trialDays: trialDays
    };
    
    console.log('[DEBUG] Subscription params:', JSON.stringify(subscriptionParams, null, 2));
    
    const subscriptionResponse = await paymentService.createSubscription(subscriptionParams);

    if (subscriptionResponse.checkoutUrl) {
      return { success: true, checkoutUrl: subscriptionResponse.checkoutUrl };
    }

    return { success: false, error: "No checkout URL received" };
  } catch (error: any) {
    console.error("Failed to create subscription:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Cancel current subscription
 */
export async function cancelSubscriptionAction(cancelAtPeriodEnd: boolean = true) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      redirect("/sign-in");
    }

    const paymentService = new PaymentService();
    const subscription = await paymentService.getUserSubscription(session.user.id);
    
    if (!subscription) {
      throw new Error("No active subscription found");
    }

    await paymentService.cancelSubscription(subscription.id, cancelAtPeriodEnd);
    
    return {
      success: true,
      message: cancelAtPeriodEnd 
        ? "Subscription will be canceled at the end of the billing period" 
        : "Subscription has been canceled immediately"
    };
  } catch (error: any) {
    console.error("Failed to cancel subscription:", error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Create billing portal session
 */
export async function createBillingPortalAction() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      redirect("/sign-in");
    }

    const paymentService = new PaymentService();
    const returnUrl = `${siteConfig.url}/subscription`;
    
    const portalSession = await paymentService.createBillingPortalSession(
      session.user.id,
      returnUrl
    );

    redirect(portalSession.url);
  } catch (error: any) {
    console.error("Failed to create billing portal:", error);
    throw new Error(`Failed to access billing portal: ${error.message}`);
  }
}

/**
 * Get current user subscription
 */
export async function getCurrentSubscriptionAction() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return null;
    }

    const paymentService = new PaymentService();
    return await paymentService.getUserSubscription(session.user.id);
  } catch (error: any) {
    console.error("Failed to get subscription:", error);
    return null;
  }
}

/**
 * Helper function to get trial days for plan
 */
function getTrialDays(plan: SubscriptionPlan): number {
  const trialDays = {
    free: 0,
    starter: 0,
    pro: 0,
    credits_pack: 0
  };
  return trialDays[plan] || 0;
}