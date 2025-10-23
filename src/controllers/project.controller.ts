import { Request, Response } from "express";
import { db } from "../db";
import { projects } from "../db/schema/project";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, status, startDate, endDate, teamId } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const newProject = await db
      .insert(projects)
      .values({
        name,
        description,
        status,
        startDate,
        endDate,
        teamId,
      })
      .returning();

    return res.status(201).json({
      message: " Project created successfully",
      data: newProject[0],
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      error: "Failed to create project",
      details: (error as Error).message,
    });
  }
};
