// Initialize payment providers
import "@/modules/payment/providers";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getPlanCredits, siteConfig } from "@/config/site";
import { db } from "@/db";
import { user, userCredits, webhookEvents } from "@/db/schema";
import {
  getProviderConfig,
  PaymentProviderFactory,
} from "@/modules/payment/providers";
import { PaymentService } from "@/modules/payment/services/payment-service";

/**
 * Stripe Webhook Handler
 * Handles all Stripe webhook events for subscriptions and payments
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Initialize Stripe provider
    const config = getProviderConfig("stripe");
    const stripeProvider = PaymentProviderFactory.createProvider(config);

    // Verify webhook signature
    if (!stripeProvider.verifyWebhook(body, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Parse webhook event
    const webhookEvent = stripeProvider.parseWebhookEvent(body);

    // Check if event already processed
    const existingEvent = await db
      .select()
      .from(webhookEvents)
      .where(
        and(
          eq(webhookEvents.eventId, webhookEvent.id),
          eq(webhookEvents.provider, "stripe")
        )
      );

    if (existingEvent.length > 0) {
      console.log(`Event ${webhookEvent.id} already processed`);
      return NextResponse.json({ received: true });
    }

    // Store webhook event
    await db.insert(webhookEvents).values({
      id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider: "stripe",
      eventType: webhookEvent.type,
      eventId: webhookEvent.id,
      data: JSON.stringify(webhookEvent.data),
      processed: false,
    });

    // Process the webhook event
    const result = await processStripeWebhook(webhookEvent);

    // Update webhook event status
    await db
      .update(webhookEvents)
      .set({
        processed: true,
        processedAt: new Date(),
        processingError: result.error || null,
      })
      .where(eq(webhookEvents.eventId, webhookEvent.id));

    if (result.error) {
      console.error(`Webhook processing error: ${result.error}`);
      return NextResponse.json({ error: "Processing error" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }
}

/**
 * Process Stripe webhook events
 */
async function processStripeWebhook(webhookEvent: {
  type: string;
  data: { object: unknown };
  id: string;
}) {
  const paymentService = new PaymentService("stripe");

  try {
    switch (webhookEvent.type) {
      case "checkout.session.completed":
        console.log("Processing checkout session completion");
        await handleCheckoutCompleted(webhookEvent.data.object, paymentService);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(webhookEvent.data.object, paymentService);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(webhookEvent.data.object, paymentService);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          webhookEvent.data.object,
          paymentService
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          webhookEvent.data.object,
          paymentService
        );
        break;

      case "customer.subscription.created":
        console.log("Subscription created - handled in checkout completion");
        break;

      default:
        console.log(`Unhandled event type: ${webhookEvent.type}`);
    }

    return { success: true };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutCompleted(
  session: Record<string, unknown>,
  paymentService: PaymentService
) {
  console.log("Processing checkout completion:", session.id);

  const userId = session.metadata?.userId;
  const type = session.metadata?.type;
  const credits = session.metadata?.credits;
  const plan = session.metadata?.plan;

  if (!userId) {
    throw new Error("Missing userId in checkout session metadata");
  }

  // Handle one-time payment (credit purchase)
  if (session.mode === "payment" && type === "credit_purchase" && credits) {
    console.log(
      `One-time payment completed for user ${userId}, adding ${credits} credits`
    );

    // 从配置获取 Credits Pack 积分数
    const creditsPackConfig = siteConfig.pricing.credits_pack;
    const creditAmount = getPlanCredits(creditsPackConfig);

    // Add credits to user account
    await db.insert(userCredits).values({
      id: `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      type: "one_time_purchase",
      amount: creditAmount,
      remaining: creditAmount,
      source: session.payment_intent || session.id,
      description: `Purchased ${creditAmount} credits - Never expires`,
    });

    // Update user's purchased credits
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId));

    if (existingUser.length > 0) {
      const currentPurchasedCredits = existingUser[0].purchasedCredits || 0;
      await db
        .update(user)
        .set({
          purchasedCredits: currentPurchasedCredits + creditAmount,
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId));
    }

    console.log(`Added ${creditAmount} credits to user ${userId}`);
    return;
  }

  // Handle subscription checkout
  if (session.mode === "subscription" && session.subscription && plan) {
    console.log(`Subscription checkout completed: ${session.subscription}`);

    // Get plan config for credits calculation
    const planConfig =
      siteConfig.pricing[plan as keyof typeof siteConfig.pricing];

    // Get actual subscription details from Stripe API
    const config = getProviderConfig("stripe");
    const stripeProvider = PaymentProviderFactory.createProvider(config);
    const stripe = (stripeProvider as { stripe: import("stripe") }).stripe;

    try {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const subscriptionItem = subscription.items.data[0];
      const subscriptionAmount = subscriptionItem.price.unit_amount; // already in cents
      const subscriptionCurrency =
        subscriptionItem.price.currency.toUpperCase();
      const subscriptionInterval = subscriptionItem.price.recurring.interval;

      console.log(`[DEBUG] Real Stripe subscription details:`, {
        subscriptionId: subscription.id,
        subscriptionAmount,
        subscriptionCurrency,
        subscriptionInterval,
        priceId: subscriptionItem.price.id,
        plan,
      });

      // Update user's plan and Stripe IDs
      await paymentService.updateUserPlan(userId, plan);

      // Store Stripe subscription ID and details
      await db
        .update(user)
        .set({
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          subscriptionAmount: subscriptionAmount,
          subscriptionCurrency: subscriptionCurrency,
          subscriptionInterval: subscriptionInterval,
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

      console.log(
        `Updated user ${userId} to plan ${plan} with Stripe subscription ${session.subscription} - Amount: ${subscriptionAmount} ${subscriptionCurrency}/${subscriptionInterval}`
      );

      // Create initial user_credits record for tracking
      const creditsAmount = getPlanCredits(planConfig);
      await db.insert(userCredits).values({
        id: `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        type: "initial_grant",
        amount: creditsAmount,
        remaining: creditsAmount,
        source: session.subscription as string,
        description: `Initial credits for ${plan} plan subscription`,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });

      console.log(
        `Created initial user_credits record for user ${userId}: ${creditsAmount} credits`
      );
    } catch (error) {
      console.error(
        `Failed to retrieve subscription details from Stripe:`,
        error
      );
      // Fallback to config-based pricing if Stripe API call fails
      const planConfig =
        siteConfig.pricing[plan as keyof typeof siteConfig.pricing];
      const fallbackAmount = Math.round(planConfig.price * 100);

      await paymentService.updateUserPlan(userId, plan);
      await db
        .update(user)
        .set({
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          subscriptionAmount: fallbackAmount,
          subscriptionCurrency: planConfig.currency.toUpperCase(),
          subscriptionInterval: session.metadata?.interval || "month",
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

      // Create initial user_credits record for tracking (fallback)
      const creditsAmount = getPlanCredits(planConfig);
      await db.insert(userCredits).values({
        id: `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        type: "initial_grant",
        amount: creditsAmount,
        remaining: creditsAmount,
        source: session.subscription as string,
        description: `Initial credits for ${plan} plan subscription (fallback)`,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      console.log(
        `Used fallback pricing for user ${userId}, created credits record: ${creditsAmount} credits`
      );
    }
    return;
  }

  console.log(
    `Unhandled checkout session mode: ${session.mode}, type: ${type}`
  );
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(
  invoice: Record<string, unknown>,
  paymentService: PaymentService
) {
  console.log("Processing payment success for invoice:", invoice.id);

  // 添加详细的调试日志来查看 invoice 对象的完整结构
  console.log("[DEBUG] Complete invoice object:", {
    id: invoice.id,
    subscription: invoice.subscription,
    subscription_id: invoice.subscription_id,
    customer: invoice.customer,
    amount_paid: invoice.amount_paid,
    currency: invoice.currency,
    billing_reason: invoice.billing_reason,
    lines: invoice.lines,
    subscription_details: invoice.subscription_details,
    keys: Object.keys(invoice),
  });

  // 尝试从多个可能的字段获取 subscription ID
  let subscriptionId =
    invoice.subscription ||
    invoice.subscription_id ||
    invoice.lines?.data?.[0]?.subscription ||
    null;

  const customerId = invoice.customer;

  console.log("[DEBUG] Extracted subscription ID:", subscriptionId);
  console.log("[DEBUG] Customer ID:", customerId);

  let userRecord;

  // Try to find user by subscription ID first
  if (subscriptionId) {
    const userBySubscription = await db
      .select()
      .from(user)
      .where(eq(user.stripeSubscriptionId, subscriptionId as string));

    if (userBySubscription.length > 0) {
      userRecord = userBySubscription[0];
    }
  }

  // 如果仍然没有找到 subscription ID，尝试通过 Stripe API 获取完整的 invoice 数据
  if (!subscriptionId && invoice.id) {
    try {
      console.log(
        "[DEBUG] No subscription ID found in webhook, fetching from Stripe API"
      );
      const config = getProviderConfig("stripe");
      const stripeProvider = PaymentProviderFactory.createProvider(config);
      const stripe = (stripeProvider as { stripe: import("stripe") }).stripe;

      const fullInvoice = await stripe.invoices.retrieve(invoice.id as string);
      subscriptionId = fullInvoice.subscription as string;

      console.log("[DEBUG] Subscription ID from Stripe API:", subscriptionId);

      // 如果找到了 subscription ID，重新尝试查找用户
      if (subscriptionId) {
        const userByApiSubscription = await db
          .select()
          .from(user)
          .where(eq(user.stripeSubscriptionId, subscriptionId));

        if (userByApiSubscription.length > 0) {
          userRecord = userByApiSubscription[0];
          console.log("[DEBUG] Found user via Stripe API subscription ID");
        }
      }
    } catch (error) {
      console.error("[DEBUG] Failed to fetch invoice from Stripe API:", error);
    }
  }

  // If not found by subscription ID, try to find by customer ID
  if (!userRecord && customerId) {
    const userByCustomer = await db
      .select()
      .from(user)
      .where(eq(user.stripeCustomerId, customerId as string));

    if (userByCustomer.length > 0) {
      userRecord = userByCustomer[0];
      console.log(
        `Found user by customer ID: ${customerId} for invoice: ${invoice.id}`
      );
    }
  }

  if (!userRecord) {
    console.error(
      `[CRITICAL] No user found for invoice payment! Invoice: ${invoice.id}, Subscription: ${subscriptionId}, Customer: ${customerId}`
    );

    // 尝试查找所有可能的用户记录进行调试
    if (customerId) {
      const allUsersWithCustomer = await db
        .select()
        .from(user)
        .where(eq(user.stripeCustomerId, customerId as string));
      console.error(
        `[DEBUG] Users with customer ID ${customerId}:`,
        allUsersWithCustomer.length
      );
    }

    if (subscriptionId) {
      const allUsersWithSubscription = await db
        .select()
        .from(user)
        .where(eq(user.stripeSubscriptionId, subscriptionId as string));
      console.error(
        `[DEBUG] Users with subscription ID ${subscriptionId}:`,
        allUsersWithSubscription.length
      );
    }

    return;
  }

  // If user has no subscription ID but we found them by customer, this might be a subscription renewal
  if (!userRecord.stripeSubscriptionId && subscriptionId) {
    console.log(
      `Updating user ${userRecord.id} with subscription ID: ${subscriptionId}`
    );
    await db
      .update(user)
      .set({
        stripeSubscriptionId: subscriptionId as string,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userRecord.id));

    // Update local userRecord object
    userRecord.stripeSubscriptionId = subscriptionId as string;
  }

  // Get plan config for credits
  const planConfig =
    siteConfig.pricing[
      userRecord.currentPlan as keyof typeof siteConfig.pricing
    ];
  const monthlyCreditsAmount = getPlanCredits(planConfig);

  // Calculate next reset date using Stripe invoice period end
  const nextResetDate = invoice.lines?.data?.[0]?.period?.end
    ? new Date(invoice.lines.data[0].period.end * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Extract subscription details from invoice
  const invoiceLine = invoice.lines?.data?.[0];
  const subscriptionAmount = invoice.amount_paid as number; // in cents
  const subscriptionCurrency =
    (invoice.currency as string)?.toUpperCase() || "USD";
  const subscriptionInterval =
    invoiceLine?.price?.recurring?.interval || "month";

  console.log(`[DEBUG] Subscription details from invoice:`, {
    subscriptionAmount,
    subscriptionCurrency,
    subscriptionInterval,
    invoiceLines: invoice.lines?.data,
    amountPaid: invoice.amount_paid,
    currency: invoice.currency,
  });

  // Update user credits and subscription details
  await db
    .update(user)
    .set({
      monthlyCredits: monthlyCreditsAmount,
      creditsResetDate: nextResetDate,
      subscriptionAmount: subscriptionAmount,
      subscriptionCurrency: subscriptionCurrency,
      subscriptionInterval: subscriptionInterval,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userRecord.id));

  // Add credits record for tracking (skip if subscription_create as it's already handled in checkout completion)
  if (invoice.billing_reason !== "subscription_create") {
    const creditType = "monthly_reset";
    const creditDescription = `Monthly renewal credits for ${userRecord.currentPlan} plan`;

    await paymentService.addUserCredits(
      userRecord.id,
      monthlyCreditsAmount,
      creditType,
      (subscriptionId || userRecord.stripeSubscriptionId) as string,
      creditDescription
    );

    console.log(
      `Added monthly renewal credits for user ${userRecord.id}: ${monthlyCreditsAmount} credits`
    );
  } else {
    console.log(
      `Skipping credit creation for subscription_create billing_reason (already handled in checkout completion)`
    );
  }

  console.log(
    `Payment succeeded for user ${userRecord.id} - ${userRecord.currentPlan} plan`
  );
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Record<string, unknown>) {
  console.log("Processing failed payment:", invoice.id);

  const subscriptionId = invoice.subscription;
  if (!subscriptionId) {
    return;
  }

  // Find user by Stripe subscription ID
  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.stripeSubscriptionId, subscriptionId as string));

  if (!userRecord) {
    console.warn(`No user found for subscription: ${subscriptionId}`);
    return;
  }

  // Downgrade user plan to free if multiple failed payments
  if (invoice.attempt_count >= 3) {
    await db
      .update(user)
      .set({
        currentPlan: "free",
        monthlyCredits: 0,
        creditsResetDate: null,
        stripeSubscriptionId: null,
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userRecord.id));

    console.log(
      `Downgraded user ${userRecord.id} to free plan due to failed payments`
    );
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(
  subscription: Record<string, unknown>
) {
  console.log("Processing subscription update:", subscription.id);

  // Find user by Stripe subscription ID
  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.stripeSubscriptionId, subscription.id as string));

  if (!userRecord) {
    console.warn(`No user found for subscription: ${subscription.id}`);
    return;
  }

  // Determine the new plan from Stripe subscription price
  let updatedPlan = userRecord.currentPlan;
  if (subscription.items?.data?.[0]?.price?.id) {
    const priceId = subscription.items.data[0].price.id as string;
    if (priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY) {
      updatedPlan = "starter";
    } else if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) {
      updatedPlan = "pro";
    }
  }

  // Extract cancellation status from subscription
  const cancelAtPeriodEnd = subscription.cancel_at_period_end || false;

  // Update user plan if changed and subscription is active
  if (
    updatedPlan !== userRecord.currentPlan &&
    subscription.status === "active"
  ) {
    const planConfig =
      siteConfig.pricing[updatedPlan as keyof typeof siteConfig.pricing];
    const monthlyCreditsAmount = getPlanCredits(planConfig);

    // Calculate next reset date
    const nextResetDate = subscription.items?.data?.[0]?.current_period_end
      ? new Date(subscription.items.data[0].current_period_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Extract subscription details
    const subscriptionItem = subscription.items?.data?.[0];
    const subscriptionAmount = subscriptionItem?.price?.unit_amount as number; // in cents
    const subscriptionCurrency =
      (subscriptionItem?.price?.currency as string)?.toUpperCase() || "USD";
    const subscriptionInterval =
      subscriptionItem?.price?.recurring?.interval || "month";

    console.log(`[DEBUG] Subscription update details:`, {
      subscriptionAmount,
      subscriptionCurrency,
      subscriptionInterval,
      subscriptionItems: subscription.items?.data,
      priceData: subscriptionItem?.price,
      cancelAtPeriodEnd,
    });

    await db
      .update(user)
      .set({
        currentPlan: updatedPlan,
        monthlyCredits: monthlyCreditsAmount,
        creditsResetDate: nextResetDate,
        subscriptionAmount: subscriptionAmount,
        subscriptionCurrency: subscriptionCurrency,
        subscriptionInterval: subscriptionInterval,
        cancelAtPeriodEnd: cancelAtPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userRecord.id));

    console.log(
      `Updated user ${userRecord.id} plan from ${userRecord.currentPlan} to ${updatedPlan}`
    );
  } else {
    // Even if plan didn't change, update cancellation status
    await db
      .update(user)
      .set({
        cancelAtPeriodEnd: cancelAtPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userRecord.id));

    console.log(
      `Updated user ${userRecord.id} cancellation status: ${cancelAtPeriodEnd}`
    );
  }
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(
  subscription: Record<string, unknown>
) {
  console.log("Processing subscription deletion:", subscription.id);

  // Find user by Stripe subscription ID
  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.stripeSubscriptionId, subscription.id as string));

  if (!userRecord) {
    console.warn(`No user found for subscription deletion: ${subscription.id}`);
    return;
  }

  // Downgrade user to free plan
  await db
    .update(user)
    .set({
      currentPlan: "free",
      monthlyCredits: 0,
      creditsResetDate: null,
      stripeSubscriptionId: null,
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userRecord.id));

  console.log(
    `Canceled subscription and downgraded user ${userRecord.id} to free plan`
  );
}
