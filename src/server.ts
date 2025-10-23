import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { projects } from "./db/schema/project";
import { setupSwagger } from "./swagger";
import { db } from "./db";
import projectRoutes from "./routes/project.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

setupSwagger(app);

app.use("/api/projects", projectRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
