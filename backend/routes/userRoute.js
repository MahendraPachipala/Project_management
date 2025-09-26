import express from "express";
import { Register,Login,verifyToken} from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.post("/register",Register);
userRouter.post("/login",Login);
userRouter.get("/getuser",verifyToken,(req,res)=>{
    res.status(201).json(req.user);
})
export default userRouter; 