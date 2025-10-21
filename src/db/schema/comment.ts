import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core"
import { tasks } from "./task"

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id),
  userId: integer("user_id"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})
