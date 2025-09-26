import {
  getprojectsbyuserid,
  createproject,
  getProjectById,
  isUserProjectMember,
  addProjectMember,
  getUsersbyProjectId,
  deleteProjectById,
} from "../models/projectModel.js";

import { createTask as createTaskModel } from "../models/taskModel.js";
import { findbyemail } from "../models/userModel.js";

export const getUsersbyProject = async (req, res) => {
  const { project_id } = req.body;

  try {
    const result = await getUsersbyProjectId(project_id);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createnewProject = async (req, res) => {
  const { project_name, description, deadline } = req.body;
  const { user_id } = req.user;
  try {
    const result = await createproject(
      user_id,
      project_name,
      description,
      deadline
    );
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProject = async (req, res) => {
  const { user_id } = req.user;
  const { project_id } = req.query;
  try {
    deleteProjectById(user_id, project_id);
    res.status(201).json({ message: "deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const findprojectsbyuserid = async (req, res) => {
  const { user_id } = req.user;
  
  try {
    const result = await getprojectsbyuserid(user_id);
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getProjectDetails = async (req, res) => {
  const{project_id} = req.query;
  const project = await getProjectById(project_id);
  
  res.status(201).json(project);
};

// -------- create task (only members can create tasks) ----------
export const createTask = async (req, res) => {
  const { project_id } = req.params;
  const { title, description, due_date } = req.body;
  const { user_id } = req.user;

  try {
    // check project exists
    const project = await getProjectById(project_id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // check membership
    const isMember = await isUserProjectMember(project_id, user_id);
    if (!isMember)
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });

    const task = await createTaskModel(
      project_id,
      title,
      description,
      due_date || null
    );
    return res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -------- add member (only project admin can add) ----------
export const addMember = async (req, res) => {
  const { project_id } = req.params;
  const { email } = req.body; // add by email for UX
  const { user_id } = req.user;
  const { role } = req.body;

  try {
    const project = await getProjectById(project_id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // only admin can add
    if (project.admin_id !== user_id)
      return res
        .status(403)
        .json({ message: "Only project admin can add members" });

    // find user by email
    const user = await findbyemail(email);
    if (!user)
      return res
        .status(404)
        .json({ message: "User with this email not found" });

    // add member
    const added = await addProjectMember(project_id, user.user_id, role);
    if (!added)
      return res.status(409).json({ message: "User already a member" });

    return res.status(201).json({ message: "Member added", member: added });
  } catch (err) {
    console.error("Add member error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
