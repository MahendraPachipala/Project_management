import express from "express";
import { verifyToken } from "../controllers/userController.js";
import { createNewTask, getTasksByProjectId, updateTask, deleteTask } from "../controllers/taskController.js";

const taskRouter = express.Router();

// ✅ New route to create task with assigned users
taskRouter.post("/createTask", verifyToken, createNewTask);

// Get tasks by project
taskRouter.post("/getTasks", verifyToken, getTasksByProjectId);

// Update task status
taskRouter.post("/updateTask", verifyToken, updateTask);

// Delete a task
taskRouter.delete("/deleteTask", verifyToken, deleteTask);

export default taskRouter;
