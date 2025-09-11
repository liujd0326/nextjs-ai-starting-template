"use server";

// Import to register providers
import "../providers";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { siteConfig } from "@/config/site";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

import { PaymentService } from "../services/payment-service";
import { SubscriptionPlan } from "../types/payment";
import { createCheckoutUrls } from "../utils";

/**
 * Create a subscription checkout session
 */
export async function createSubscriptionAction(
  plan: SubscriptionPlan,
  interval: "month" | "year"
): Promise<
  { success: true; checkoutUrl: string } | { success: false; error: string }
> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Please sign in to continue" };
    }

    // Don't create subscription for free plan
    if (plan === "free") {
      return { success: false, error: "Free plan doesn't require payment" };
    }

    // Get current user plan to check for downgrades
    const [userInfo] = await db
      .select({
        currentPlan: user.currentPlan,
      })
      .from(user)
      .where(eq(user.id, session.user.id));

    if (userInfo) {
      // Helper function to get plan level
      const getPlanLevel = (planName: string): number => {
        switch (planName) {
          case "free":
            return 0;
          case "starter":
            return 1;
          case "pro":
            return 2;
          case "credits_pack":
            return 1; // Same level as starter
          default:
            return 0;
        }
      };

      const currentLevel = getPlanLevel(userInfo.currentPlan);
      const targetLevel = getPlanLevel(plan);

      // Prevent downgrades for subscription plans
      if (currentLevel > targetLevel && plan !== "credits_pack") {
        return {
          success: false,
          error:
            "Downgrade not allowed. Please cancel your current subscription first.",
        };
      }
    }

    const paymentService = new PaymentService();
    const baseUrl = siteConfig.url;

    const urls = createCheckoutUrls(baseUrl, plan);

    const trialDays = getTrialDays(plan);
    console.log(
      `[DEBUG] Creating subscription for plan: ${plan}, trialDays: ${trialDays}`
    );

    const subscriptionParams = {
      userId: session.user.id,
      plan,
      interval,
      successUrl: urls.successUrl,
      cancelUrl: urls.cancelUrl,
      trialDays: trialDays,
    };

    console.log(
      "[DEBUG] Subscription params:",
      JSON.stringify(subscriptionParams, null, 2)
    );

    const subscriptionResponse =
      await paymentService.createSubscription(subscriptionParams);

    if (subscriptionResponse.checkoutUrl) {
      return { success: true, checkoutUrl: subscriptionResponse.checkoutUrl };
    }

    return { success: false, error: "No checkout URL received" };
  } catch (error: unknown) {
    console.error("Failed to create subscription:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error instanceof Error
            ? error.message
            : "Unknown error"
          : "Unknown error",
    };
  }
}

/**
 * Cancel current subscription
 */
export async function cancelSubscriptionAction(
  cancelAtPeriodEnd: boolean = true
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      redirect("/sign-in");
    }

    const paymentService = new PaymentService();
    const subscription = await paymentService.getUserSubscription(
      session.user.id
    );

    if (!subscription) {
      throw new Error("No active subscription found");
    }

    // Check if subscription ID is invalid (e.g., checkout session ID)
    if (!subscription.providerSubscriptionId.startsWith("sub_")) {
      console.warn(
        `Invalid subscription ID detected: ${subscription.providerSubscriptionId}. Updating user plan directly.`
      );

      // Import db and user directly
      const { db } = await import("@/db");
      const { user } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");

      // Update user plan to free and reset credits
      await db
        .update(user)
        .set({
          currentPlan: "free",
          monthlyCredits: 0,
          creditsResetDate: null,
          updatedAt: new Date(),
        })
        .where(eq(user.id, session.user.id));

      return {
        success: true,
        message: "Subscription has been canceled and plan updated to free",
      };
    }

    await paymentService.cancelSubscription(subscription.id, cancelAtPeriodEnd);

    return {
      success: true,
      message: cancelAtPeriodEnd
        ? "Subscription will be canceled at the end of the billing period"
        : "Subscription has been canceled immediately",
    };
  } catch (error: unknown) {
    console.error("Failed to cancel subscription:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
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
  } catch (error: unknown) {
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
    credits_pack: 0,
  };
  return trialDays[plan] || 0;
}
