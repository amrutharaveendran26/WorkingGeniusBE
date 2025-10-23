import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const projectCategory = pgTable("project_category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
});
