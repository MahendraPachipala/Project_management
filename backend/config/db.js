import pkg from 'pg';
const {Pool} = pkg;
import dotenv from 'dotenv';
dotenv.config();
// const pool = new Pool({
//     user:'postgres',
//     host:'localhost',
//     database:'project_management',
//     password:'Mahendra123@',
//     port:5432
// })
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // put your Neon URL in .env
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});
 


export default pool;