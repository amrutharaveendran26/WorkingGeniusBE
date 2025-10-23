import express from "express";
import { createProject } from "../controllers/project.controller";

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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Marketing Campaign"
 *               description:
 *                 type: string
 *                 example: "Launching Q4 marketing campaign"
 *               status:
 *                 type: string
 *                 example: "In Progress"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-28"
 *               teamId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/", createProject);

export default router;
