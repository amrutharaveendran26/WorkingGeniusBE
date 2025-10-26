import { Request, Response } from "express";
import { db } from "../db";
import { teams } from "../db/schema/team";
import { employees } from "../db/schema/employees";
import { boards } from "../db/schema/boards";
import { projectStatus } from "../db/schema/projectStatus";
import { projectPriority } from "../db/schema/projectPriority";
import { projectCategory } from "../db/schema/projectCategory";

export const getMasterData = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    if (!type || typeof type !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "type query param is required" });
    }

    let data;

    switch (type.toLowerCase()) {
      case "teams":
        data = await db.select().from(teams);
        break;
      case "employees":
        data = await db.select().from(employees);
        break;
      case "boards":
        data = await db.select().from(boards);
        break;
      case "status":
        data = await db.select().from(projectStatus);
        break;
      case "priority":
        data = await db.select().from(projectPriority);
        break;
      case "category":
        data = await db.select().from(projectCategory);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Invalid type: '${type}'. Allowed: teams, employees, boards, status, priority, category`,
        });
    }

    return res.status(200).json({
      success: true,
      type,
      count: data.length,
      data,
    });
  } catch (err: any) {
    console.error("Error in getMasterData:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch master data",
      error: err.message,
    });
  }
};
