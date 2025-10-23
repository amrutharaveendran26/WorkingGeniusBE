import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "techmission",
  password: "Amrutha26", // <-- hardcoded to test
  port: 5432,
});

export const db = drizzle(pool, { schema });

console.log("✅ PostgreSQL connected successfully!");
