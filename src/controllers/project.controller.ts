import { Request, Response } from "express";
import { db } from "../db";
import { projects } from "../db/schema/project";
import { projectOwners } from "../db/schema/projectOwners";
import { projectBoards } from "../db/schema/projectBoards";
import { projectStatus } from "../db/schema/projectStatus";
import { projectPriority } from "../db/schema/projectPriority";
import { teams as teamTable } from "../db/schema/team";
import { and, eq, inArray, count } from "drizzle-orm";
import { employees } from "../db/schema/employees";
import { boards } from "../db/schema/boards";
import { projectCategory } from "../db/schema/projectCategory";
import { tasks } from "../db/schema";

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
      tasks: taskList,
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

    if (taskList?.length) {
      await db.insert(tasks).values(
        taskList.map((t: any) => ({
          title: t.title,
          dueDate: t.dueDate ?? null,
          assignedTo: t.assignedTo ?? null,
          projectId: newProject.id,
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

const groupBy = <T>(array: T[], key: keyof T): Record<number, T[]> => {
  return array.reduce((acc, item: any) => {
    const groupKey = item[key];
    if (groupKey == null) return acc;
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<number, T[]>);
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    const projectList = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        dueDate: projects.dueDate,
        teamId: projects.teamId,
        statusId: projects.statusId,
        priorityId: projects.priorityId,
        categoryId: projects.categoryId,
        team: teamTable.name,
        status: projectStatus.name,
        priority: projectPriority.name,
        category: projectCategory.name,
      })
      .from(projects)
      .leftJoin(teamTable, eq(projects.teamId, teamTable.id))
      .leftJoin(projectStatus, eq(projects.statusId, projectStatus.id))
      .leftJoin(projectPriority, eq(projects.priorityId, projectPriority.id))
      .leftJoin(projectCategory, eq(projects.categoryId, projectCategory.id))
      .where(eq(projects.isDeleted, false))
      .limit(limitNum)
      .offset(offset);

    if (!projectList.length) {
      return res.status(200).json({
        success: true,
        message: "No projects found",
        projects: [],
        total: 0,
        page: pageNum,
      });
    }

    const projectIds = projectList.map((p) => p.id);

    const [ownerLinks, boardLinks, taskList] = await Promise.all([
      db
        .select()
        .from(projectOwners)
        .where(inArray(projectOwners.projectId, projectIds)),
      db
        .select()
        .from(projectBoards)
        .where(inArray(projectBoards.projectId, projectIds)),
      db
        .select({
          id: tasks.id,
          title: tasks.title,
          dueDate: tasks.dueDate,
          assignedTo: tasks.assignedTo,
          projectId: tasks.projectId,
        })
        .from(tasks)
        .where(
          and(inArray(tasks.projectId, projectIds), eq(tasks.isDeleted, false))
        ),
    ]);

    const uniqueEmployeeIds = Array.from(
      new Set(
        [
          ...ownerLinks.map((o) => o.ownerId),
          ...taskList.map((t) => t.assignedTo),
        ].filter((id): id is number => id != null)
      )
    );

    const employeesList =
      uniqueEmployeeIds.length > 0
        ? await db
            .select({
              id: employees.id,
              name: employees.name,
              email: employees.email,
            })
            .from(employees)
            .where(inArray(employees.id, uniqueEmployeeIds))
        : [];

    const uniqueBoardIds = Array.from(
      new Set(
        boardLinks
          .map((b) => b.boardId)
          .filter((id): id is number => id != null)
      )
    );

    const boardsList =
      uniqueBoardIds.length > 0
        ? await db
            .select({ id: boards.id, name: boards.name })
            .from(boards)
            .where(inArray(boards.id, uniqueBoardIds))
        : [];

    const ownersByProject = groupBy(ownerLinks, "projectId");
    const boardsByProject = groupBy(boardLinks, "projectId");
    const tasksByProject = groupBy(taskList, "projectId");

    const employeeMap: Record<
      number,
      { id: number; name: string; email: string | null }
    > = {};

    employeesList.forEach((emp) => {
      if (emp.id != null) {
        employeeMap[emp.id] = {
          id: emp.id,
          name: emp.name,
          email: emp.email ?? null, 
        };
      }
    });

    const boardMap: Record<number, { id: number; name: string | null }> = {};

    boardsList.forEach((b) => {
      if (b.id != null) {
        boardMap[b.id] = { id: b.id, name: b.name ?? null };
      }
    });

    const detailedProjects = projectList.map((project) => {
      const owners =
        ownersByProject[project.id]
          ?.filter((o) => o.ownerId != null)
          .map((o) => employeeMap[o.ownerId!]) ?? [];

      const boardDetails =
        boardsByProject[project.id]
          ?.filter((b) => b.boardId != null)
          .map((b) => boardMap[b.boardId!]) ?? [];

      const subtasks =
        tasksByProject[project.id]?.map((t) => ({
          id: t.id,
          title: t.title,
          dueDate: t.dueDate,
          assignedTo: t.assignedTo,
          assignee: t.assignedTo
            ? employeeMap[t.assignedTo]?.name ?? "Unassigned"
            : "Unassigned",
        })) ?? [];

      return {
        ...project,
        owners,
        boards: boardDetails,
        subtasks,
      };
    });

    const [{ total }] = await db
      .select({ total: count(projects.id) })
      .from(projects)
      .where(eq(projects.isDeleted, false));

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      page: pageNum,
      limit: limitNum,
      total: Number(total),
      projects: detailedProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      details: (error as Error).message,
    });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, Number(id)), eq(projects.isDeleted, false)));

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or inactive",
      });
    }

    const [team] =
      project.teamId != null
        ? await db
            .select({ id: teamTable.id, name: teamTable.name })
            .from(teamTable)
            .where(eq(teamTable.id, Number(project.teamId)))
        : [null];

    const [status] =
      project.statusId != null
        ? await db
            .select({ id: projectStatus.id, name: projectStatus.name })
            .from(projectStatus)
            .where(eq(projectStatus.id, Number(project.statusId)))
        : [null];

    const [priority] =
      project.priorityId != null
        ? await db
            .select({ id: projectPriority.id, name: projectPriority.name })
            .from(projectPriority)
            .where(eq(projectPriority.id, Number(project.priorityId)))
        : [null];

    const [category] =
      project.categoryId != null
        ? await db
            .select({ id: projectCategory.id, name: projectCategory.name })
            .from(projectCategory)
            .where(eq(projectCategory.id, Number(project.categoryId)))
        : [null];

    const ownerLinks = await db
      .select()
      .from(projectOwners)
      .where(eq(projectOwners.projectId, Number(project.id)));

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
      .where(eq(projectBoards.projectId, Number(project.id)));

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

    // ✅ Fetch subtasks
    const subtaskList = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        dueDate: tasks.dueDate,
        assignedTo: tasks.assignedTo,
        isDeleted: tasks.isDeleted,
      })
      .from(tasks)
      .where(and(eq(tasks.projectId, project.id), eq(tasks.isDeleted, false)));

    const assignedIds = subtaskList
      .map((s) => s.assignedTo)
      .filter((id): id is number => id != null);
    let assignedUsers: Record<number, string> = {};
    if (assignedIds.length > 0) {
      const employeesFound = await db
        .select({ id: employees.id, name: employees.name })
        .from(employees)
        .where(inArray(employees.id, assignedIds));

      employeesFound.forEach((emp) => {
        assignedUsers[emp.id] = emp.name;
      });
    }

    const subtasksWithDetails = subtaskList.map((s) => ({
      id: s.id,
      title: s.title,
      dueDate: s.dueDate,
      assignedTo: s.assignedTo,
      assignee: assignedUsers[s.assignedTo ?? 0] ?? "Unassigned",
      completed: false,
    }));

    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      project: {
        ...project,
        category: category?.name ?? null,
        team: team?.name ?? null,
        status: status?.name ?? null,
        priority: priority?.name ?? null,
        owners: ownerDetails,
        boards: boardDetails,
        subtasks: subtasksWithDetails,
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
      tasks: taskList,
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

    if (owners?.length) {
      await db
        .delete(projectOwners)
        .where(eq(projectOwners.projectId, Number(id)));
      await db
        .insert(projectOwners)
        .values(
          owners.map((ownerId: number) => ({ projectId: Number(id), ownerId }))
        );
    }

    if (boards?.length) {
      await db
        .delete(projectBoards)
        .where(eq(projectBoards.projectId, Number(id)));
      await db
        .insert(projectBoards)
        .values(
          boards.map((boardId: number) => ({ projectId: Number(id), boardId }))
        );
    }

    if (taskList?.length) {
      await db.delete(tasks).where(eq(tasks.projectId, Number(id)));
      await db.insert(tasks).values(
        taskList.map((t: any) => ({
          title: t.title,
          dueDate: t.dueDate ?? null,
          assignedTo: t.assignedTo ?? null,
          projectId: Number(id),
        }))
      );
    }

    res.status(200).json({
      success: true,
      message: "Project and tasks updated successfully",
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

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db
      .update(projects)
      .set({ isDeleted: true })
      .where(eq(projects.id, Number(id)));

    await db
      .update(tasks)
      .set({ isDeleted: true })
      .where(eq(tasks.projectId, Number(id)));

    res
      .status(200)
      .json({ success: true, message: "Project soft-deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      details: error,
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskId = Number(id);

    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format. Must be a number.",
      });
    }

    const [taskExists] = await db
      .select({ id: tasks.id })
      .from(tasks)
      .where(eq(tasks.id, taskId));

    if (!taskExists) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await db.update(tasks).set({ isDeleted: true }).where(eq(tasks.id, taskId));

    res
      .status(200)
      .json({ success: true, message: "Task soft-deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      details: error,
    });
  }
};
