import { boolean, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Enums for subscription system
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active', 'canceled', 'past_due', 'unpaid', 'trialing', 'paused'
]);

export const paymentProviderEnum = pgEnum('payment_provider', [
  'stripe', 'creem', 'paypal'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending', 'succeeded', 'failed', 'canceled', 'refunded'
]);

export const subscriptionPlanEnum = pgEnum('subscription_plan', [
  'free', 'starter', 'pro', 'credits_pack'
]);

export const generationStatusEnum = pgEnum('generation_status', [
  'pending', 'processing', 'completed', 'failed'
]);

export const generationTypeEnum = pgEnum('generation_type', [
  'text_to_image', 'image_to_image'
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  // Subscription fields
  currentPlan: subscriptionPlanEnum("current_plan")
    .$defaultFn(() => 'free'),
  monthlyCredits: integer("monthly_credits")
    .$defaultFn(() => 0),
  purchasedCredits: integer("purchased_credits")
    .$defaultFn(() => 10),
  creditsResetDate: timestamp("credits_reset_date"),
  trialEndsAt: timestamp("trial_ends_at"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

// Subscription tables
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // Payment provider fields
  provider: paymentProviderEnum("provider").notNull(),
  providerSubscriptionId: text("provider_subscription_id").notNull().unique(),
  providerCustomerId: text("provider_customer_id").notNull(),
  // Subscription details
  plan: subscriptionPlanEnum("plan").notNull(),
  status: subscriptionStatusEnum("status").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end")
    .$defaultFn(() => false)
    .notNull(),
  canceledAt: timestamp("canceled_at"),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  // Pricing
  currency: text("currency").notNull(),
  amount: integer("amount").notNull(), // in cents
  interval: text("interval").notNull(), // 'month' or 'year'
  intervalCount: integer("interval_count")
    .$defaultFn(() => 1)
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  subscriptionId: text("subscription_id")
    .references(() => subscriptions.id, { onDelete: "set null" }),
  // Payment provider fields
  provider: paymentProviderEnum("provider").notNull(),
  providerPaymentId: text("provider_payment_id").notNull(),
  providerPaymentIntentId: text("provider_payment_intent_id"),
  // Payment details
  status: paymentStatusEnum("status").notNull(),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").notNull(),
  description: text("description"),
  // Metadata
  metadata: text("metadata"), // JSON string for additional data
  failureCode: text("failure_code"),
  failureMessage: text("failure_message"),
  refundedAmount: integer("refunded_amount")
    .$defaultFn(() => 0)
    .notNull(),
  // Timestamps
  paidAt: timestamp("paid_at"),
  refundedAt: timestamp("refunded_at"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userCredits = pgTable("user_credits", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // Credit details
  type: text("type").notNull(), // 'monthly_reset', 'one_time_purchase', 'bonus', etc.
  amount: integer("amount").notNull(),
  used: integer("used")
    .$defaultFn(() => 0)
    .notNull(),
  remaining: integer("remaining").notNull(),
  // Expiry and reset
  expiresAt: timestamp("expires_at"),
  resetDate: timestamp("reset_date"), // for monthly credits
  // Source tracking
  source: text("source"), // subscription_id, payment_id, or 'signup_bonus'
  description: text("description"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey(),
  provider: paymentProviderEnum("provider").notNull(),
  eventType: text("event_type").notNull(),
  eventId: text("event_id").notNull().unique(),
  processed: boolean("processed")
    .$defaultFn(() => false)
    .notNull(),
  data: text("data").notNull(), // JSON string of the webhook payload
  processingError: text("processing_error"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  processedAt: timestamp("processed_at"),
});

export const aiGenerations = pgTable("ai_generations", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // Generation details
  type: generationTypeEnum("type").notNull(),
  status: generationStatusEnum("status")
    .$defaultFn(() => 'pending')
    .notNull(),
  // Input data
  inputImageUrl: text("input_image_url"), // for image_to_image
  prompt: text("prompt"), // for text_to_image
  // Model configuration
  model: text("model").notNull(), // e.g., "flux-kontext-apps/face-to-many-kontext"
  parameters: text("parameters").notNull(), // JSON string of model parameters
  // Output data
  outputImageUrls: text("output_image_urls"), // JSON array of generated image URLs
  replicateId: text("replicate_id"), // Replicate prediction ID
  // Cost tracking
  creditsUsed: integer("credits_used")
    .$defaultFn(() => 1)
    .notNull(),
  // Error tracking
  errorMessage: text("error_message"),
  // Timestamps
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});
