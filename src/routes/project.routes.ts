import express from "express";
import { createProject, getAllProjects } from "../controllers/project.controller";

const router = express.Router();

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - teamId
 *               - statusId
 *               - priorityId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Marketing Campaign"
 *               description:
 *                 type: string
 *                 example: "Launching Q4 marketing campaign"
 *               category:
 *                 type: string
 *                 description: "Project category (e.g. Wonder, Invention, Dream, etc.)"
 *                 example: "Wonder"
 *               teamId:
 *                 type: integer
 *                 example: 4
 *               statusId:
 *                 type: integer
 *                 example: 2
 *               priorityId:
 *                 type: integer
 *                 example: 1
 *               owners:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [3, 1]
 *               boards:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 3]
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-01"
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/", createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects with details (team, owners, boards, status, priority)
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Successfully fetched projects
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllProjects);


export default router;
