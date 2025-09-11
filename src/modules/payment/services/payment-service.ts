// Import to register providers
import "../providers";

import { and, desc,eq } from "drizzle-orm";

import { db } from "@/db";
import { payments, subscriptions, user, userCredits } from "@/db/schema";

import { getDefaultProvider,getProviderConfig, PaymentProviderFactory } from "../providers/provider-factory";
import {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  PaymentProvider,
  PaymentStatus,
  SubscriptionPlan,
  SubscriptionStatus} from "../types/payment";

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
  async createSubscription(request: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> {
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
        metadata: { userId: request.userId }
      });
      customerId = customerResponse.customerId;
    } catch (error: any) {
      // Customer might already exist, try to get existing customer
      throw new Error(`Failed to create customer: ${error.message}`);
    }

    // Create subscription checkout session with provider
    const subscriptionResponse = await paymentProvider.createSubscription({
      ...request,
      customerId
    } as any);

    // Note: Do NOT create subscription record here!
    // The actual subscription will be created by the webhook when payment is completed
    // subscriptionResponse.subscriptionId is actually a checkout session ID, not a subscription ID

    return subscriptionResponse;
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<void> {
    const config = getProviderConfig(this.provider);
    const paymentProvider = PaymentProviderFactory.createProvider(config);

    // Get subscription from database
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, subscriptionId));

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    // Cancel with provider
    await paymentProvider.cancelSubscription({
      subscriptionId: subscription.providerSubscriptionId,
      cancelAtPeriodEnd
    });

    // Update subscription in database
    await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd,
        canceledAt: cancelAtPeriodEnd ? undefined : new Date(),
        status: cancelAtPeriodEnd ? subscription.status : 'canceled',
        updatedAt: new Date()
      })
      .where(eq(subscriptions.id, subscriptionId));
  }

  /**
   * Get user's current subscription
   */
  async getUserSubscription(userId: string) {
    // Only get active subscriptions
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, 'active')
        )
      )
      .orderBy(desc(subscriptions.createdAt));

    return subscription || null;
  }

  /**
   * Update user's plan after successful payment
   */
  async updateUserPlan(userId: string, plan: SubscriptionPlan): Promise<void> {
    const planCredits = this.getPlanCredits(plan);

    await db
      .update(user)
      .set({
        currentPlan: plan,
        monthlyCredits: planCredits.monthly,
        creditsResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        updatedAt: new Date()
      })
      .where(eq(user.id, userId));
  }

  /**
   * Add credits to user account
   */
  async addUserCredits(
    userId: string, 
    amount: number, 
    type: string = 'subscription',
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
      resetDate: type === 'monthly_reset' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
        : undefined
    });

    // Note: user_credits table is for tracking history only
    // Actual credit amounts are managed in user.monthlyCredits and user.purchasedCredits
    // This is handled separately in the webhook handlers
    console.log(`[DEBUG] Credit record created for user ${userId}: ${amount} credits (${type})`);
  }

  /**
   * Get plan pricing information
   */
  private getPlanPricing(plan: SubscriptionPlan, interval: 'month' | 'year') {
    const pricing = {
      free: { monthly: 0, yearly: 0 },
      starter: { monthly: 999, yearly: 9990 }, // $9.99, $99.90
      pro: { monthly: 1999, yearly: 19990 }, // $19.99, $199.90
      credits_pack: { monthly: 3499, yearly: 3499 } // $34.99 one-time
    };

    return {
      amount: interval === 'month' ? pricing[plan].monthly : pricing[plan].yearly,
      currency: 'usd'
    };
  }

  /**
   * Get plan credits allocation
   */
  private getPlanCredits(plan: SubscriptionPlan) {
    const credits = {
      free: { monthly: 0 },
      starter: { monthly: 100 },
      pro: { monthly: 500 },
      credits_pack: { monthly: 1000 } // 1000 credits
    };

    return credits[plan];
  }

}