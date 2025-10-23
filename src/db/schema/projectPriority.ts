import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const projectPriority = pgTable("project_priority", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  description: varchar("description", { length: 150 }),
});
