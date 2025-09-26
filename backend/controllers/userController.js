import { createUser, findbyemail } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findbyemail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credintials" });
    }
 
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, full_name:user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } 
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "none" ,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({message:"Login successful",user:{id:user.user_id,email:user.email}});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    const existing_user = await findbyemail(email);
    if (existing_user) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await createUser(full_name, email, hashedPassword);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: user.id,
        full_name: user.full_name,
        email: user.email,
      }, 
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyToken = (req,res,next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"No token provided"})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(403).json({message:"Invalid or expired token"});
    }
} 