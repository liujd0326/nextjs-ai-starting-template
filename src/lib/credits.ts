"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user, userCredits } from "@/db/schema";

export interface CreditBalance {
  monthlyCredits: number;
  purchasedCredits: number;
  totalCredits: number;
}

export interface DeductCreditsResult {
  success: boolean;
  remainingBalance: CreditBalance;
  error?: string;
}

/**
 * Get user's current credit balance
 */
export async function getUserCreditBalance(userId: string): Promise<CreditBalance | null> {
  try {
    const [userRecord] = await db
      .select({
        monthlyCredits: user.monthlyCredits,
        purchasedCredits: user.purchasedCredits,
      })
      .from(user)
      .where(eq(user.id, userId));

    if (!userRecord) {
      return null;
    }

    return {
      monthlyCredits: userRecord.monthlyCredits || 0,
      purchasedCredits: userRecord.purchasedCredits || 0,
      totalCredits: (userRecord.monthlyCredits || 0) + (userRecord.purchasedCredits || 0),
    };
  } catch (error) {
    console.error('Error getting credit balance:', error);
    return null;
  }
}

/**
 * Deduct credits from user account with priority logic
 * Priority: 1. Monthly credits first, 2. Purchased credits second
 */
export async function deductCredits(
  userId: string,
  amount: number,
  description?: string
): Promise<DeductCreditsResult> {
  try {
    // Get current balance
    const balance = await getUserCreditBalance(userId);
    if (!balance) {
      return {
        success: false,
        remainingBalance: { monthlyCredits: 0, purchasedCredits: 0, totalCredits: 0 },
        error: "User not found"
      };
    }

    // Check if user has enough credits
    if (balance.totalCredits < amount) {
      return {
        success: false,
        remainingBalance: balance,
        error: `Insufficient credits. Required: ${amount}, Available: ${balance.totalCredits}`
      };
    }

    let remainingToDeduct = amount;
    let newMonthlyCredits = balance.monthlyCredits;
    let newPurchasedCredits = balance.purchasedCredits;

    // 1. First, deduct from monthly credits
    if (remainingToDeduct > 0 && newMonthlyCredits > 0) {
      const deductFromMonthly = Math.min(remainingToDeduct, newMonthlyCredits);
      newMonthlyCredits -= deductFromMonthly;
      remainingToDeduct -= deductFromMonthly;
    }

    // 2. Then, deduct from purchased credits if needed
    if (remainingToDeduct > 0 && newPurchasedCredits > 0) {
      const deductFromPurchased = Math.min(remainingToDeduct, newPurchasedCredits);
      newPurchasedCredits -= deductFromPurchased;
      remainingToDeduct -= deductFromPurchased;
    }

    // Update user credits in database
    await db
      .update(user)
      .set({
        monthlyCredits: newMonthlyCredits,
        purchasedCredits: newPurchasedCredits,
        updatedAt: new Date()
      })
      .where(eq(user.id, userId));

    // Record the credit usage in userCredits table for tracking
    await db.insert(userCredits).values({
      id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      type: 'usage',
      amount: -amount, // Negative amount indicates usage
      remaining: newMonthlyCredits + newPurchasedCredits,
      description: description || `Used ${amount} credits`,
    });

    const remainingBalance: CreditBalance = {
      monthlyCredits: newMonthlyCredits,
      purchasedCredits: newPurchasedCredits,
      totalCredits: newMonthlyCredits + newPurchasedCredits,
    };

    return {
      success: true,
      remainingBalance,
    };

  } catch (error) {
    console.error('Error deducting credits:', error);
    return {
      success: false,
      remainingBalance: { monthlyCredits: 0, purchasedCredits: 0, totalCredits: 0 },
      error: "Failed to deduct credits"
    };
  }
}

/**
 * Add credits to user account (for admin or special operations)
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: 'monthly' | 'purchased',
  description?: string
): Promise<DeductCreditsResult> {
  try {
    const balance = await getUserCreditBalance(userId);
    if (!balance) {
      return {
        success: false,
        remainingBalance: { monthlyCredits: 0, purchasedCredits: 0, totalCredits: 0 },
        error: "User not found"
      };
    }

    const newMonthlyCredits = type === 'monthly' 
      ? balance.monthlyCredits + amount 
      : balance.monthlyCredits;
      
    const newPurchasedCredits = type === 'purchased' 
      ? balance.purchasedCredits + amount 
      : balance.purchasedCredits;

    // Update user credits
    await db
      .update(user)
      .set({
        monthlyCredits: newMonthlyCredits,
        purchasedCredits: newPurchasedCredits,
        updatedAt: new Date()
      })
      .where(eq(user.id, userId));

    // Record the credit addition
    await db.insert(userCredits).values({
      id: `add_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      type: type === 'monthly' ? 'monthly_reset' : 'one_time_purchase',
      amount: amount,
      remaining: newMonthlyCredits + newPurchasedCredits,
      description: description || `Added ${amount} ${type} credits`,
    });

    const remainingBalance: CreditBalance = {
      monthlyCredits: newMonthlyCredits,
      purchasedCredits: newPurchasedCredits,
      totalCredits: newMonthlyCredits + newPurchasedCredits,
    };

    return {
      success: true,
      remainingBalance,
    };

  } catch (error) {
    console.error('Error adding credits:', error);
    return {
      success: false,
      remainingBalance: { monthlyCredits: 0, purchasedCredits: 0, totalCredits: 0 },
      error: "Failed to add credits"
    };
  }
}