import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const isNeon = connectionString && connectionString.includes("neon.tech");

const pool = new Pool({
  connectionString,
  ssl: isNeon || process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const db = {
  query: (text, params) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[DATABASE QUERY]:", text, params || "");
    }
    return pool.query(text, params);
  },
  pool,
};
