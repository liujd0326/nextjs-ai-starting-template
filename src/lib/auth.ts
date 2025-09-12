import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";

import { siteConfig } from "@/config/site";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            // 赋予新用户免费积分
            const freeCredits = siteConfig.pricing.free.credits || 30;

            // 更新用户积分
            await db
              .update(schema.user)
              .set({
                purchasedCredits: freeCredits,
                updatedAt: new Date(),
              })
              .where(eq(schema.user.id, user.id));

            // 记录积分历史
            await db.insert(schema.userCredits).values({
              id: `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              userId: user.id,
              type: "initial_grant",
              amount: freeCredits,
              remaining: freeCredits,
              source: "signup_bonus",
              description: `Welcome bonus: ${freeCredits} credits`,
            });

            console.log(
              `New user ${user.id} created with ${freeCredits} welcome credits`
            );
          } catch (error) {
            console.error(
              "Failed to assign welcome credits to new user:",
              error
            );
          }
        },
      },
    },
  },
});
