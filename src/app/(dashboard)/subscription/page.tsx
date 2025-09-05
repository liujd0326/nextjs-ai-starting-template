import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getCurrentSubscriptionAction } from "@/modules/payment/actions/subscription-actions";
import { SubscriptionManagementView } from "@/modules/payment/views/subscription-management-view";

export const metadata: Metadata = {
  title: "Subscription Management",
  description: "Manage your subscription and billing information.",
};

const SubscriptionPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Get user's complete information including credits
  const [userInfo] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      currentPlan: user.currentPlan,
      monthlyCredits: user.monthlyCredits,
      purchasedCredits: user.purchasedCredits,
    })
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!userInfo) {
    redirect("/sign-in");
  }

  const subscription = await getCurrentSubscriptionAction();

  return (
    <SubscriptionManagementView user={userInfo} subscription={subscription} />
  );
};

export default SubscriptionPage;
