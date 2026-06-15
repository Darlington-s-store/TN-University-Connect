import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth, isAdmin } from "../middleware/auth.js";
import { camelizeKeys, snakifyKeys } from "../utils/helpers.js";

const router = Router();

// GET /api/blogs - Fetch published blog posts (prioritizing sponsored ones)
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT * FROM blog_posts 
       WHERE published = TRUE 
       ORDER BY is_sponsored DESC, date DESC, created_at DESC`,
    );
    return res.json({
      success: true,
      blogs: camelizeKeys(result.rows),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/blogs/:id - Fetch single blog post details
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM blog_posts WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Blog post not found." });
    }
    return res.json({
      success: true,
      blog: camelizeKeys(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/blogs - Admin fetch all (secured)
router.get("/admin/all", requireAuth, isAdmin, async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM blog_posts ORDER BY date DESC, created_at DESC");
    return res.json({
      success: true,
      blogs: camelizeKeys(result.rows),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/blogs - Admin create blog post (secured)
router.post("/admin", requireAuth, isAdmin, async (req, res, next) => {
  const data = snakifyKeys(req.body);
  const {
    id,
    title,
    category,
    author,
    date,
    excerpt,
    body,
    image,
    is_sponsored,
    sponsor_name,
    sponsor_url,
    sponsor_logo,
    featured,
    published,
  } = data;

  if (!id || !title || !category || !author || !date || !excerpt || !body) {
    return res.status(400).json({ error: true, message: "Missing required fields." });
  }

  try {
    const result = await db.query(
      `INSERT INTO blog_posts (
        id, title, category, author, date, excerpt, body, image, 
        is_sponsored, sponsor_name, sponsor_url, sponsor_logo, featured, published
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        id,
        title,
        category,
        author,
        date,
        excerpt,
        body,
        image || null,
        is_sponsored || false,
        sponsor_name || null,
        sponsor_url || null,
        sponsor_logo || null,
        featured || false,
        published !== undefined ? published : true,
      ],
    );

    return res.status(201).json({
      success: true,
      blog: camelizeKeys(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/blogs/:id - Admin update blog post (secured)
router.put("/admin/:id", requireAuth, isAdmin, async (req, res, next) => {
  const { id } = req.params;
  const dbPatch = snakifyKeys(req.body);
  delete dbPatch.id;
  delete dbPatch.created_at;

  const fields = Object.keys(dbPatch);
  if (fields.length === 0) {
    return res.status(400).json({ error: true, message: "No update parameters supplied." });
  }

  try {
    const setClause = fields.map((field, idx) => `${field} = $${idx + 2}`).join(", ");
    const values = fields.map((field) => dbPatch[field]);

    const query = `
      UPDATE blog_posts 
      SET ${setClause} 
      WHERE id = $1 
      RETURNING *
    `;

    const result = await db.query(query, [id, ...values]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Blog post not found." });
    }

    return res.json({
      success: true,
      blog: camelizeKeys(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/blogs/:id - Admin delete blog post (secured)
router.delete("/admin/:id", requireAuth, isAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM blog_posts WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Blog post not found." });
    }
    return res.json({
      success: true,
      message: "Blog post deleted successfully.",
      id: result.rows[0].id,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
