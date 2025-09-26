import pool from "./db.js";

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      full_name   VARCHAR(100),
      email       VARCHAR(150) UNIQUE,
      password    TEXT,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      project_id   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      admin_id      INT REFERENCES users(user_id) ON DELETE CASCADE,
      project_name VARCHAR(150),
      description  TEXT,
      deadline     DATE,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      task_id     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      project_id  INT REFERENCES projects(project_id) ON DELETE CASCADE,
      title       VARCHAR(150),
      description TEXT,
      status      VARCHAR(20) CHECK (status IN ('Not Started','Completed','In Progress','Blocked')),
      due_date    DATE,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `); 

  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_members (
      project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
      user_id    INT REFERENCES users(user_id) ON DELETE CASCADE,
      role VARCHAR(20) CHECK (role IN ('Admin','Viewer','Member')) DEFAULT 'Member',
      added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (project_id, user_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS task_assignees (
      task_id INT REFERENCES tasks(task_id) ON DELETE CASCADE,
      user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
      assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (task_id, user_id)
    )
  `);
};

export default createTables;
