import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { projects } from "./db/schema/project";
import { setupSwagger } from "./swagger";
import { db } from "./db";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Setup Swagger
setupSwagger(app);

// Example: Create Project
app.post("/api/projects", async (req, res) => {
  try {
    const result = await db.insert(projects).values(req.body).returning();
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Example: Get All Projects
app.get("/api/projects", async (req, res) => {
  const result = await db.select().from(projects);
  res.json(result);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
