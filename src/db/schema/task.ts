import { pgTable, serial, varchar, text, integer, timestamp } from "drizzle-orm/pg-core"
import { projects } from "./project"

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("Todo"),
  priority: varchar("priority", { length: 20 }).default("Medium"),
  projectId: integer("project_id").references(() => projects.id),
  assignedTo: integer("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
})
