import { pgTable, integer } from "drizzle-orm/pg-core";
import { projects } from "./project";
import { boards } from "./boards";

export const projectBoards = pgTable("project_boards", {
  projectId: integer("project_id").references(() => projects.id, { onDelete: "cascade" }),
  boardId: integer("board_id").references(() => boards.id, { onDelete: "cascade" }),
});
