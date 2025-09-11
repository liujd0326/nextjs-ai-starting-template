export interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  description: string;
  popular?: boolean;
  free?: boolean;
  isSubscription?: boolean;
  features: string[];
  paymentMethods: string[];
  buttonText: string;
  note: string;
  stripePriceIds?: {
    monthly?: string;
    oneTime?: string;
  };
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  pricing: {
    free: PricingPlan;
    starter: PricingPlan;
    pro: PricingPlan;
    credits_pack: PricingPlan;
  };
  social: {
    twitter?: string;
    github?: string;
    discord?: string;
  };
  contact: {
    email: string;
    supportResponseTime: string;
  };
  legal: {
    lastUpdated: string;
  };
  seo: {
    keywords: string[];
    author: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "AI Template",
  description:
    "AI-powered SaaS platform for image generation and creative tools",
  url: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  pricing: {
    free: {
      name: "Free",
      price: 0,
      currency: "USD",
      description: "Perfect for trying out our AI tools",
      free: true,
      isSubscription: false,
      features: [
        "10 AI generations per month",
        "Basic image generation",
        "Standard quality output",
        "Community support",
      ],
      paymentMethods: [],
      buttonText: "Sign Up",
      note: "No credit card required",
    },

    starter: {
      name: "Starter",
      price: 19.99,
      currency: "USD",
      description: "Great for individuals and small projects",
      isSubscription: true,
      features: [
        "100 AI generations per month",
        "High-quality image generation",
        "Multiple AI models",
        "Priority support",
        "Commercial usage rights",
      ],
      paymentMethods: ["Credit Card", "PayPal"],
      buttonText: "Subscribe Now",
      note: "Cancel anytime",
      stripePriceIds: {
        monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
      },
    },

    pro: {
      name: "Pro",
      price: 29.99,
      currency: "USD",
      description: "Perfect for professionals and teams",
      popular: true,
      isSubscription: true,
      features: [
        "500 AI generations per month",
        "Premium AI models access",
        "Advanced customization",
        "Priority processing",
        "Advanced analytics",
      ],
      paymentMethods: ["Credit Card", "PayPal"],
      buttonText: "Subscribe Now",
      note: "Cancel anytime",
      stripePriceIds: {
        monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
      },
    },

    credits_pack: {
      name: "Credits Pack",
      price: 34.99,
      currency: "USD",
      description: "1000 credits for your AI creations",
      isSubscription: false,
      features: [
        "1000 AI generations",
        "All premium models access",
        "Priority processing",
        "Commercial usage rights",
        "Credits never expire",
      ],
      paymentMethods: ["Credit Card", "PayPal"],
      buttonText: "Buy Credits",
      note: "One-time purchase, credits never expire",
      stripePriceIds: {
        oneTime: process.env.STRIPE_PRICE_CREDITS_PACK,
      },
    },
  },

  social: {
    twitter: "@yoursite",
    github: "https://github.com/yoursite",
    discord: "https://discord.gg/yoursite",
  },

  contact: {
    email: "demo@gmail.com",
    supportResponseTime: "48 hours",
  },

  legal: {
    lastUpdated: "September 2, 2025",
  },

  seo: {
    keywords: [
      "AI SaaS",
      "Next.js template",
      "AI image generation",
      "SaaS starter kit",
      "TypeScript",
      "Tailwind CSS",
    ],
    author: "Your Company Name",
  },
};

export const getPricingPlans = () => {
  return [
    siteConfig.pricing.free,
    siteConfig.pricing.starter,
    siteConfig.pricing.pro,
    siteConfig.pricing.credits_pack,
  ];
};

export const getSubscriptionPlans = () => {
  return [siteConfig.pricing.starter, siteConfig.pricing.pro];
};

export const getPopularPlan = () => {
  return Object.values(siteConfig.pricing).find((plan) => plan.popular);
};

export const getStripePriceId = (plan: PricingPlan): string | undefined => {
  if (!plan.stripePriceIds) return undefined;

  if (!plan.isSubscription) {
    return plan.stripePriceIds.oneTime;
  }

  return plan.stripePriceIds.monthly;
};
