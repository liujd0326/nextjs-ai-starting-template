"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

export interface UserPlanInfo {
  isAuthenticated: boolean;
  currentPlan: 'free' | 'starter' | 'pro' | 'credits_pack' | null;
  userId?: string;
}

export const getUserPlanAction = async (): Promise<UserPlanInfo> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id) {
      return {
        isAuthenticated: false,
        currentPlan: null,
      };
    }

    // Get user's current plan
    const [userInfo] = await db
      .select({
        currentPlan: user.currentPlan,
      })
      .from(user)
      .where(eq(user.id, session.user.id));

    if (!userInfo) {
      return {
        isAuthenticated: false,
        currentPlan: null,
      };
    }

    return {
      isAuthenticated: true,
      currentPlan: userInfo.currentPlan,
      userId: session.user.id,
    };
  } catch (error) {
    console.error("Failed to get user plan:", error);
    return {
      isAuthenticated: false,
      currentPlan: null,
    };
  }
};