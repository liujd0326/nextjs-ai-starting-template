import { PaymentProvider, PaymentProviderConfig } from "../types/payment";
import { BasePaymentProvider } from "./base-provider";

/**
 * Factory class to create payment provider instances
 * This allows us to support multiple payment providers dynamically
 */
export class PaymentProviderFactory {
  private static providers: Map<
    PaymentProvider,
    new (config: PaymentProviderConfig) => BasePaymentProvider
  > = new Map();

  /**
   * Register a payment provider implementation
   */
  static registerProvider(
    provider: PaymentProvider,
    providerClass: new (config: PaymentProviderConfig) => BasePaymentProvider
  ) {
    this.providers.set(provider, providerClass);
  }

  /**
   * Create a payment provider instance
   */
  static createProvider(config: PaymentProviderConfig): BasePaymentProvider {
    const ProviderClass = this.providers.get(config.provider);

    if (!ProviderClass) {
      throw new Error(
        `Payment provider '${config.provider}' is not registered`
      );
    }

    return new ProviderClass(config);
  }

  /**
   * Get all registered providers
   */
  static getRegisteredProviders(): PaymentProvider[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if a provider is registered
   */
  static isProviderRegistered(provider: PaymentProvider): boolean {
    return this.providers.has(provider);
  }
}

/**
 * Get provider configuration from environment variables
 */
export function getProviderConfig(
  provider: PaymentProvider
): PaymentProviderConfig {
  switch (provider) {
    case "stripe":
      return {
        provider: "stripe",
        apiKey: process.env.STRIPE_SECRET_KEY!,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
        environment: process.env.NODE_ENV === "production" ? "live" : "test",
        config: {
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
        },
      };

    case "creem":
      return {
        provider: "creem",
        apiKey: process.env.CREEM_API_KEY!,
        webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
        environment: process.env.NODE_ENV === "production" ? "live" : "test",
        config: {
          publishableKey: process.env.NEXT_PUBLIC_CREEM_PUBLISHABLE_KEY!,
        },
      };

    case "paypal":
      return {
        provider: "paypal",
        apiKey: process.env.PAYPAL_CLIENT_ID!,
        webhookSecret: process.env.PAYPAL_WEBHOOK_SECRET!,
        environment: process.env.NODE_ENV === "production" ? "live" : "test",
        config: {
          clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
        },
      };

    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}

/**
 * Get default payment provider from environment
 */
export function getDefaultProvider(): PaymentProvider {
  const provider = process.env.DEFAULT_PAYMENT_PROVIDER as PaymentProvider;
  if (!provider || !PaymentProviderFactory.isProviderRegistered(provider)) {
    return "stripe"; // Default fallback
  }
  return provider;
}
