// Initialize payment providers
import "@/modules/payment/providers";

import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { payments, subscriptions, user, userCredits,webhookEvents } from "@/db/schema";
import { getProviderConfig,PaymentProviderFactory } from "@/modules/payment/providers";
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
      return NextResponse.json(
        { error: "Missing signature" }, 
        { status: 400 }
      );
    }

    // Initialize Stripe provider
    const config = getProviderConfig('stripe');
    const stripeProvider = PaymentProviderFactory.createProvider(config);

    // Verify webhook signature
    if (!stripeProvider.verifyWebhook(body, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" }, 
        { status: 400 }
      );
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
          eq(webhookEvents.provider, 'stripe')
        )
      );

    if (existingEvent.length > 0) {
      console.log(`Event ${webhookEvent.id} already processed`);
      return NextResponse.json({ received: true });
    }

    // Store webhook event
    await db.insert(webhookEvents).values({
      id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider: 'stripe',
      eventType: webhookEvent.type,
      eventId: webhookEvent.id,
      data: JSON.stringify(webhookEvent.data),
      processed: false
    });

    // Process the webhook event
    const result = await processStripeWebhook(webhookEvent);

    // Update webhook event status
    await db
      .update(webhookEvents)
      .set({
        processed: true,
        processedAt: new Date(),
        processingError: result.error || null
      })
      .where(eq(webhookEvents.eventId, webhookEvent.id));

    if (result.error) {
      console.error(`Webhook processing error: ${result.error}`);
      return NextResponse.json(
        { error: "Processing error" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
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
async function processStripeWebhook(webhookEvent: any) {
  const paymentService = new PaymentService('stripe');

  try {
    switch (webhookEvent.type) {
      case 'checkout.session.completed':
        console.log('Processing checkout session completion');
        await handleCheckoutCompleted(webhookEvent.data.object, paymentService);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(webhookEvent.data.object, paymentService);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(webhookEvent.data.object, paymentService);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(webhookEvent.data.object, paymentService);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(webhookEvent.data.object, paymentService);
        break;

      case 'customer.subscription.created':
        console.log('Processing subscription creation');
        await handleSubscriptionCreated(webhookEvent.data.object, paymentService);
        break;

      default:
        console.log(`Unhandled event type: ${webhookEvent.type}`);
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutCompleted(session: any, paymentService: PaymentService) {
  console.log('Processing checkout completion:', session.id);

  const userId = session.metadata?.userId;
  const type = session.metadata?.type;
  const credits = session.metadata?.credits;
  const plan = session.metadata?.plan;

  if (!userId) {
    throw new Error('Missing userId in checkout session metadata');
  }

  // Handle one-time payment (credit purchase)
  if (session.mode === 'payment' && type === 'credit_purchase' && credits) {
    console.log(`One-time payment completed for user ${userId}, adding ${credits} credits`);
    
    const creditAmount = parseInt(credits, 10);
    
    // Add payment record
    await db.insert(payments).values({
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      provider: 'stripe',
      providerPaymentId: session.payment_intent || session.id,
      providerPaymentIntentId: session.payment_intent || session.id,
      status: 'succeeded',
      amount: session.amount_total || 3499,
      currency: session.currency || 'usd',
      description: `Credit purchase - ${creditAmount} credits`,
      metadata: JSON.stringify(session.metadata),
      paidAt: new Date()
    });

    // Add credits to user account
    await db.insert(userCredits).values({
      id: `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      type: 'one_time_purchase',
      amount: creditAmount,
      remaining: creditAmount,
      source: session.payment_intent || session.id,
      description: `Purchased ${creditAmount} credits - Never expires`
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
          updatedAt: new Date()
        })
        .where(eq(user.id, userId));
    }

    console.log(`Added ${creditAmount} credits to user ${userId}`);
    return;
  }

  // Handle subscription checkout
  if (session.mode === 'subscription' && session.subscription && plan) {
    // The subscription will be handled in the subscription.created event
    console.log(`Subscription checkout completed: ${session.subscription}`);
    
    // Update user's plan
    await paymentService.updateUserPlan(userId, plan);
    console.log(`Updated user ${userId} to plan ${plan}`);
    return;
  }

  console.log(`Unhandled checkout session mode: ${session.mode}, type: ${type}`);
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription: any, _paymentService: PaymentService) {
  console.log('Processing subscription creation:', subscription.id);
  
  const userId = subscription.metadata?.userId;
  const plan = subscription.metadata?.plan || 'starter';

  if (!userId) {
    // Try to find user by customer ID
    // You would need to implement customer lookup
    console.warn('No userId in subscription metadata, customer:', subscription.customer);
    return;
  }

  // Check if subscription already exists (by provider subscription ID)
  const existingByProviderSub = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.providerSubscriptionId, subscription.id));

  if (existingByProviderSub.length > 0) {
    console.log(`Subscription ${subscription.id} already exists, updating instead`);
    await handleSubscriptionUpdated(subscription, _paymentService);
    return;
  }

  // Also check if user already has an active subscription for the same plan
  const existingByUser = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .where(eq(subscriptions.plan, plan))
    .where(eq(subscriptions.status, 'active'));

  if (existingByUser.length > 0) {
    console.log(`User ${userId} already has active subscription for plan ${plan}, skipping creation`);
    return;
  }

  // Create subscription record in database
  const subscriptionData = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: userId,
    provider: 'stripe',
    providerSubscriptionId: subscription.id,
    providerCustomerId: subscription.customer,
    plan: plan,
    status: subscription.status,
    currentPeriodStart: subscription.items?.data?.[0]?.current_period_start ? new Date(subscription.items.data[0].current_period_start * 1000) : null,
    currentPeriodEnd: subscription.items?.data?.[0]?.current_period_end ? new Date(subscription.items.data[0].current_period_end * 1000) : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    currency: subscription.items.data[0]?.price?.currency || 'usd',
    amount: subscription.items.data[0]?.price?.unit_amount || 0,
    interval: subscription.items.data[0]?.price?.recurring?.interval || 'month'
  };
  
  
  await db.insert(subscriptions).values(subscriptionData);

  console.log(`Created subscription record for user ${userId}`);
  
  // Handle initial credit allocation for new subscription
  if (subscription.status === 'active') {
    console.log('Setting up initial credits for active subscription');
    
    try {

      const monthlyCreditsAmount = getPlanCredits(plan);
      // For subscription creation, use the subscription's current period end
      const nextResetDate = subscription.items?.data?.[0]?.current_period_end 
        ? new Date(subscription.items.data[0].current_period_end * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      // Update user with initial credits
      const updateResult = await db
        .update(user)
        .set({
          monthlyCredits: monthlyCreditsAmount,
          currentPlan: plan,
          creditsResetDate: nextResetDate,
          updatedAt: new Date()
        })
        .where(eq(user.id, userId))
        .returning();
      
        
      // Add credits record for tracking
      const paymentService = new PaymentService();
      await paymentService.addUserCredits(
        userId,
        monthlyCreditsAmount,
        'initial_grant',
        subscriptionData.id,
        `Initial credits for ${plan} plan`
      );
      
      console.log(`Initial credits setup complete: ${monthlyCreditsAmount} credits for user ${userId}`);
    } catch (error) {
      console.error(`Failed to setup initial credits for user ${userId}:`, error);
      throw error;
    }
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice: any, paymentService: PaymentService) {
  console.log('Processing payment success for invoice:', invoice.id);

  // Determine payment type
  const isFirstPayment = invoice.billing_reason === 'subscription_create';
  const isRenewal = invoice.billing_reason === 'subscription_cycle';

  let subscriptionId = invoice.subscription;

  // If no subscription ID in invoice, try to find by customer
  if (!subscriptionId) {
    console.warn(`No subscription ID in invoice: ${invoice.id}, trying to find by customer`);
    
    const customerSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.providerCustomerId, invoice.customer))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);
      
    if (customerSubscriptions.length > 0) {
      const [customerSubscription] = customerSubscriptions;
      subscriptionId = customerSubscription.providerSubscriptionId;
    } else {
      // For first payment, subscription might not be created yet
      if (isFirstPayment) {
        return; // Skip for now, will be handled when subscription is created
      } else {
        console.error(`No subscription found for customer: ${invoice.customer}`);
        return;
      }
    }
  }

  // Find subscription in our database
  const subscriptionResults = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.providerSubscriptionId, subscriptionId));

  if (subscriptionResults.length === 0) {
    console.error(`Subscription not found for invoice: ${invoice.id}, subscription ID: ${subscriptionId}`);
    return;
  }
  
  const [subscription] = subscriptionResults;

  // Update subscription status to active
  await db
    .update(subscriptions)
    .set({
      status: 'active',
      updatedAt: new Date()
    })
    .where(eq(subscriptions.id, subscription.id));

  // Handle credit allocation based on payment type
  const monthlyCreditsAmount = getPlanCredits(subscription.plan);
  
  try {
    const userBeforeResult = await db
      .select()
      .from(user)
      .where(eq(user.id, subscription.userId));
    
    const [userBefore] = userBeforeResult;
    
    if (!userBefore) {
      console.error(`No user found with ID: ${subscription.userId}`);
      throw new Error(`User not found: ${subscription.userId}`);
    }

    // Calculate next reset date using Stripe invoice period end
    // For renewals, use the period end from invoice lines, otherwise fallback to 30 days from now
    const nextResetDate = invoice.lines?.data?.[0]?.period?.end 
      ? new Date(invoice.lines.data[0].period.end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const updateResult = await db
      .update(user)
      .set({
        monthlyCredits: monthlyCreditsAmount,
        currentPlan: subscription.plan,
        creditsResetDate: nextResetDate,
        updatedAt: new Date()
      })
      .where(eq(user.id, subscription.userId));
  } catch (error) {
    console.error(`Failed to update user credits for user ${subscription.userId}:`, error);
    throw error;
  }

  // Add credits record for tracking
  try {
    const creditType = isFirstPayment ? 'initial_grant' : isRenewal ? 'monthly_reset' : 'payment_grant';
    const creditDescription = isFirstPayment 
      ? `Initial credits for ${subscription.plan} plan` 
      : isRenewal 
      ? `Monthly renewal credits for ${subscription.plan} plan`
      : `Credits for ${subscription.plan} plan payment`;
      
    await paymentService.addUserCredits(
      subscription.userId,
      monthlyCreditsAmount,
      creditType,
      subscription.id,
      creditDescription
    );
    console.log(`Added ${monthlyCreditsAmount} credits to user ${subscription.userId} (${creditType})`);
  } catch (error) {
    console.error(`Failed to add credits to user ${subscription.userId}:`, error);
  }

  const successMessage = isFirstPayment 
    ? 'First payment succeeded - Initial credits granted' 
    : isRenewal 
    ? 'Monthly renewal succeeded - Credits reset completed'
    : 'Payment succeeded - Credits updated';
    
  console.log(`${successMessage} for subscription ${subscription.id}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: any, _paymentService: PaymentService) {
  console.log('Processing failed payment:', invoice.id);

  const subscriptionId = invoice.subscription;

  // Find subscription in our database
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.providerSubscriptionId, subscriptionId));

  if (!subscription) {
    console.warn(`Subscription not found for invoice: ${invoice.id}`);
    return;
  }

  // Update subscription status to past_due
  await db
    .update(subscriptions)
    .set({
      status: 'past_due',
      updatedAt: new Date()
    })
    .where(eq(subscriptions.id, subscription.id));

  // Update user plan to free if multiple failed payments
  if (invoice.attempt_count >= 3) {
    await db
      .update(user)
      .set({
        currentPlan: 'free',
        monthlyCredits: 10,
        // Keep purchasedCredits unchanged
        updatedAt: new Date()
      })
      .where(eq(user.id, subscription.userId));

    console.log(`Downgraded user ${subscription.userId} to free plan due to failed payments`);
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: any, _paymentService: PaymentService) {
  console.log('Processing subscription update:', subscription.id);

  // Find subscription in our database
  const [existingSubscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.providerSubscriptionId, subscription.id));

  if (!existingSubscription) {
    console.warn(`Subscription not found: ${subscription.id}`);
    return;
  }

  // Update subscription in database
  await db
    .update(subscriptions)
    .set({
      status: subscription.status,
      currentPeriodStart: subscription.items?.data?.[0]?.current_period_start ? new Date(subscription.items.data[0].current_period_start * 1000) : null,
      currentPeriodEnd: subscription.items?.data?.[0]?.current_period_end ? new Date(subscription.items.data[0].current_period_end * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      updatedAt: new Date()
    })
    .where(eq(subscriptions.id, existingSubscription.id));

  console.log(`Updated subscription ${existingSubscription.id}`);
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: any, _paymentService: PaymentService) {
  console.log('Processing subscription deletion:', subscription.id);

  // Find subscription in our database
  const [existingSubscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.providerSubscriptionId, subscription.id));

  if (!existingSubscription) {
    console.warn(`Subscription not found: ${subscription.id}`);
    return;
  }

  // Update subscription status to canceled
  await db
    .update(subscriptions)
    .set({
      status: 'canceled',
      canceledAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(subscriptions.id, existingSubscription.id));

  // Downgrade user to free plan
  await db
    .update(user)
    .set({
      currentPlan: 'free',
      monthlyCredits: 10,
      // Keep purchasedCredits unchanged
      updatedAt: new Date()
    })
    .where(eq(user.id, existingSubscription.userId));

  console.log(`Canceled subscription and downgraded user ${existingSubscription.userId} to free plan`);
}

/**
 * Get plan credits allocation
 */
function getPlanCredits(plan: string): number {
  const credits = {
    free: 10,
    starter: 100,
    pro: 500,
    credits_pack: 1000 // Large number for "unlimited"
  };
  
  return credits[plan as keyof typeof credits] || 10;
}