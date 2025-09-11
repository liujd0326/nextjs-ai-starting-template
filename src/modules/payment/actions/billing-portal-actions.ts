"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { PaymentService } from "../services/payment-service";

/**
 * Creates a billing portal session for the current user
 * Returns the billing portal URL
 */
export const createBillingPortalSessionAction = async (): Promise<{ url: string }> => {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    // Get user's subscription to find customer ID
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (!subscription.length || !subscription[0].providerCustomerId) {
      throw new Error("You need an active subscription to access billing management. Please upgrade your plan first.");
    }

    const customerId = subscription[0].providerCustomerId;
    const returnUrl = `${process.env.BETTER_AUTH_URL}/dashboard/subscription`;

    // Create billing portal session
    const paymentService = new PaymentService();
    const billingPortalResponse = await paymentService.createBillingPortalSession(
      customerId,
      returnUrl
    );

    // Return the billing portal URL
    return { url: billingPortalResponse.url };
  } catch (error) {
    console.error("Failed to create billing portal session:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to access billing portal"
    );
  }
};