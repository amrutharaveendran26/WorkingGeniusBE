import { pgTable, serial, varchar, timestamp, text } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).unique().notNull(),
  role: varchar("role", { length: 50 }).default("Member"),
  createdAt: timestamp("created_at").defaultNow(),
})
