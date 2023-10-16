import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DB_URL: z.string().url(),
  CLOUDFLARE_SECRET_KEY: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
