import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "../env";

// for query purposes
const queryClient = postgres(env.DB_URL);
export const db: PostgresJsDatabase = drizzle(queryClient);
