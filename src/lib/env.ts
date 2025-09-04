import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  BETTER_AUTH_SECRET: z.string().min(20).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);

if (!env.DATABASE_URL || !env.BETTER_AUTH_SECRET) {
  console.warn("⚠️ Missing critical env vars. Check .env.local or Vercel settings.");
}
