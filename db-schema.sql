--  Database Schema for TechMission Project

-- Drop existing tables 
DROP TABLE IF EXISTS tasks, comments, project_owners, project_boards, projects, employees, boards, teams, project_status, project_priority, project_category CASCADE;

--  Master Tables

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    role VARCHAR(100)
);

CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE project_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(150)
);

CREATE TABLE project_priority (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(150)
);

CREATE TABLE project_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

--  Main Projects Table

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES project_category(id),
    team_id INTEGER REFERENCES teams(id),
    status_id INTEGER REFERENCES project_status(id),
    priority_id INTEGER REFERENCES project_priority(id),
    due_date DATE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

--  Connection Tables

CREATE TABLE project_owners (
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    owner_id INTEGER REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE project_boards (
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE
);


--  Tasks Table

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    due_date DATE,
    assigned_to INTEGER REFERENCES employees(id),
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

--  Comments Table

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

--  Seed Data

-- Employees
INSERT INTO employees (name, email, role) VALUES
('Amrutha', 'amrutha@company.com', 'Designer'),
('Arunima', 'arunima@company.com', 'Developer'),
('Amal', 'amal@company.com', 'Product Analyst'),
('Ananya', 'ananya@company.com', 'Finance Manager'),
('Ravi', 'ravi@company.com', 'Customer Success Lead');

-- Boards
INSERT INTO boards (name) VALUES
('Marketing Team Meetings'),
('Social Media'),
('Product Development'),
('Customer Support'),
('Finance Review'),
('Operations Planning');

-- Status
INSERT INTO project_status (name, description) VALUES
('on-track', 'Project progressing as planned'),
('at-risk', 'Needs attention'),
('blocked', 'Halted due to dependencies'),
('completed', 'Successfully completed'),
('on-hold', 'Temporarily paused');

-- Priority
INSERT INTO project_priority (name, description) VALUES
('high', 'Critical project requiring immediate attention'),
('medium', 'Important but not urgent'),
('low', 'Low urgency, can be scheduled flexibly');

-- Category
INSERT INTO project_category (name, description) VALUES
('Wonder', 'Pondering and questioning'),
('Invention', 'Creating and brainstorming'),
('Discernment', 'Evaluating and critiquing'),
('Galvanizing', 'Rallying and inspiring'),
('Enablement', 'Supporting and assisting'),
('Tenacity', 'Pushing to the finish');

-- Teams
INSERT INTO teams (name, description) VALUES
('Marketing Team', 'Handles marketing and campaign initiatives'),
('Product Development Team', 'Focuses on building and improving products'),
('Customer Success Team', 'Ensures client satisfaction and retention'),
('Operations Team', 'Manages logistics and internal efficiency'),
('Finance & Strategy Team', 'Handles budgets, forecasts, and company strategy');


--  Test Records for Projects

INSERT INTO projects (title, description, category_id, team_id, status_id, priority_id, due_date)
VALUES
('Website Redesign', 'Revamping the corporate website for better UX', 2, 1, 1, 1, '2025-12-31'),
('Customer Onboarding Automation', 'Automating the onboarding process for new clients', 5, 3, 2, 2, '2025-11-15'),
('Social Media Campaign', 'Q4 Instagram and LinkedIn promotional strategy', 1, 1, 1, 3, '2025-11-30'),
('Internal Analytics Dashboard', 'Creating an internal tool for data visualization', 3, 2, 3, 1, '2025-12-10');

--Test Records foe task

--  Test Records for Tasks

INSERT INTO tasks (title, due_date, assigned_to, project_id, is_deleted)
VALUES
('Design Homepage', '2025-11-01', 1, 1, false),
('Implement Landing Page', '2025-11-10', 2, 1, false),
('Automate Client Emails', '2025-11-12', 3, 2, false),
('Schedule Social Posts', '2025-11-05', 1, 3, false),
('Setup Dashboard API', '2025-12-05', 2, 4, false);


--  Test Records for Project Owners

INSERT INTO project_owners (project_id, owner_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 1),
(4, 2),
(4, 3);

--  Test Records for Project Boards

INSERT INTO project_boards (project_id, board_id) VALUES
(1, 3),  
(2, 4),  
(3, 2),  
(4, 5); 


--  Test Records for Comments

INSERT INTO comments (project_id, user_name, content) VALUES
(1, 'You', 'Initial design wireframes completed.'),
(1, 'Arunima', 'Started front-end integration.'),
(2, 'Amal', 'Workflow automation API ready.'),
(3, 'Amrutha', 'Campaign assets finalized.'),
(4, 'Ananya', 'Added data visualization charts.'),
(4, 'Ravi', 'Pending review before deployment.');


