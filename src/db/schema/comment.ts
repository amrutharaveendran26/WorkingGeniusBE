// src/db/schema/comment.ts
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./project";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id), 
  userName: text("user_name").default("Guest"), 
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
