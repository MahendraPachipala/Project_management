import { createTask, getTasksByProject, updateTaskStatus, deleteOneTask } from "../models/taskModel.js";

// ✅ Create Task with Assigned Users
export const createNewTask = async (req, res) => {
  const { project_id, title, description, due_date, assignedUsers } = req.body;
  
  try {
    const task = await createTask(project_id, title, description, due_date, assignedUsers || []);
    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTasksByProjectId = async (req, res) => {
  const { project_id } = req.body;
  try {
    const rows = await getTasksByProject(project_id); // original function, may have duplicates

    // Transform rows into frontend-friendly format
    const tasksMap = {};

    rows.forEach(row => {
      if (!tasksMap[row.task_id]) {
        tasksMap[row.task_id] = {
          task_id: row.task_id,
          project_id: row.project_id,
          title: row.title,
          description: row.description,
          status: row.status,
          due_date: row.due_date,
          created_at: row.created_at,
          assigned_users: [],
        };
      }

      if (row.user_id && !tasksMap[row.task_id].assigned_users.includes(row.user_id)) {
        tasksMap[row.task_id].assigned_users.push(row.user_id);
      }
    });

    const result = Object.values(tasksMap);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const updateTask = async (req, res) => {
  const { task_id, status } = req.body;
  try {
    await updateTaskStatus(task_id, status);
    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  const { task_id } = req.query;
  try {
    await deleteOneTask(task_id);
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
