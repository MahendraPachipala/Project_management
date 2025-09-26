import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import pool from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import projectRouter from "./routes/projectRoute.js";
import taskRouter from "./routes/taskRoute.js";
import createTables from "./config/schema.js";
import cookieParser from "cookie-parser";


dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || "*");
  },
  credentials: true
}));

app.use(cookieParser());

app.use("/auth",userRouter);
app.use("/projects",projectRouter); 
app.use("/tasks",taskRouter);
 
const port = 4000;
 
//Testing database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error', err);
  } else {
    console.log('Database connected:', res.rows[0]);
  }
});

createTables();

app.listen(port,()=>{console.log(`running on port ${port}`)})