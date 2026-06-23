import dotenv from "dotenv";
dotenv.config({ path: "./Backend/.env" });

import { db } from "../Backend/db/index.js";

async function run() {
  try {
    const res = await db.query("SELECT * FROM settings");
    console.log("Current DB settings rows:");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    process.exit(0);
  }
}

run();
