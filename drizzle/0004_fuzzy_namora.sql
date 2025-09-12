ALTER TABLE "user" ADD COLUMN "subscription_amount" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "subscription_currency" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "subscription_interval" text;