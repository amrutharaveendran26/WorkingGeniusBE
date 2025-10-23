import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const projectStatus = pgTable("project_status", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  description: varchar("description", { length: 150 }),
});
