import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PricingPlan } from "@/config/site";

import { UserPlanInfo } from "../actions/get-user-plan";
import { PricingCardActions } from "./pricing-card-actions";

interface PricingCardProps {
  plan: PricingPlan;
  userPlanInfo: UserPlanInfo;
  className?: string;
}

export const PricingCard = ({
  plan,
  userPlanInfo,
  className = "",
}: PricingCardProps) => {
  return (
    <Card
      className={`relative flex flex-col h-full min-h-[500px] sm:min-h-[550px] ${plan.popular ? "ring-2 ring-primary" : ""} ${className}`}
    >
      {/* 标签 */}
      <div className="absolute -top-3 left-3 sm:left-4 flex flex-wrap gap-1 sm:gap-2 max-w-[calc(100%-1.5rem)]">
        {plan.free && (
          <Badge className="bg-gray-800 text-white hover:bg-gray-700 text-xs sm:text-sm px-2 py-1">
            FREE
          </Badge>
        )}
        {plan.popular && (
          <Badge className="bg-gray-800 text-white hover:bg-gray-700 text-xs sm:text-sm px-2 py-1">
            MOST POPULAR
          </Badge>
        )}
      </div>

      <CardHeader className="pb-4 pt-6 px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl font-bold">
          {plan.name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 px-4 sm:px-6">
        {/* 价格显示 */}
        <div className="mb-6">
          {plan.free ? (
            <div className="flex items-baseline">
              <span className="text-3xl sm:text-4xl font-bold">$0</span>
            </div>
          ) : (
            <>
              <div className="flex items-baseline mb-1">
                <span className="text-3xl sm:text-4xl font-bold">
                  ${plan.price.toFixed(2)}
                </span>
                {plan.isSubscription ? (
                  <span className="text-sm text-muted-foreground ml-1">
                    /month
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground ml-1">
                    one-time
                  </span>
                )}
              </div>
              {plan.isSubscription && (
                <div className="text-sm text-muted-foreground">
                  ${plan.price.toFixed(2)} billed monthly
                </div>
              )}
              {!plan.isSubscription && (
                <div className="text-sm text-muted-foreground">
                  One-time purchase
                </div>
              )}
            </>
          )}
        </div>

        {/* 功能列表 */}
        <ul className="space-y-2.5 sm:space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-1 sm:mt-0.5" />
              <span className="text-sm text-muted-foreground leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 px-4 sm:px-6 pb-6">
        <PricingCardActions
          plan={plan}
          userPlanInfo={userPlanInfo}
          className={`w-full h-11 text-sm font-medium ${
            plan.popular
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : plan.free
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50"
          }`}
          variant={plan.popular ? "default" : plan.free ? "default" : "outline"}
        />
        <p className="text-xs text-center text-muted-foreground leading-relaxed px-2">
          {plan.note}
        </p>
      </CardFooter>
    </Card>
  );
};
