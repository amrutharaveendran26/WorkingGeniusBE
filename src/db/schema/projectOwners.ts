import { pgTable, integer } from "drizzle-orm/pg-core";
import { projects } from "./project";
import { employees } from "./employees";

export const projectOwners = pgTable("project_owners", {
  projectId: integer("project_id").references(() => projects.id, { onDelete: "cascade" }),
  ownerId: integer("owner_id").references(() => employees.id, { onDelete: "cascade" }),
});
