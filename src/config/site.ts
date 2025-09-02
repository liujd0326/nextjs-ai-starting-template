export interface PricingPlan {
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description: string;
  popular?: boolean;
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
    starter: PricingPlan;
    standard: PricingPlan;
    premium: PricingPlan;
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
    starter: {
      name: "入门版",
      price: 199,
      originalPrice: 299,
      currency: "USD",
      description: "开始您的第一个 SaaS 创业项目。",
      features: [
        "NextJS 模板",
        "SEO 友好结构",
        "博客 & 内容管理系统",
        "Stripe 支付",
        "Supabase 数据存储",
        "Google OAuth 和一键登录",
        "国际化支持",
      ],
      paymentMethods: ["支付宝", "微信", "支付宝"],
      buttonText: "获取 ShipAny ⚡",
      note: "一次付费，无限项目！",
    },

    standard: {
      name: "标准版",
      price: 249,
      originalPrice: 349,
      currency: "USD",
      description: "快速启动您的 SaaS 创业项目。",
      popular: true,
      features: [
        "包含入门版所有功能，另加",
        "Vercel 或 Cloudflare 部署",
        "隐私和条款生成",
        "Google Analytics 集成",
        "Google Search Console 集成",
        "Discord 社区",
        "首次发布技术支持",
        "终身更新",
      ],
      paymentMethods: ["支付宝", "微信", "支付宝"],
      buttonText: "获取 ShipAny ⚡",
      note: "一次付费，无限项目！",
    },

    premium: {
      name: "高级版",
      price: 299,
      originalPrice: 399,
      currency: "USD",
      description: "构建任何 AI SaaS 创业项目。",
      features: [
        "包含标准版所有功能，另加",
        "更多组件选择",
        "AI 业务功能 & SDK",
        "用户控制台",
        "后台管理系统",
        "积分管理",
        "API 密钥管理",
        "优先技术支持",
      ],
      paymentMethods: ["支付宝", "微信", "支付宝", "自定义促销码"],
      buttonText: "获取 ShipAny ⚡",
      note: "一次付费，无限项目！",
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
