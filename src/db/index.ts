import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Configure Neon client with better error handling
const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: {
    cache: "no-store",
  },
});

export const db = drizzle(sql);
