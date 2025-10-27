#TechMission Project — Working Genius Management

A **Task and Project Management System** built with a **TypeScript full-stack architecture** using **Next.js**, **Express**, and **PostgreSQL**.  
It allows users to **create, view, update, and soft-delete projects**, manage **subtasks, comments, owners, and boards**, and test APIs directly via **Swagger UI**.

---

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, SWR, TailwindCSS, shadcn/ui
- **Backend:** Node.js, Express, TypeScript, Drizzle ORM
- **Database:** PostgreSQL (local instance)
- **API Docs:** Swagger UI
- **Dev Tools:** ESLint, Prettier, Husky, Jest, Turbopack
- **Version Control:** Git + GitHub

---

## Database Setup

This project uses a local **PostgreSQL** instance.

1. Make sure PostgreSQL is installed and running. (i used pgAdmin)
2. Create a database:
   ```bash
   createdb techmission
   ```

## BackEnd - server

npm install
npm run dev
runs on http://localhost:5000

## FrontEnd - workinggenius

npm install
npm run dev
runs on http://localhost:3000

## API Documentation (Swagger)

Once your backend is running, open:  
http://localhost:5000/api-docs

You can test and view all API endpoints interactively.

## comment to create seed and add dummy data

psql -U postgres -d techmission -f db-schema.sql

## pool

user: "postgres",
host: "localhost",
database: "techmission",
password: "Amrutha26",
port: 5432,
