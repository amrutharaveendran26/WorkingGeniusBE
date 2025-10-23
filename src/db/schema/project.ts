import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { teams } from "./team";
import { projectStatus } from "./projectStatus";
import { projectPriority } from "./projectPriority";
import { projectOwners } from "./projectOwners";
import { projectBoards } from "./projectBoards";
import { projectCategory } from "./projectCategory";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => projectCategory.id),
  teamId: integer("team_id").references(() => teams.id),
  statusId: integer("status_id").references(() => projectStatus.id),
  priorityId: integer("priority_id").references(() => projectPriority.id),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projectRelations = relations(projects, ({ many }) => ({
  owners: many(projectOwners),
  boards: many(projectBoards),
}));
