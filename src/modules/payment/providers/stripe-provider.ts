import Stripe from "stripe";

import {
  CancelSubscriptionRequest,
  CreateCustomerRequest,
  CreateCustomerResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  PaymentProvider,
  PaymentProviderConfig,
  ProcessedWebhookEvent,
  ProviderPayment,
  ProviderSubscription,
  UpdateSubscriptionRequest,
  WebhookEvent,
} from "../types/payment";
import { BasePaymentProvider } from "./base-provider";

export class StripeProvider extends BasePaymentProvider {
  private stripe: Stripe;

  constructor(config: PaymentProviderConfig) {
    super(config);
    this.validateConfig();
    this.stripe = new Stripe(config.apiKey, {
      apiVersion: "2025-08-27.basil",
      typescript: true,
    });
  }

  get providerName(): PaymentProvider {
    return "stripe";
  }

  get isConfigured(): boolean {
    return Boolean(
      this.config.apiKey &&
        this.config.webhookSecret &&
        this.config.config?.publishableKey
    );
  }

  async createCustomer(
    request: CreateCustomerRequest
  ): Promise<CreateCustomerResponse> {
    try {
      const customer = await this.stripe.customers.create({
        email: request.email,
        name: request.name,
        metadata: {
          userId: request.userId,
          ...request.metadata,
        },
      });

      return {
        customerId: customer.id,
        provider: "stripe",
      };
    } catch (error: any) {
      throw new Error(`Stripe customer creation failed: ${error.message}`);
    }
  }

  async getCustomer(customerId: string) {
    try {
      return await this.stripe.customers.retrieve(customerId);
    } catch (error: any) {
      throw new Error(`Failed to retrieve Stripe customer: ${error.message}`);
    }
  }

  async updateCustomer(customerId: string, data: any) {
    try {
      return await this.stripe.customers.update(customerId, data);
    } catch (error: any) {
      throw new Error(`Failed to update Stripe customer: ${error.message}`);
    }
  }

  async createSubscription(
    request: CreateSubscriptionRequest & { customerId: string }
  ): Promise<CreateSubscriptionResponse> {
    try {
      // Create price for the plan
      const priceId = await this.getOrCreatePrice(
        request.plan,
        request.interval
      );

      // Create checkout session
      console.log(`[DEBUG] Stripe Provider - Creating checkout session with trialDays: ${request.trialDays}`);
      
      const subscriptionData: any = {
        metadata: {
          userId: request.userId,
          plan: request.plan,
          interval: request.interval,
        },
      };

      // Only add trial_period_days if explicitly requested and valid
      if (request.trialDays && request.trialDays > 0) {
        subscriptionData.trial_period_days = request.trialDays;
        console.log(`[DEBUG] Adding trial_period_days: ${request.trialDays}`);
      }
      
      console.log('[DEBUG] Final subscription data for Stripe:', JSON.stringify(subscriptionData, null, 2));
      
      const session = await this.stripe.checkout.sessions.create({
        customer: request.customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: request.successUrl,
        cancel_url: request.cancelUrl,
        subscription_data: subscriptionData,
        metadata: {
          userId: request.userId,
          plan: request.plan,
          interval: request.interval,
        },
      });

      return {
        subscriptionId: session.id, // Note: This is actually a checkout session ID, not a subscription ID
        checkoutUrl: session.url!,
        customerId: request.customerId,
      };
    } catch (error: any) {
      throw new Error(`Stripe subscription creation failed: ${error.message}`);
    }
  }

  async getSubscription(subscriptionId: string): Promise<ProviderSubscription> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(
        subscriptionId,
        {
          expand: ["items.data.price"],
        }
      );

      const price = subscription.items.data[0]?.price;

      return {
        id: subscription.id,
        customerId: subscription.customer as string,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : undefined,
        trialStart: subscription.trial_start
          ? new Date(subscription.trial_start * 1000)
          : undefined,
        trialEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : undefined,
        plan: {
          id: price?.id || "",
          amount: price?.unit_amount || 0,
          currency: price?.currency || "usd",
          interval: price?.recurring?.interval || "month",
          intervalCount: price?.recurring?.interval_count || 1,
        },
      };
    } catch (error: any) {
      throw new Error(
        `Failed to retrieve Stripe subscription: ${error.message}`
      );
    }
  }

  async updateSubscription(
    request: UpdateSubscriptionRequest
  ): Promise<ProviderSubscription> {
    try {
      const updates: Stripe.SubscriptionUpdateParams = {};

      if (request.plan && request.interval) {
        const priceId = await this.getOrCreatePrice(
          request.plan,
          request.interval
        );
        const subscription = await this.stripe.subscriptions.retrieve(
          request.subscriptionId
        );

        updates.items = [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ];
      }

      if (request.cancelAtPeriodEnd !== undefined) {
        updates.cancel_at_period_end = request.cancelAtPeriodEnd;
      }

      const subscription = await this.stripe.subscriptions.update(
        request.subscriptionId,
        updates
      );

      return this.convertToProviderSubscription(subscription);
    } catch (error: any) {
      throw new Error(`Failed to update Stripe subscription: ${error.message}`);
    }
  }

  async cancelSubscription(
    request: CancelSubscriptionRequest
  ): Promise<ProviderSubscription> {
    try {
      // Check if the ID is a valid subscription ID (should start with 'sub_')
      if (!request.subscriptionId.startsWith('sub_')) {
        throw new Error(`Invalid subscription ID format: ${request.subscriptionId}. Expected subscription ID to start with 'sub_'`);
      }

      let subscription;

      if (request.cancelAtPeriodEnd) {
        subscription = await this.stripe.subscriptions.update(
          request.subscriptionId,
          {
            cancel_at_period_end: true,
          }
        );
      } else {
        subscription = await this.stripe.subscriptions.cancel(
          request.subscriptionId
        );
      }

      return this.convertToProviderSubscription(subscription);
    } catch (error: any) {
      console.error('Stripe subscription cancellation error:', {
        subscriptionId: request.subscriptionId,
        error: error.message
      });
      throw new Error(`Failed to cancel Stripe subscription: ${error.message}`);
    }
  }

  async resumeSubscription(
    subscriptionId: string
  ): Promise<ProviderSubscription> {
    try {
      const subscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: false,
        }
      );

      return this.convertToProviderSubscription(subscription);
    } catch (error: any) {
      throw new Error(`Failed to resume Stripe subscription: ${error.message}`);
    }
  }

  async createPayment(
    request: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: this.formatAmount(request.amount),
        currency: this.formatCurrency(request.currency),
        metadata: {
          userId: request.userId,
          ...request.metadata,
        },
        description: request.description,
      });

      return {
        paymentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error: any) {
      throw new Error(`Stripe payment creation failed: ${error.message}`);
    }
  }

  async getPayment(paymentId: string): Promise<ProviderPayment> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentId);

      return {
        id: paymentIntent.id,
        customerId: paymentIntent.customer as string,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        description: paymentIntent.description || undefined,
        metadata: paymentIntent.metadata,
        createdAt: new Date(paymentIntent.created * 1000),
      };
    } catch (error: any) {
      throw new Error(`Failed to retrieve Stripe payment: ${error.message}`);
    }
  }

  async refundPayment(
    paymentId: string,
    amount?: number
  ): Promise<ProviderPayment> {
    try {
      await this.stripe.refunds.create({
        payment_intent: paymentId,
        amount: amount ? this.formatAmount(amount) : undefined,
      });

      return this.getPayment(paymentId);
    } catch (error: any) {
      throw new Error(`Failed to refund Stripe payment: ${error.message}`);
    }
  }

  verifyWebhook(body: string, signature: string): boolean {
    try {
      this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.config.webhookSecret
      );
      return true;
    } catch {
      return false;
    }
  }

  parseWebhookEvent(body: string): WebhookEvent {
    try {
      const event = JSON.parse(body);
      return {
        id: event.id,
        type: event.type,
        data: event.data,
        provider: "stripe",
        created: event.created,
      };
    } catch (error: any) {
      throw new Error(`Failed to parse Stripe webhook: ${error.message}`);
    }
  }

  async processWebhookEvent(
    event: WebhookEvent
  ): Promise<ProcessedWebhookEvent> {
    const result: ProcessedWebhookEvent = {
      eventId: event.id,
      type: event.type,
      processed: false,
      relatedIds: {},
    };

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await this.handleCheckoutCompleted(event);
          break;
        case "invoice.payment_succeeded":
          await this.handlePaymentSucceeded(event);
          break;
        case "invoice.payment_failed":
          await this.handlePaymentFailed(event);
          break;
        case "customer.subscription.updated":
          await this.handleSubscriptionUpdated(event);
          break;
        case "customer.subscription.deleted":
          await this.handleSubscriptionDeleted(event);
          break;
        default:
          // Unhandled event type
          break;
      }

      result.processed = true;
    } catch (error: any) {
      result.error = error.message;
    }

    return result;
  }


  async createPrice(
    productId: string,
    amount: number,
    currency: string,
    interval: "month" | "year"
  ): Promise<string> {
    try {
      const price = await this.stripe.prices.create({
        product: productId,
        unit_amount: this.formatAmount(amount),
        currency: this.formatCurrency(currency),
        recurring: {
          interval: interval,
        },
      });

      return price.id;
    } catch (error: any) {
      throw new Error(`Failed to create Stripe price: ${error.message}`);
    }
  }

  async createProduct(name: string, description?: string): Promise<string> {
    try {
      const product = await this.stripe.products.create({
        name,
        description,
      });

      return product.id;
    } catch (error: any) {
      throw new Error(`Failed to create Stripe product: ${error.message}`);
    }
  }

  private async getOrCreatePrice(
    plan: string,
    interval: "month" | "year"
  ): Promise<string> {
    // Import siteConfig to get price IDs from environment variables
    const { siteConfig, getStripePriceId } = await import("@/config/site");
    
    // Find the plan in siteConfig
    const planConfig = Object.values(siteConfig.pricing).find(p => p.name.toLowerCase() === plan.toLowerCase());
    
    if (!planConfig) {
      throw new Error(`Plan not found: ${plan}`);
    }
    
    // Get the appropriate price ID using our helper function
    const priceId = getStripePriceId(planConfig, interval === "year");
    
    if (!priceId) {
      throw new Error(`Price ID not found for plan: ${plan}, interval: ${interval}`);
    }
    
    return priceId;
  }

  private convertToProviderSubscription(
    subscription: Stripe.Subscription
  ): ProviderSubscription {
    const price = subscription.items.data[0]?.price;

    return {
      id: subscription.id,
      customerId: subscription.customer as string,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : undefined,
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : undefined,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : undefined,
      plan: {
        id: price?.id || "",
        amount: price?.unit_amount || 0,
        currency: price?.currency || "usd",
        interval: price?.recurring?.interval || "month",
        intervalCount: price?.recurring?.interval_count || 1,
      },
    };
  }

  private async handleCheckoutCompleted(event: WebhookEvent): Promise<void> {
    // Handle successful checkout session
    const session = event.data.object;
    // You would implement the business logic here
    console.log("Checkout completed:", session.id);
  }

  private async handlePaymentSucceeded(event: WebhookEvent): Promise<void> {
    // Handle successful payment
    const invoice = event.data.object;
    console.log("Payment succeeded:", invoice.id);
  }

  private async handlePaymentFailed(event: WebhookEvent): Promise<void> {
    // Handle failed payment
    const invoice = event.data.object;
    console.log("Payment failed:", invoice.id);
  }

  private async handleSubscriptionUpdated(event: WebhookEvent): Promise<void> {
    // Handle subscription updates
    const subscription = event.data.object;
    console.log("Subscription updated:", subscription.id);
  }

  private async handleSubscriptionDeleted(event: WebhookEvent): Promise<void> {
    // Handle subscription cancellation
    const subscription = event.data.object;
    console.log("Subscription deleted:", subscription.id);
  }
}
