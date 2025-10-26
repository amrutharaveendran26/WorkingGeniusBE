import express from "express";
import { addProjectComment, getCommentsByProject } from "../controllers/comment.controller";

const router = express.Router();

/**
 * @swagger
 * /api/comments/project:
 *   post:
 *     summary: Add a new comment to a project (no auth required)
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - content
 *             properties:
 *               projectId:
 *                 type: integer
 *                 example: 5
 *               userName:
 *                 type: string
 *                 example: "You"
 *               content:
 *                 type: string
 *                 example: "Let's finalize the deployment checklist by EOD."
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/project", addProjectComment);

/**
 * @swagger
 * /api/comments/project/{projectId}:
 *   get:
 *     summary: Get all comments for a specific project
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project to fetch comments for
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *       404:
 *         description: Project not found or has no comments
 */
router.get("/project/:projectId", getCommentsByProject);

export default router;
