import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "free",
  "starter",
  "pro",
  "credits_pack",
]);

export const generationStatusEnum = pgEnum("generation_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const generationTypeEnum = pgEnum("generation_type", [
  "text_to_image",
  "image_to_image",
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
  currentPlan: subscriptionPlanEnum("current_plan").$defaultFn(() => "free"),
  monthlyCredits: integer("monthly_credits").$defaultFn(() => 0),
  purchasedCredits: integer("purchased_credits").$defaultFn(() => 0),
  creditsResetDate: timestamp("credits_reset_date"),
  trialEndsAt: timestamp("trial_ends_at"),
  // Stripe fields
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  // Subscription details
  subscriptionAmount: integer("subscription_amount"), // amount in cents
  subscriptionCurrency: text("subscription_currency"), // e.g., "USD"
  subscriptionInterval: text("subscription_interval"), // "month" or "year"
  cancelAtPeriodEnd: boolean("cancel_at_period_end").$defaultFn(() => false),
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

export const userCredits = pgTable("user_credits", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // Credit details
  type: text("type").notNull(), // 'signup_bonus', 'initial_grant', 'monthly_reset', 'one_time_purchase', 'usage'
  amount: integer("amount").notNull(), // positive for grants, negative for usage
  remaining: integer("remaining").notNull(), // total remaining balance at time of record
  // Reset date for monthly credits
  resetDate: timestamp("reset_date"), // for monthly credits
  // Source tracking
  source: text("source"), // subscription_id, payment_id, or 'signup_bonus'
  description: text("description"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey(),
  provider: text("provider").notNull(), // "stripe", "creem", "paypal"
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
    .$defaultFn(() => "pending")
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
