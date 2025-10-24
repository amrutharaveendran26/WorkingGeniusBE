import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  deleteTask,
} from "../controllers/project.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management APIs
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project (with optional tasks)
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
 *                 example: 1
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
 *                 example: "2025-03-01"
 *               tasks:
 *                 type: array
 *                 description: "Optional list of tasks under this project"
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Design Homepage UI"
 *                     dueDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-02-15"
 *                     assignedTo:
 *                       type: integer
 *                       example: 7
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/", createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all active projects (excluding soft-deleted)
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
 *     summary: Get a specific project by ID (excluding soft-deleted)
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *       404:
 *         description: Project not found or inactive
 */
router.get("/:id", getProjectById);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project and its tasks
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
 *                 example: "Updated Campaign Plan"
 *               description:
 *                 type: string
 *                 example: "Revised Q4 campaign execution plan"
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
 *                 example: "2025-04-10"
 *               tasks:
 *                 type: array
 *                 description: "List of tasks to replace existing tasks"
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Finalize Poster Design"
 *                     dueDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-03-25"
 *                     assignedTo:
 *                       type: integer
 *                       example: 5
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Soft delete a project and all its tasks
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project soft-deleted successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteProject);

/**
 * @swagger
 * /api/projects/tasks/{id}:
 *   delete:
 *     summary: Soft delete a specific task
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task soft-deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete("/tasks/:id", deleteTask);

export default router;
