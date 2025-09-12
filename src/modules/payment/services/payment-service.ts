// Import to register providers
import "../providers";

import { eq } from "drizzle-orm";

import { getPlanCredits, siteConfig } from "@/config/site";
import { db } from "@/db";
import { user, userCredits } from "@/db/schema";

import {
  getDefaultProvider,
  getProviderConfig,
  PaymentProviderFactory,
} from "../providers/provider-factory";
import {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  PaymentProvider,
  SubscriptionPlan,
} from "../types/payment";

/**
 * High-level payment service that orchestrates payment operations
 * This service handles business logic and coordinates between providers and database
 */
export class PaymentService {
  private provider: PaymentProvider;

  constructor(provider?: PaymentProvider) {
    this.provider = provider || getDefaultProvider();
  }

  /**
   * Create a new subscription for a user
   */
  async createSubscription(
    request: CreateSubscriptionRequest
  ): Promise<CreateSubscriptionResponse> {
    const config = getProviderConfig(this.provider);
    const paymentProvider = PaymentProviderFactory.createProvider(config);

    // Get user data
    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, request.userId));

    if (!userData) {
      throw new Error("User not found");
    }

    // Create customer if not exists
    let customerId: string;
    try {
      const customerResponse = await paymentProvider.createCustomer({
        userId: request.userId,
        email: userData.email,
        name: userData.name,
        metadata: { userId: request.userId },
      });
      customerId = customerResponse.customerId;
    } catch (error: unknown) {
      // Customer might already exist, try to get existing customer
      throw new Error(
        `Failed to create customer: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Create subscription checkout session with provider
    const subscriptionResponse = await paymentProvider.createSubscription({
      ...request,
      customerId,
    } as CreateSubscriptionRequest & { customerId: string });

    // Note: Do NOT create subscription record here!
    // The actual subscription will be created by the webhook when payment is completed
    // subscriptionResponse.subscriptionId is actually a checkout session ID, not a subscription ID

    return subscriptionResponse;
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(
    stripeSubscriptionId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<void> {
    const config = getProviderConfig(this.provider);
    const paymentProvider = PaymentProviderFactory.createProvider(config);

    // Cancel with provider directly
    await paymentProvider.cancelSubscription({
      subscriptionId: stripeSubscriptionId,
      cancelAtPeriodEnd,
    });

    // The webhook will handle updating the user status when cancellation is processed
  }

  /**
   * Get user's current subscription status
   */
  async getUserSubscription(userId: string) {
    // Get user's current plan and Stripe subscription info
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId));

    if (!userRecord || !userRecord.stripeSubscriptionId) {
      return null;
    }

    // Get real-time subscription status from Stripe
    let stripeSubscription = null;
    let subscriptionStatus = "active";
    let actualCancelAtPeriodEnd = userRecord.cancelAtPeriodEnd || false;

    try {
      const config = getProviderConfig(this.provider);
      const paymentProvider = PaymentProviderFactory.createProvider(config);
      const stripe = (paymentProvider as { stripe: import("stripe") }).stripe;

      stripeSubscription = await stripe.subscriptions.retrieve(
        userRecord.stripeSubscriptionId
      );

      subscriptionStatus = stripeSubscription.status;
      actualCancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;

      // Update local database if the cancellation status doesn't match
      if (actualCancelAtPeriodEnd !== userRecord.cancelAtPeriodEnd) {
        await db
          .update(user)
          .set({
            cancelAtPeriodEnd: actualCancelAtPeriodEnd,
            updatedAt: new Date(),
          })
          .where(eq(user.id, userId));
      }
    } catch (error) {
      console.error("Failed to fetch subscription from Stripe:", error);
      // Fall back to database values
      subscriptionStatus = "active";
    }

    // Safely handle period end date
    let currentPeriodEndIso = "";
    if (stripeSubscription?.current_period_end) {
      try {
        const periodEndDate = new Date(stripeSubscription.current_period_end * 1000);
        if (!isNaN(periodEndDate.getTime())) {
          currentPeriodEndIso = periodEndDate.toISOString();
        }
      } catch (error) {
        console.error("Failed to parse current_period_end:", error);
      }
    }
    
    // Fallback to database value if Stripe date is invalid
    if (!currentPeriodEndIso && userRecord.creditsResetDate) {
      try {
        currentPeriodEndIso = userRecord.creditsResetDate.toISOString();
      } catch (error) {
        console.error("Failed to parse creditsResetDate:", error);
      }
    }

    return {
      id: userRecord.stripeSubscriptionId,
      plan: userRecord.currentPlan,
      status: subscriptionStatus,
      amount: userRecord.subscriptionAmount || 0,
      currency: userRecord.subscriptionCurrency || "USD",
      interval: userRecord.subscriptionInterval || "month",
      currentPeriodEnd: currentPeriodEndIso,
      cancelAtPeriodEnd: actualCancelAtPeriodEnd,
      monthlyCredits: userRecord.monthlyCredits,
      creditsResetDate: userRecord.creditsResetDate,
    };
  }

  /**
   * Update user's plan after successful payment
   */
  async updateUserPlan(userId: string, plan: SubscriptionPlan): Promise<void> {
    const planConfig = siteConfig.pricing[plan];
    const planCredits = getPlanCredits(planConfig);

    await db
      .update(user)
      .set({
        currentPlan: plan,
        monthlyCredits: planCredits,
        creditsResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
  }

  /**
   * Add credits to user account
   */
  async addUserCredits(
    userId: string,
    amount: number,
    type: string = "subscription",
    source?: string,
    description?: string
  ): Promise<void> {
    await db.insert(userCredits).values({
      id: `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      amount,
      remaining: amount,
      source,
      description,
      resetDate:
        type === "monthly_reset"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : undefined,
    });

    // Note: user_credits table is for tracking history only
    // Actual credit amounts are managed in user.monthlyCredits and user.purchasedCredits
    // This is handled separately in the webhook handlers
    console.log(
      `[DEBUG] Credit record created for user ${userId}: ${amount} credits (${type})`
    );
  }

  /**
   * Get plan pricing information
   */
  private getPlanPricing(plan: SubscriptionPlan, _interval: "month" | "year") {
    const planConfig = siteConfig.pricing[plan];
    const amount = Math.round(planConfig.price * 100); // Convert to cents

    return {
      amount,
      currency: planConfig.currency.toLowerCase(),
    };
  }

  /**
   * Create billing portal session for customer
   */
  async createBillingPortalSession(customerId: string, returnUrl: string) {
    const config = getProviderConfig(this.provider);
    const paymentProvider = PaymentProviderFactory.createProvider(config);
    return await paymentProvider.createBillingPortalSession(
      customerId,
      returnUrl
    );
  }
}
