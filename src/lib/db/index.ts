import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "../env";

let db: PostgresJsDatabase;

declare const globalThis: {
  db: PostgresJsDatabase;
} & typeof global;

if (process.env.NODE_ENV === "production") {
  db = drizzle(postgres(env.DB_URL));
} else {
  if (!globalThis.db) {
    globalThis.db = drizzle(postgres(env.DB_URL));
  }

  db = globalThis.db;
}

export default db;
