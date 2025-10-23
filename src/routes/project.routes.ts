import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/project.controller";

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
 *               - categoryId
 *               - teamId
 *               - statusId
 *               - priorityId
 *             properties:
 *               title:
 *                 type: string
 *                 description: "Title of the project"
 *                 example: "New Marketing Campaign"
 *               description:
 *                 type: string
 *                 description: "Detailed description of the project"
 *                 example: "Launching Q4 marketing campaign"
 *               categoryId:
 *                 type: integer
 *                 description: "ID of the project category (e.g., Wonder, Invention, etc.)"
 *                 example: 1
 *               teamId:
 *                 type: integer
 *                 description: "ID of the team handling the project"
 *                 example: 4
 *               statusId:
 *                 type: integer
 *                 description: "ID of the project status (e.g., On Track, At Risk, Blocked)"
 *                 example: 2
 *               priorityId:
 *                 type: integer
 *                 description: "ID of the project priority (e.g., High, Medium, Low)"
 *                 example: 1
 *               owners:
 *                 type: array
 *                 description: "List of owner (employee) IDs assigned to the project"
 *                 items:
 *                   type: integer
 *                 example: [3, 1]
 *               boards:
 *                 type: array
 *                 description: "List of board IDs the project belongs to"
 *                 items:
 *                   type: integer
 *                 example: [1, 3]
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: "Project due date"
 *                 example: "2024-12-01"
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Internal server error
 */
router.post("/", createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects with details (team, owners, boards, status, priority,category)
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Successfully fetched projects
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *       404:
 *         description: Project not found
 */
router.get("/:id", getProjectById);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update an existing project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Campaign"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *               teamId:
 *                 type: integer
 *                 example: 1
 *               statusId:
 *                 type: integer
 *                 example: 3
 *               priorityId:
 *                 type: integer
 *                 example: 1
 *               owners:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 3]
 *               boards:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-10"
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateProject);

export default router;
