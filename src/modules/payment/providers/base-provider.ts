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
  WebhookEvent} from "../types/payment";

/**
 * Abstract base class for payment providers
 * All payment providers (Stripe, Creem, PayPal) must implement this interface
 */
export abstract class BasePaymentProvider {
  protected config: PaymentProviderConfig;
  
  constructor(config: PaymentProviderConfig) {
    this.config = config;
  }

  // Provider identification
  abstract get providerName(): PaymentProvider;
  abstract get isConfigured(): boolean;

  // Customer management
  abstract createCustomer(request: CreateCustomerRequest): Promise<CreateCustomerResponse>;
  abstract getCustomer(customerId: string): Promise<any>;
  abstract updateCustomer(customerId: string, data: any): Promise<any>;

  // Subscription management
  abstract createSubscription(request: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse>;
  abstract getSubscription(subscriptionId: string): Promise<ProviderSubscription>;
  abstract updateSubscription(request: UpdateSubscriptionRequest): Promise<ProviderSubscription>;
  abstract cancelSubscription(request: CancelSubscriptionRequest): Promise<ProviderSubscription>;
  abstract resumeSubscription(subscriptionId: string): Promise<ProviderSubscription>;

  // Payment processing
  abstract createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse>;
  abstract getPayment(paymentId: string): Promise<ProviderPayment>;
  abstract refundPayment(paymentId: string, amount?: number): Promise<ProviderPayment>;

  // Webhook handling
  abstract verifyWebhook(body: string, signature: string): boolean;
  abstract parseWebhookEvent(body: string): WebhookEvent;
  abstract processWebhookEvent(event: WebhookEvent): Promise<ProcessedWebhookEvent>;


  // Price/product management
  abstract createPrice(productId: string, amount: number, currency: string, interval: 'month' | 'year'): Promise<string>;
  abstract createProduct(name: string, description?: string): Promise<string>;

  // Utility methods
  protected formatAmount(amount: number): number {
    // Most providers expect amounts in cents
    return Math.round(amount);
  }

  protected formatCurrency(currency: string): string {
    return currency.toLowerCase();
  }

  protected validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error(`${this.providerName} API key is required`);
    }
    if (!this.config.webhookSecret) {
      throw new Error(`${this.providerName} webhook secret is required`);
    }
  }
}