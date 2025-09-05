-- Update existing enterprise plans to credits_pack before schema change
UPDATE "user" SET "current_plan" = 'credits_pack' WHERE "current_plan" = 'enterprise';
UPDATE "subscriptions" SET "plan" = 'credits_pack' WHERE "plan" = 'enterprise';