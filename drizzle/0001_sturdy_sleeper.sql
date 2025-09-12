CREATE TYPE "public"."payment_type" AS ENUM('one_time', 'subscription_initial', 'subscription_renewal', 'subscription_upgrade');--> statement-breakpoint
CREATE TYPE "public"."subscription_action" AS ENUM('created', 'upgraded', 'cancelled');--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_provider_subscription_id_unique";--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "current_period_start" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "current_period_end" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "type" "payment_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "related_plan" "subscription_plan";--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "action" "subscription_action" NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "previous_plan" "subscription_plan";--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "is_active" boolean NOT NULL;