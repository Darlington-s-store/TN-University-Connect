import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../db/index.js";

dotenv.config();

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: true, message: "Authentication required. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB to verify they still exist
    const userResult = await db.query("SELECT id, name, email, role FROM users WHERE id = $1", [
      decoded.id,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: true, message: "User no longer exists." });
    }

    req.user = userResult.rows[0];
    next();
  } catch (err) {
    console.error("[AUTH MIDDLEWARE ERROR]:", err.message);
    return res
      .status(401)
      .json({ error: true, message: "Invalid or expired authentication token." });
  }
}

export function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: true, message: "Access denied. Administrator privileges required." });
  }
  next();
}
