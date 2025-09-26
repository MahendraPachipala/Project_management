import pool from "../config/db.js";

export const createUser = async (full_name,email,password) =>{
    const result = await pool.query(
        `INSERT INTO users(full_name,email,password) 
        VALUES ($1,$2,$3) RETURNING *`,
        [full_name,email,password]
    )
    return result.rows[0];
}

export const findbyemail = async (email)=>{
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0];
}

export const findbyId = async(id)=>{
    const result = await pool.query(
        `
        SELECT * from users WHERE user_id=$1`,
        [id]
    )
    return result.rows[0];
}

