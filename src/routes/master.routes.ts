import express from "express";
import { getMasterData } from "../controllers/master.controller";

const router = express.Router();

/**
 * @swagger
 * /api/master:
 *   get:
 *     summary: Fetch master data by type (teams, employees, boards, status, priority, category)
 *     tags: [Master]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [teams, employees, boards, status, priority, category]
 *         description: Master data type to fetch
 *     responses:
 *       200:
 *         description: Successfully fetched master data
 *       400:
 *         description: Invalid or missing type
 *       500:
 *         description: Server error
 */
router.get("/all", getMasterData);

export default router;
