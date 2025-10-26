// src/controllers/comment.controller.ts
import { Request, Response } from "express";
import { db } from "../db";
import { comments } from "../db/schema/comment";
import { projects } from "../db/schema/project";
import { eq } from "drizzle-orm";

export const addProjectComment = async (req: Request, res: Response) => {
  try {
    const { projectId, content, userName } = req.body;

    if (!projectId || typeof projectId !== "number") {
      return res
        .status(400)
        .json({ success: false, message: "projectId must be a number" });
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Comment content is required" });
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId));

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const [newComment] = await db
      .insert(comments)
      .values({
        projectId,
        content: content.trim(),
        userName: userName || "You",
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (err) {
    console.error("Error in addProjectComment:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: err,
    });
  }
};

export const getCommentsByProject = async (req: Request, res: Response) => {
  try {
    const projectId = Number(req.params.projectId);
    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid projectId" });
    }

    const commentRows = await db
      .select()
      .from(comments)
      .where(eq(comments.projectId, projectId));

    return res.status(200).json({
      success: true,
      comments: commentRows,
    });
  } catch (err) {
    console.error("Error fetching comments:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch comments" });
  }
};
