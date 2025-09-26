import pool from "../config/db.js";

export const getprojectsbyuserid = async (user_id) => {
  const result = await pool.query(
    `
    SELECT 
  p.project_id,
  p.project_name,
  p.description,
  p.deadline,
  p.admin_id,
  u.full_name AS admin_name,
  COUNT(t.task_id) AS tasks_count
FROM projects p
JOIN project_members m ON p.project_id = m.project_id
JOIN users u ON p.admin_id = u.user_id
LEFT JOIN tasks t ON p.project_id = t.project_id
WHERE m.user_id = $1
GROUP BY p.project_id, u.full_name;

   `,
    [user_id]
  );
  return result.rows;
};


export const createproject = async (admin_id, project_name, description, deadline) => {
  const result = await pool.query(
    `INSERT INTO projects (admin_id, project_name, description, deadline)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [admin_id, project_name, description, deadline]
  );

  const project_id = result.rows[0].project_id;

  
  await pool.query(
    `INSERT INTO project_members (project_id, user_id,role)
     VALUES ($1, $2 , $3)`,
    [project_id, admin_id,'Admin']
  );

  return result.rows[0];
};

export const getProjectById = async (project_id) => {
  const result = await pool.query(
    `SELECT * FROM projects WHERE project_id = $1`,
    [project_id]
  );
  return result.rows[0];
};

export const isUserProjectMember = async (project_id, user_id) => {
  const result = await pool.query(
    `SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2`,
    [project_id, user_id]
  );
  return result.rowCount > 0;
};

export const addProjectMember = async (project_id, user_id, role) => {
  const exists = await pool.query(
    `SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2`,
    [project_id, user_id]
  );
  if (exists.rowCount > 0) return null; 

  const res = await pool.query(
    `INSERT INTO project_members (project_id, user_id,role)
     VALUES ($1, $2, $3)
     RETURNING project_id, user_id, added_at`,
    [project_id, user_id, role]
  );
  return res.rows[0];
};

export const getUsersbyProjectId = async(project_id) =>{
  const result = await pool.query(
    `
    SELECT 
    u.user_id,
    u.full_name,
    u.email,
    u.created_at AS user_created_at,
    pm.added_at  AS joined_at,
    pm.role
FROM project_members pm
JOIN users u ON pm.user_id = u.user_id
WHERE pm.project_id = $1;
    `,[project_id]
  )
  return result.rows;
}

export const deleteProjectById = async(user_id,project_id)=>{
  await pool.query(`delete from projects where project_id=$1 AND admin_id=$2`
  ,[project_id,user_id])
}