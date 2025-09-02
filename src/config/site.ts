export interface PricingPlan {
  name: string;
  price: number;
  monthlyPrice: number;
  yearlyPrice: number;
  originalPrice?: number;
  currency: string;
  description: string;
  popular?: boolean;
  free?: boolean;
  features: string[];
  paymentMethods: string[];
  buttonText: string;
  note: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  pricing: {
    free: PricingPlan;
    starter: PricingPlan;
    pro: PricingPlan;
    enterprise: PricingPlan;
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
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: "USD",
      description: "Perfect for trying out our AI tools",
      free: true,
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
      price: 9.99,
      monthlyPrice: 9.99,
      yearlyPrice: 99.9,
      currency: "USD",
      description: "Great for individuals and small projects",
      features: [
        "100 AI generations per month",
        "High-quality image generation",
        "Multiple AI models",
        "Priority support",
        "Commercial usage rights",
      ],
      paymentMethods: ["Credit Card", "PayPal"],
      buttonText: "Get Started",
      note: "Cancel anytime",
    },

    pro: {
      name: "Pro",
      price: 19.99,
      monthlyPrice: 19.99,
      yearlyPrice: 199.9,
      currency: "USD",
      description: "Perfect for professionals and teams",
      popular: true,
      features: [
        "500 AI generations per month",
        "Premium AI models access",
        "Advanced customization",
        "Priority processing",
        "Advanced analytics",
      ],
      paymentMethods: ["Credit Card", "PayPal"],
      buttonText: "Start Free Trial",
      note: "14-day free trial",
    },

    enterprise: {
      name: "Enterprise",
      price: 99.99,
      monthlyPrice: 99.99,
      yearlyPrice: 999.9,
      currency: "USD",
      description: "For large teams and organizations",
      features: [
        "Unlimited AI generations",
        "Dedicated support manager",
        "Custom integrations",
        "Advanced security features",
        "SLA guarantee",
      ],
      paymentMethods: ["Credit Card", "Invoice", "Wire Transfer"],
      buttonText: "Contact Sales",
      note: "Custom enterprise pricing available",
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
    siteConfig.pricing.starter,
    siteConfig.pricing.standard,
    siteConfig.pricing.premium,
  ];
};

export const getPopularPlan = () => {
  return Object.values(siteConfig.pricing).find((plan) => plan.popular);
};
