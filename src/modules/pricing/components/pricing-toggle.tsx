"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
}

export const PricingToggle = ({ isYearly, onToggle }: PricingToggleProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="relative">
        <div className="flex items-center bg-gray-200 rounded-2xl p-2 shadow-inner">
          <button
            onClick={() => onToggle(false)}
            className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              !isYearly
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => onToggle(true)}
            className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              isYearly
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Yearly
          </button>
        </div>
        <Badge
          className="absolute -top-2 -right-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"
          variant="secondary"
        >
          save 30%
        </Badge>
      </div>
    </div>
  );
};