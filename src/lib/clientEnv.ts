import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_CLOUDFLARE_SITE_KEY: z.string(),
});

// Note: This must be specified explicitly as Next.js replaces process.env.* with
// the value at build time.
const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_CLOUDFLARE_SITE_KEY: process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY,
});

export default clientEnv;
