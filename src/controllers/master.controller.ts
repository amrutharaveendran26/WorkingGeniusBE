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
    const [teamsData, employeesData, boardsData, statusData, priorityData, categoryData] =
      await Promise.all([
        db.select().from(teams),
        db.select().from(employees),
        db.select().from(boards),
        db.select().from(projectStatus),
        db.select().from(projectPriority),
        db.select().from(projectCategory),
      ]);

    return res.status(200).json({
      success: true,
      message: "All master data fetched successfully",
      data: {
        teams: teamsData,
        employees: employeesData,
        boards: boardsData,
        statuses: statusData,
        priorities: priorityData,
        categories: categoryData,
      },
    });
  } catch (err: any) {
    console.error("Error in getAllMasterData:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all master data",
      error: err.message,
    });
  }
};
