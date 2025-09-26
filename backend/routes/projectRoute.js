import express from "express";
import { verifyToken } from "../controllers/userController.js";
import {
  createnewProject,
  findprojectsbyuserid,
  createTask,
  addMember,
  getUsersbyProject,
  deleteProject,
  getProjectDetails
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.get("/getprojects", verifyToken, findprojectsbyuserid);
projectRouter.get("/getpojectDetails",verifyToken,getProjectDetails);
projectRouter.post("/createproject", verifyToken, createnewProject);
projectRouter.delete("/delete",verifyToken,deleteProject);
// tasks: create and list (list optional)
projectRouter.post("/:project_id/tasks", verifyToken, createTask);
// add member
projectRouter.post("/:project_id/add-member", verifyToken, addMember);
projectRouter.post("/getusersbyproject",verifyToken,getUsersbyProject);

export default projectRouter;
