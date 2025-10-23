import { Request, Response } from "express";
import { db } from "../db";
import { comments } from "../db/schema/comment";
import { employees } from "../db/schema/employees";
import { tasks } from "../db/schema/task";
import { eq, inArray } from "drizzle-orm";


export const addComment = async (req: Request, res: Response) => {
  try {
    const { taskId, userId, content } = req.body;

    if (!taskId || typeof taskId !== "number") {
      return res.status(400).json({
        success: false,
        message: "taskId is required and must be a number",
      });
    }
    if (!userId || typeof userId !== "number") {
      return res.status(400).json({
        success: false,
        message: "userId is required and must be a number",
      });
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "content is required" });
    }

    const [foundTask] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId));
    if (!foundTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const [foundUser] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, userId));
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: "User (employee) not found" });
    }

    const [newComment] = await db
      .insert(comments)
      .values({
        taskId,
        userId,
        content: content.trim(),
      })
      .returning();

    return res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    console.error("Error in createComment:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create comment",
      details: err,
    });
  }
};


export const getCommentsByTask = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.taskId);
    if (!taskId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid taskId" });
    }

    const commentRows = await db
      .select()
      .from(comments)
      .where(eq(comments.taskId, taskId));

    const userIds = Array.from(
      new Set(
        commentRows.map((c) => c.userId).filter((id): id is number => !!id)
      )
    );
    const users =
      userIds.length > 0
        ? await db
            .select({
              id: employees.id,
              name: employees.name,
              email: employees.email,
            })
            .from(employees)
            .where(inArray(employees.id, userIds))
        : [];

    const userMap = new Map<
      number,
      { id: number; name: string; email: string | null }
    >();
    users.forEach((u) => userMap.set(u.id, u));

    const commentsWithUser = commentRows.map((c) => ({
      id: c.id,
      taskId: c.taskId,
      userId: c.userId,
      content: c.content,
      createdAt: c.createdAt,
      user: c.userId ? userMap.get(c.userId) ?? null : null,
    }));

    return res.status(200).json({ success: true, comments: commentsWithUser });
  } catch (err) {
    console.error("Error in getCommentsForTask:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      details: err,
    });
  }
};
