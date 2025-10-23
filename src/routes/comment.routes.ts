import express from "express";
import { addComment, getCommentsByTask } from "../controllers/comment.controller";

const router = express.Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Add a new comment to a task
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *               - userId
 *               - content
 *             properties:
 *               taskId:
 *                 type: integer
 *                 example: 2
 *               userId:
 *                 type: integer
 *                 example: 3
 *               content:
 *                 type: string
 *                 example: "This needs review before submission."
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/", addComment);

/**
 * @swagger
 * /api/comments/task/{taskId}:
 *   get:
 *     summary: Get all comments for a specific task
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the task to fetch comments for
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *       404:
 *         description: Task not found or has no comments
 */
router.get("/task/:taskId", getCommentsByTask);

export default router;
