import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth, isAdmin } from "../middleware/auth.js";
import { snakeToCamel, camelToSnake } from "../utils/helpers.js";

const router = Router();

// GET /api/settings - Retrieve general site configuration
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM settings");
    const settingsObj = {};

    result.rows.forEach((row) => {
      const camelKey = snakeToCamel(row.key);
      let val = row.value;

      // Parse boolean strings
      if (val === "true") val = true;
      else if (val === "false") val = false;

      settingsObj[camelKey] = val;
    });

    return res.json({
      success: true,
      settings: settingsObj,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings - Update general configuration keys (Admin only)
router.put("/", requireAuth, isAdmin, async (req, res, next) => {
  const patch = req.body;

  try {
    for (const key of Object.keys(patch)) {
      const snakeKey = camelToSnake(key);
      const valStr = String(patch[key]);

      // Parameterized query: upsert values securely
      await db.query(
        `INSERT INTO settings (key, value) 
         VALUES ($1, $2)
         ON CONFLICT (key) 
         DO UPDATE SET value = EXCLUDED.value`,
        [snakeKey, valStr],
      );
    }

    // Retrieve updated settings
    const result = await db.query("SELECT * FROM settings");
    const settingsObj = {};
    result.rows.forEach((row) => {
      const camelKey = snakeToCamel(row.key);
      let val = row.value;
      if (val === "true") val = true;
      else if (val === "false") val = false;
      settingsObj[camelKey] = val;
    });

    return res.json({
      success: true,
      message: "Settings updated successfully.",
      settings: settingsObj,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
