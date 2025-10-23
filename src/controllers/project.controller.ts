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
import { projectCategory } from "../db/schema/projectCategory";

export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      categoryId,
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
        categoryId,
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
        const team =
          project.teamId !== null && project.teamId !== undefined
            ? (
                await db
                  .select({ id: teamTable.id, name: teamTable.name })
                  .from(teamTable)
                  .where(eq(teamTable.id, project.teamId))
              )[0]
            : null;

        const status =
          project.statusId !== null && project.statusId !== undefined
            ? (
                await db
                  .select({ id: projectStatus.id, name: projectStatus.name })
                  .from(projectStatus)
                  .where(eq(projectStatus.id, project.statusId))
              )[0]
            : null;

        const priority =
          project.priorityId !== null && project.priorityId !== undefined
            ? (
                await db
                  .select({
                    id: projectPriority.id,
                    name: projectPriority.name,
                  })
                  .from(projectPriority)
                  .where(eq(projectPriority.id, project.priorityId))
              )[0]
            : null;

        // ✅ Category
        const category =
          project.categoryId !== null && project.categoryId !== undefined
            ? (
                await db
                  .select({
                    id: projectCategory.id,
                    name: projectCategory.name,
                  })
                  .from(projectCategory)
                  .where(eq(projectCategory.id, project.categoryId))
              )[0]
            : null;

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
          category: category ? category.name : null,
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

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, Number(id)));

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const [team] =
      project.teamId !== null && project.teamId !== undefined
        ? await db
            .select({ id: teamTable.id, name: teamTable.name })
            .from(teamTable)
            .where(eq(teamTable.id, project.teamId))
        : [null];

    const [status] =
      project.statusId !== null && project.statusId !== undefined
        ? await db
            .select({ id: projectStatus.id, name: projectStatus.name })
            .from(projectStatus)
            .where(eq(projectStatus.id, project.statusId))
        : [null];

    const [priority] =
      project.priorityId !== null && project.priorityId !== undefined
        ? await db
            .select({ id: projectPriority.id, name: projectPriority.name })
            .from(projectPriority)
            .where(eq(projectPriority.id, project.priorityId))
        : [null];

    const [category] =
      project.categoryId !== null && project.categoryId !== undefined
        ? await db
            .select({ id: projectCategory.id, name: projectCategory.name })
            .from(projectCategory)
            .where(eq(projectCategory.id, project.categoryId))
        : [null];

    const ownerLinks = await db
      .select()
      .from(projectOwners)
      .where(eq(projectOwners.projectId, project.id));

    const ownerIds = ownerLinks
      .map((o) => o.ownerId)
      .filter((id): id is number => typeof id === "number");
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

    const boardLinks = await db
      .select()
      .from(projectBoards)
      .where(eq(projectBoards.projectId, project.id));

    const boardIds = boardLinks
      .map((b) => b.boardId)
      .filter((id): id is number => typeof id === "number");
    const boardDetails =
      boardIds.length > 0
        ? await db
            .select({ id: boards.id, name: boards.name })
            .from(boards)
            .where(inArray(boards.id, boardIds))
        : [];

    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      project: {
        ...project,
        category: category ? category.name : null,
        team: team ? team.name : null,
        status: status ? status.name : null,
        priority: priority ? priority.name : null,
        owners: ownerDetails,
        boards: boardDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      details: error,
    });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      categoryId,
      teamId,
      statusId,
      priorityId,
      owners,
      boards,
      dueDate,
    } = req.body;

    const [existingProject] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, Number(id)));

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const [updatedProject] = await db
      .update(projects)
      .set({
        title,
        description,
        categoryId,
        teamId,
        statusId,
        priorityId,
        dueDate,
      })
      .where(eq(projects.id, Number(id)))
      .returning();

    if (owners && owners.length > 0) {
      await db
        .delete(projectOwners)
        .where(eq(projectOwners.projectId, Number(id)));
      await db.insert(projectOwners).values(
        owners.map((ownerId: number) => ({
          projectId: Number(id),
          ownerId,
        }))
      );
    }

    if (boards && boards.length > 0) {
      await db
        .delete(projectBoards)
        .where(eq(projectBoards.projectId, Number(id)));
      await db.insert(projectBoards).values(
        boards.map((boardId: number) => ({
          projectId: Number(id),
          boardId,
        }))
      );
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      details: error,
    });
  }
};
