import { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { getUserPlanAction } from "@/modules/pricing/actions/get-user-plan";
import { PricingView } from "@/modules/pricing/views/pricing-view";

export const metadata: Metadata = {
  title: "Pricing | " + siteConfig.name,
  description:
    "Choose the perfect plan for your AI generation needs. Flexible pricing with monthly and yearly options.",
};

const PricingPage = async () => {
  const userPlanInfo = await getUserPlanAction();

  return <PricingView userPlanInfo={userPlanInfo} />;
};

export default PricingPage;
