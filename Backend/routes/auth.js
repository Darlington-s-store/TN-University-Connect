import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { requireAuth, isAdmin } from "../middleware/auth.js";
import { camelizeKeys, snakifyKeys } from "../utils/helpers.js";
import { sendEmail, sendSMS } from "../services/notification.js";

const router = Router();

function isPasswordStrong(password) {
  if (password.length < 8) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasUpper && hasLower && hasNumber && hasSpecial;
}

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  const data = req.body;
  const { name, email, password, phone } = data;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: true, message: "Missing required registration fields." });
  }

  if (!isPasswordStrong(password)) {
    return res.status(400).json({
      error: true,
      message:
        "Password is too weak. It must be at least 8 characters long and contain uppercase, lowercase, numeric, and special characters.",
    });
  }

  try {
    const existingResult = await db.query("SELECT id FROM users WHERE LOWER(email) = LOWER($1)", [
      email.trim(),
    ]);
    if (existingResult.rows.length > 0) {
      return res
        .status(400)
        .json({ error: true, message: "An account with that email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const userInsertQuery = `
      INSERT INTO users (
        name, email, password_hash, role, phone, gender, nationality,
        university, school_type, uni_type, faculty, department, program,
        level, status, church, niche, profile_complete
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id, name, email, role, phone, gender, nationality, university, school_type, uni_type, faculty, department, program, level, status, church, niche, profile_complete, joined_at
    `;

    const userResult = await db.query(userInsertQuery, [
      name.trim(),
      email.toLowerCase().trim(),
      passwordHash,
      "member",
      phone.trim(),
      data.gender,
      data.nationality || "Ghanaian",
      data.school, // maps to university
      data.schoolType,
      data.uniType,
      data.faculty,
      data.department,
      data.program,
      data.level,
      data.status || "Active Student",
      data.church,
      data.niche || "General Studies",
      true, // profile complete
    ]);

    const newUser = userResult.rows[0];

    // Create student form record matching frontend
    const indexNumber = `STU${Math.floor(100000 + Math.random() * 900000)}`;
    const studentInsertQuery = `
      INSERT INTO students (
        user_id, full_name, email, phone, gender, dob, university,
        school_type, uni_type, faculty, department, program, level,
        index_number, address, nationality, status, church, niche
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    `;

    await db.query(studentInsertQuery, [
      newUser.id,
      newUser.name,
      newUser.email,
      newUser.phone,
      newUser.gender,
      new Date().toISOString().slice(0, 10), // Placeholder DOB
      newUser.university,
      newUser.school_type,
      newUser.uni_type,
      newUser.faculty,
      newUser.department,
      newUser.program,
      newUser.level,
      indexNumber,
      "Accra, Ghana", // Placeholder address
      newUser.nationality,
      newUser.status,
      newUser.church,
      newUser.niche,
    ]);

    const welcomeSubject = "Welcome to TN Universities Connect!";
    const welcomeHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Hi ${newUser.name},</h2>
        <p>Your account has been successfully verified and created!</p>
        <p>Explore your dashboard, announcements, and connect with fellow students.</p>
        <br/>
        <p>Best regards,<br/>The TN Connect Team</p>
      </div>
    `;
    const welcomeSms = `Hello ${newUser.name}, welcome to TN Universities Connect! Your profile has been successfully created.`;

    sendEmail({ to: newUser.email, subject: welcomeSubject, html: welcomeHtml });
    sendSMS({ to: newUser.phone, message: welcomeSms });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      token,
      user: camelizeKeys(newUser),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: true, message: "Email and password are required." });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [
      email.trim(),
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: true, message: "Invalid email or password." });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      return res.status(400).json({
        error: true,
        message: "This account was created using Google Sign-In. Please sign in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: true, message: "Invalid email or password." });
    }

    const token = generateToken(user);
    const { password_hash: _, ...safeUser } = user;

    return res.json({
      success: true,
      token,
      user: camelizeKeys(safeUser),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/google
router.post("/google", async (req, res, next) => {
  const { sub, email, name, picture } = req.body;

  if (!email || !name) {
    return res
      .status(400)
      .json({ error: true, message: "Google profile email and name are required." });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [
      email.trim(),
    ]);

    let user;
    if (result.rows.length > 0) {
      user = result.rows[0];
      if (picture && user.avatar !== picture) {
        const updateResult = await db.query(
          "UPDATE users SET avatar = $1 WHERE id = $2 RETURNING *",
          [picture, user.id],
        );
        user = updateResult.rows[0];
      }
    } else {
      const insertResult = await db.query(
        `INSERT INTO users (name, email, role, avatar, profile_complete)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name.trim(), email.toLowerCase().trim(), "member", picture, false],
      );
      user = insertResult.rows[0];
    }

    const token = generateToken(user);
    const { password_hash: _, ...safeUser } = user;

    return res.json({
      success: true,
      token,
      user: camelizeKeys(safeUser),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    const { password_hash: _, ...safeUser } = result.rows[0];
    return res.json({
      success: true,
      user: camelizeKeys(safeUser),
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
});

// PUT /api/auth/update
router.put("/update", requireAuth, async (req, res, next) => {
  const patch = req.body;

  if (Object.keys(patch).length === 0) {
    return res.status(400).json({ error: true, message: "No fields provided for update." });
  }

  const dbPatch = snakifyKeys(patch);

  delete dbPatch.role;
  delete dbPatch.password_hash;
  delete dbPatch.joined_at;
  delete dbPatch.id;

  const fields = Object.keys(dbPatch);
  if (fields.length === 0) {
    return res.status(400).json({ error: true, message: "No valid update fields." });
  }

  try {
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(", ");
    const values = fields.map((field) => dbPatch[field]);

    const query = `
      UPDATE users 
      SET ${setClause} 
      WHERE id = $1 
      RETURNING *
    `;

    const result = await db.query(query, [req.user.id, ...values]);
    const { password_hash: _, ...safeUser } = result.rows[0];

    return res.json({
      success: true,
      user: camelizeKeys(safeUser),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/admin/reset-password - Admin reset password for any user (secured)
router.post("/admin/reset-password", requireAuth, isAdmin, async (req, res, next) => {
  const { user_id, password } = req.body;
  if (!user_id || !password) {
    return res.status(400).json({ error: true, message: "User ID and new password are required." });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: true, message: "Password must be at least 8 characters long." });
  }

  try {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.default.hash(password, 12);
    const result = await db.query(
      "UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, name, email",
      [hash, user_id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: "User account not found." });
    }

    return res.json({
      success: true,
      message: `Password for user ${result.rows[0].name} updated successfully.`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
