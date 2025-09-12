"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  getProviderConfig,
  PaymentProviderFactory,
} from "../providers/provider-factory";

/**
 * 从 Stripe API 同步订阅数据到数据库
 * 用于修复现有订阅缺失的金额和货币信息
 */
export async function syncSubscriptionDataAction() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Please sign in to continue" };
    }

    // 获取用户记录
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));

    if (!userRecord || !userRecord.stripeSubscriptionId) {
      return { success: false, error: "No active subscription found" };
    }

    // 从 Stripe API 获取订阅详情
    const config = getProviderConfig("stripe");
    const stripeProvider = PaymentProviderFactory.createProvider(config);

    // 使用 Stripe SDK 直接获取订阅信息
    const stripe = (stripeProvider as { stripe: import("stripe") }).stripe;
    const subscription = await stripe.subscriptions.retrieve(
      userRecord.stripeSubscriptionId
    );

    if (!subscription) {
      return { success: false, error: "Subscription not found in Stripe" };
    }

    // 提取订阅详情
    const subscriptionItem = subscription.items.data[0];
    const subscriptionAmount = subscriptionItem.price.unit_amount; // 以分为单位
    const subscriptionCurrency = subscriptionItem.price.currency.toUpperCase();
    const subscriptionInterval = subscriptionItem.price.recurring.interval;

    console.log(`[DEBUG] Syncing subscription data:`, {
      subscriptionAmount,
      subscriptionCurrency,
      subscriptionInterval,
      subscriptionId: userRecord.stripeSubscriptionId,
    });

    // 更新数据库
    await db
      .update(user)
      .set({
        subscriptionAmount,
        subscriptionCurrency,
        subscriptionInterval,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    return {
      success: true,
      data: {
        amount: subscriptionAmount,
        currency: subscriptionCurrency,
        interval: subscriptionInterval,
      },
    };
  } catch (error: unknown) {
    console.error("Failed to sync subscription data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
