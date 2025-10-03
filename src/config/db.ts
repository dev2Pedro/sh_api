// db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config(); // Carrega o .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Supabase exige SSL
  },
});

export default pool;
