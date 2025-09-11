import { PaymentProviderFactory } from "./provider-factory";
import { StripeProvider } from "./stripe-provider";

// Register all payment providers
PaymentProviderFactory.registerProvider("stripe", StripeProvider);

// Future providers can be registered here:
// PaymentProviderFactory.registerProvider('creem', CreemProvider);
// PaymentProviderFactory.registerProvider('paypal', PayPalProvider);

export { PaymentProviderFactory, StripeProvider };
export * from "./base-provider";
export * from "./provider-factory";
