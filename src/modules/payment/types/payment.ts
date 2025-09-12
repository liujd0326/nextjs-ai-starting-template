import { subscriptionPlanEnum } from "@/db/schema";

// Base types from database enums
export type PaymentProvider = "stripe" | "creem" | "paypal";
export type SubscriptionPlan = (typeof subscriptionPlanEnum.enumValues)[number];

// Subscription interfaces
export interface CreateSubscriptionRequest {
  userId: string;
  plan: SubscriptionPlan;
  interval: "month" | "year";
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
}

export interface CreateSubscriptionResponse {
  subscriptionId: string;
  clientSecret?: string;
  checkoutUrl?: string;
  customerId: string;
}

export interface UpdateSubscriptionRequest {
  subscriptionId: string;
  plan?: SubscriptionPlan;
  interval?: "month" | "year";
  cancelAtPeriodEnd?: boolean;
}

export interface CancelSubscriptionRequest {
  subscriptionId: string;
  cancelAtPeriodEnd?: boolean;
  reason?: string;
}

// Payment interfaces
export interface CreatePaymentRequest {
  userId: string;
  amount: number; // in cents
  currency: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentResponse {
  paymentId: string;
  clientSecret?: string;
  checkoutUrl?: string;
}

// Webhook interfaces
export interface WebhookEvent {
  id: string;
  type: string;
  data: unknown;
  provider: PaymentProvider;
  created: number;
}

export interface ProcessedWebhookEvent {
  eventId: string;
  type: string;
  processed: boolean;
  error?: string;
  relatedIds: {
    subscriptionId?: string;
    paymentId?: string;
    userId?: string;
  };
}

// Customer interfaces
export interface CreateCustomerRequest {
  userId: string;
  email: string;
  name?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateCustomerResponse {
  customerId: string;
  provider: PaymentProvider;
}

// Subscription data from provider
export interface ProviderSubscription {
  id: string;
  customerId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  plan: {
    id: string;
    amount: number;
    currency: string;
    interval: string;
    intervalCount: number;
  };
}

// Payment data from provider
export interface ProviderPayment {
  id: string;
  customerId?: string;
  subscriptionId?: string;
  status: string;
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, unknown>;
  failureCode?: string;
  failureMessage?: string;
  paidAt?: Date;
  createdAt: Date;
}

// Billing portal response
export interface CreateBillingPortalResponse {
  url: string;
}

// Provider configuration
export interface PaymentProviderConfig {
  provider: PaymentProvider;
  apiKey: string;
  webhookSecret: string;
  environment: "test" | "live";
  config?: Record<string, unknown>;
}
