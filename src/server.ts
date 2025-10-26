import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { setupSwagger } from "./swagger";
import projectRoutes from "./routes/project.routes";
import commentRoutes from "./routes/comment.routes";
import masterRoutes from "./routes/master.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

setupSwagger(app);

app.use("/api/projects", projectRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/master", masterRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Swagger Docs running at http://localhost:${PORT}/api-docs`);
  console.log(` Server running on http://localhost:${PORT}`);
});
