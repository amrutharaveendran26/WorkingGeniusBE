import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core"

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
})
