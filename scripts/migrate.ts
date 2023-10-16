import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DB_URL || "";
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function main() {
  await migrate(db, { migrationsFolder: "drizzle" });
  sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
