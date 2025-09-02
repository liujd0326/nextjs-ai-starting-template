import { Metadata } from "next";

import { PricingView } from "@/modules/pricing/views/pricing-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pricing | " + siteConfig.name,
  description: "Choose the perfect plan for your AI generation needs. Flexible pricing with monthly and yearly options.",
};

const PricingPage = () => {
  return <PricingView />;
};

export default PricingPage;