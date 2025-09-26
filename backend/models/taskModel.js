import pool from "../config/db.js";

// ✅ Create a new task and assign to users
export const createTask = async (project_id, title, description, due_date, assignedUsers = []) => {
  // Step 1: Insert the task
  const result = await pool.query(
    `INSERT INTO tasks (project_id, title, description, due_date, status)
     VALUES ($1, $2, $3, $4, 'Not Started')
     RETURNING *`,
    [project_id, title, description, due_date]
  );

  const task = result.rows[0];
  // Step 2: Assign task to selected users (if any)
  if (assignedUsers.length > 0) {
    const values = assignedUsers.map(
      (user_id) => `(${task.task_id}, ${user_id})`
    ).join(",");

    await pool.query(`
      INSERT INTO task_assignees (task_id, user_id)
      VALUES ${values}
      ON CONFLICT DO NOTHING
    `);
  }

  return task;
};

export const getTasksByProject = async (project_id) => {
  const result = await pool.query(
    `SELECT t.*, ta.user_id
FROM tasks t
LEFT JOIN task_assignees ta ON t.task_id = ta.task_id
WHERE t.project_id = $1
ORDER BY t.created_at DESC;
`,
    [project_id]
  );
  return result.rows;
};

export const updateTaskStatus = async (task_id, status) => {
  await pool.query(
    `UPDATE tasks 
     SET status = $1 
     WHERE task_id = $2`,
    [status, task_id]
  );
};

export const deleteOneTask = async (task_id) => {
  await pool.query(
    `DELETE FROM tasks WHERE task_id = $1`, [task_id]
  );
};
