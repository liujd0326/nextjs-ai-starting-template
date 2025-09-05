"use client";

import { Globe, Shield, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";

import { MotionDiv, MotionH1, MotionP } from "@/components/motion-wrapper";
import { siteConfig } from "@/config/site";

import { PricingCard } from "../components/pricing-card";
import { PricingToggle } from "../components/pricing-toggle";

export const PricingView = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = Object.values(siteConfig.pricing);

  const features = [
    {
      icon: Zap,
      title: "Advanced AI Models",
      description: "State-of-the-art text-to-image and image-to-image generation with multiple AI models",
    },
    {
      icon: Globe,
      title: "Lightning Fast Processing", 
      description: "Generate high-quality images in seconds with our optimized global infrastructure",
    },
    {
      icon: Shield,
      title: "Commercial License",
      description: "Full commercial usage rights for all generated content with enterprise-grade security",
    },
    {
      icon: TrendingUp,
      title: "99.9% Uptime SLA",
      description: "Reliable AI generation service with guaranteed availability and 24/7 support",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* 灰色背景区域 */}
      <div className="bg-gray-100 pt-20 pb-40 rounded-bl-3xl rounded-br-3xl">
        <div className="max-w-[1380px] mx-auto px-4">
          <div className="text-center mb-10">
            <MotionH1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Most Customizable Pricing
            </MotionH1>
            <MotionP
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Choose the perfect plan for your AI generation needs. Upgrade or
              downgrade at any time.
            </MotionP>
          </div>

          <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />
        </div>
      </div>

      {/* 定价卡片区域 - 跨越灰色和白色背景 */}
      <div className="relative -mt-32">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-6 xl:gap-4">
            {plans.map((plan, index) => (
              <MotionDiv
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex justify-center"
              >
                <PricingCard
                  plan={plan}
                  isYearly={isYearly}
                  className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-sm"
                />
              </MotionDiv>
            ))}
          </div>
        </div>
      </div>

      {/* 白色背景区域 */}
      <div className="bg-white pt-32 sm:pt-40 pb-20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6">
          {/* 特性展示区域 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <MotionDiv
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 sm:p-6 text-center border border-green-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-base sm:text-lg">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
