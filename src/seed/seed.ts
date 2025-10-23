import { db } from "../db";
import { teams } from "../db/schema/team";
import { employees } from "../db/schema/employees";
import { boards } from "../db/schema/boards";
import { projectStatus } from "../db/schema/projectStatus";
import { projectPriority } from "../db/schema/projectPriority";

async function seedData() {
  // Teams
  await db.insert(teams).values([
    {
      name: "Marketing Team",
      description: "Handles marketing and campaign initiatives",
    },
    {
      name: "Product Development Team",
      description: "Focuses on building and improving products",
    },
    {
      name: "Customer Success Team",
      description: "Ensures client satisfaction and retention",
    },
    {
      name: "Operations Team",
      description: "Manages logistics and internal efficiency",
    },
    {
      name: "Finance & Strategy Team",
      description: "Handles budgets, forecasts, and company strategy",
    },
  ]);

  // Employees (owners)
  await db.insert(employees).values([
    { name: "Amrutha", email: "amrutha@company.com", role: "Designer" },
    { name: "Arunima", email: "arunima@company.com", role: "Developer" },
    { name: "Amal", email: "amal@company.com", role: "Product Analyst" },
    { name: "Ananya", email: "ananya@company.com", role: "Finance Manager" },
    { name: "Ravi", email: "ravi@company.com", role: "Customer Success Lead" },
  ]);

  //Boards
  await db.insert(boards).values([
    { name: "Marketing Team Meetings" },
    { name: "Social Media" },
    { name: "Product Development" },
    { name: "Customer Support" },
    { name: "Finance Review" },
    { name: "Operations Planning" },
  ]);

  // Status
  await db.insert(projectStatus).values([
    { name: "on-track", description: "Project progressing as planned" },
    { name: "at-risk", description: "Needs attention" },
    { name: "blocked", description: "Halted due to dependencies" },
    { name: "completed", description: "Successfully completed" },
    { name: "on-hold", description: "Temporarily paused" },
  ]);

  // Priority
  await db.insert(projectPriority).values([
    { name: "high", description: "Critical project requiring immediate attention" },
    { name: "medium", description: "Important but not urgent" },
    { name: "low", description: "Low urgency, can be scheduled flexibly" },
  ]);

  console.log("Seeded teams, employees, boards, status, and priority successfully!");
}

seedData().catch(console.error);
