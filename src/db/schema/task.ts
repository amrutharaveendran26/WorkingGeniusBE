import { pgTable, serial, varchar, integer, date, timestamp, boolean } from "drizzle-orm/pg-core";
import { projects } from "./project";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),  
  dueDate: date("due_date"),                          
  assignedTo: integer("assigned_to"),                  
  projectId: integer("project_id").references(() => projects.id),
  isDeleted: boolean("is_deleted").default(false),     
  createdAt: timestamp("created_at").defaultNow(),
});
