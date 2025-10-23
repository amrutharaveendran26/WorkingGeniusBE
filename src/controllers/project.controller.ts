import { Request, Response } from "express";
import { db } from "../db";
import { projects } from "../db/schema/project";
import { projectOwners } from "../db/schema/projectOwners";
import { projectBoards } from "../db/schema/projectBoards";
import { projectStatus } from "../db/schema/projectStatus";
import { projectPriority } from "../db/schema/projectPriority";
import { teams as teamTable } from "../db/schema/team";
import { eq, inArray } from "drizzle-orm";
import { employees } from "../db/schema/employees";
import { boards } from "../db/schema/boards";

export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      teamId,
      statusId,
      priorityId,
      owners,
      boards,
      dueDate,
    } = req.body;

    const [newProject] = await db
      .insert(projects)
      .values({
        title,
        description,
        category,
        teamId,
        statusId,
        priorityId,
        dueDate,
      })
      .returning();

    if (owners && owners.length > 0) {
      await db.insert(projectOwners).values(
        owners.map((ownerId: number) => ({
          projectId: newProject.id,
          ownerId,
        }))
      );
    }

    if (boards && boards.length > 0) {
      await db.insert(projectBoards).values(
        boards.map((boardId: number) => ({
          projectId: newProject.id,
          boardId,
        }))
      );
    }

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project",
      details: error,
    });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const allProjects = await db.select().from(projects);

    const detailedProjects = await Promise.all(
      allProjects.map(async (project) => {
        // ✅ Team
        const team =
          project.teamId !== null && project.teamId !== undefined
            ? (
                await db
                  .select({ id: teamTable.id, name: teamTable.name })
                  .from(teamTable)
                  .where(eq(teamTable.id, project.teamId))
              )[0]
            : null;

        // ✅ Status
        const status =
          project.statusId !== null && project.statusId !== undefined
            ? (
                await db
                  .select({ id: projectStatus.id, name: projectStatus.name })
                  .from(projectStatus)
                  .where(eq(projectStatus.id, project.statusId))
              )[0]
            : null;

        // ✅ Priority
        const priority =
          project.priorityId !== null && project.priorityId !== undefined
            ? (
                await db
                  .select({ id: projectPriority.id, name: projectPriority.name })
                  .from(projectPriority)
                  .where(eq(projectPriority.id, project.priorityId))
              )[0]
            : null;

        // ✅ Owners (many-to-many)
        const ownerLinks = await db
          .select()
          .from(projectOwners)
          .where(eq(projectOwners.projectId, project.id));

        const ownerIds = ownerLinks
          .map((o) => o.ownerId)
          .filter((id): id is number => id !== null && id !== undefined);

        const ownerDetails =
          ownerIds.length > 0
            ? await db
                .select({
                  id: employees.id,
                  name: employees.name,
                  email: employees.email,
                })
                .from(employees)
                .where(inArray(employees.id, ownerIds))
            : [];

        // ✅ Boards (many-to-many)
        const boardLinks = await db
          .select()
          .from(projectBoards)
          .where(eq(projectBoards.projectId, project.id));

        const boardIds = boardLinks
          .map((b) => b.boardId)
          .filter((id): id is number => id !== null && id !== undefined);

        const boardDetails =
          boardIds.length > 0
            ? await db
                .select({
                  id: boards.id,
                  name: boards.name,
                })
                .from(boards)
                .where(inArray(boards.id, boardIds))
            : [];

        return {
          ...project,
          team: team ? team.name : null,
          status: status ? status.name : null,
          priority: priority ? priority.name : null,
          owners: ownerDetails,
          boards: boardDetails,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      projects: detailedProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      details: error,
    });
  }
};
