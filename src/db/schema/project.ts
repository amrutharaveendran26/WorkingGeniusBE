import { pgTable, serial, varchar, text, date, integer, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { teams } from "./team"
import { tasks } from "./task"

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("Planned"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  teamId: integer("team_id").references(() => teams.id),
  createdAt: timestamp("created_at").defaultNow(),
})

export const projectRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
}))
