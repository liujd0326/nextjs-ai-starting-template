"use server";

import { headers } from "next/headers";

import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";
import { getProviderConfig,PaymentProviderFactory } from "@/modules/payment/providers";

interface CreateOneTimePaymentResult {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

/**
 * Create a one-time payment for credit purchase
 */
export async function createOneTimePaymentAction(
  credits: number,
  amount: number,
  description: string
): Promise<CreateOneTimePaymentResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Please sign in to continue"
      };
    }

    // Initialize payment provider
    const config = getProviderConfig('stripe');
    const provider = PaymentProviderFactory.createProvider(config);

    // Create customer if needed
    let customerId: string;
    try {
      const customerResponse = await provider.createCustomer({
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name || undefined
      });
      customerId = customerResponse.customerId;
    } catch {
      // Customer might already exist, that's OK
      customerId = `cus_${session.user.id}`;
    }

    // Create Stripe checkout session for one-time payment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stripe = (provider as { stripe: any }).stripe;
    
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${credits} AI Credits`,
              description: description,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment
      success_url: `${siteConfig.url}/payment/success?type=credits`,
      cancel_url: `${siteConfig.url}/pricing?payment=canceled`,
      metadata: {
        userId: session.user.id,
        type: 'credit_purchase',
        credits: credits.toString(),
      },
    });

    return {
      success: true,
      checkoutUrl: checkoutSession.url!
    };

  } catch (error: unknown) {
    console.error('One-time payment creation error:', error);
    return {
      success: false,
      error: (error as Error).message || "Failed to create payment"
    };
  }
}

/**
 * Create credit package payment for Credits Pack plan
 */
export async function createCreditPackagePaymentAction(): Promise<CreateOneTimePaymentResult> {
  const creditsPackPlan = siteConfig.pricing.credits_pack;
  
  return createOneTimePaymentAction(
    1000, // 1000 credits
    creditsPackPlan.price,
    "1000 AI Credits - Never expires"
  );
}