import { SubscriptionPlan } from "../types/payment";

/**
 * Format price in cents to display format
 */
export function formatPrice(
  amountInCents: number,
  currency: string = "USD"
): string {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert display price to cents
 */
export function priceToCents(price: number): number {
  return Math.round(price * 100);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(
  monthlyPrice: number,
  yearlyPrice: number
): number {
  if (monthlyPrice === 0 || yearlyPrice === 0) return 0;
  const monthlyTotal = monthlyPrice * 12;
  return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
}

/**
 * Generate unique subscription ID
 */
export function generateSubscriptionId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique payment ID
 */
export function generatePaymentId(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique customer ID
 */
export function generateCustomerId(): string {
  return `cus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(plan: SubscriptionPlan): string {
  const names = {
    free: "Free",
    starter: "Starter",
    pro: "Pro",
    credits_pack: "Credits Pack",
  };
  return names[plan] || plan;
}

/**
 * Get plan features
 */
export function getPlanFeatures(plan: SubscriptionPlan): string[] {
  const features = {
    free: [
      "10 AI generations per month",
      "Basic image generation",
      "Standard quality output",
      "Community support",
    ],
    starter: [
      "100 AI generations per month",
      "High-quality image generation",
      "Multiple AI models",
      "Priority support",
      "Commercial usage rights",
    ],
    pro: [
      "500 AI generations per month",
      "Premium AI models access",
      "Advanced customization",
      "Priority processing",
      "Advanced analytics",
    ],
    credits_pack: [
      "Unlimited AI generations",
      "Dedicated support manager",
      "Custom integrations",
      "Advanced security features",
      "SLA guarantee",
    ],
  };
  return features[plan] || [];
}

/**
 * Check if plan has unlimited credits
 */
export function isUnlimitedPlan(plan: SubscriptionPlan): boolean {
  return plan === "credits_pack";
}

/**
 * Get trial period in days for plan
 */
export function getTrialDays(plan: SubscriptionPlan): number {
  const trialDays = {
    free: 0,
    starter: 0,
    pro: 0,
    credits_pack: 0,
  };
  return trialDays[plan] || 0;
}

/**
 * Validate webhook signature timing
 */
export function isWebhookTimingValid(
  timestamp: number,
  toleranceInSeconds: number = 300
): boolean {
  const now = Math.floor(Date.now() / 1000);
  return Math.abs(now - timestamp) <= toleranceInSeconds;
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
}

/**
 * Create success/cancel URLs for checkout
 */
export function createCheckoutUrls(baseUrl: string, planId: string) {
  return {
    successUrl: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
    cancelUrl: `${baseUrl}/pricing?canceled=true&plan=${planId}`,
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get next billing date
 */
export function getNextBillingDate(currentPeriodEnd: Date): string {
  return currentPeriodEnd.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format subscription status for display
 */
export function formatSubscriptionStatus(status: string): string {
  const statusMap: Record<string, string> = {
    active: "Active",
    canceled: "Canceled",
    past_due: "Past Due",
    unpaid: "Unpaid",
    trialing: "Trial",
    paused: "Paused",
  };

  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
}
