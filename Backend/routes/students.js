import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth, isAdmin } from "../middleware/auth.js";
import { camelizeKeys, snakifyKeys } from "../utils/helpers.js";

const router = Router();

// POST /api/students - Submit / update student details (secured for authenticated user)
router.post("/", requireAuth, async (req, res, next) => {
  const data = snakifyKeys(req.body);
  const userId = req.user.id;

  const {
    full_name,
    email,
    phone,
    gender,
    dob,
    university,
    school_type,
    uni_type,
    faculty,
    department,
    program,
    level,
    index_number,
    address,
    nationality,
    status,
    church,
    niche,
  } = data;

  if (
    !full_name ||
    !email ||
    !phone ||
    !gender ||
    !dob ||
    !university ||
    !department ||
    !program ||
    !level ||
    !index_number ||
    !address
  ) {
    return res.status(400).json({ error: true, message: "Missing required student details." });
  }

  try {
    // Check if student profile already exists for this user_id
    const existing = await db.query("SELECT id FROM students WHERE user_id = $1", [userId]);

    let result;
    if (existing.rows.length > 0) {
      // Update existing profile
      const query = `
        UPDATE students SET
          full_name = $2, email = $3, phone = $4, gender = $5, dob = $6,
          university = $7, school_type = $8, uni_type = $9, faculty = $10,
          department = $11, program = $12, level = $13, index_number = $14,
          address = $15, nationality = $16, status = $17, church = $18, niche = $19
        WHERE user_id = $1
        RETURNING *
      `;
      result = await db.query(query, [
        userId,
        full_name.trim(),
        email.toLowerCase().trim(),
        phone.trim(),
        gender,
        dob,
        university.trim(),
        school_type || null,
        uni_type || null,
        faculty || null,
        department.trim(),
        program.trim(),
        level,
        index_number.trim(),
        address.trim(),
        nationality || null,
        status || null,
        church || null,
        niche || null,
      ]);
    } else {
      // Insert new profile
      const query = `
        INSERT INTO students (
          user_id, full_name, email, phone, gender, dob, university,
          school_type, uni_type, faculty, department, program, level,
          index_number, address, nationality, status, church, niche
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `;
      result = await db.query(query, [
        userId,
        full_name.trim(),
        email.toLowerCase().trim(),
        phone.trim(),
        gender,
        dob,
        university.trim(),
        school_type || null,
        uni_type || null,
        faculty || null,
        department.trim(),
        program.trim(),
        level,
        index_number.trim(),
        address.trim(),
        nationality || null,
        status || null,
        church || null,
        niche || null,
      ]);
    }

    // Update profileComplete flag in users table
    await db.query("UPDATE users SET profile_complete = TRUE WHERE id = $1", [userId]);

    return res.json({
      success: true,
      message: "Student details saved successfully.",
      student: camelizeKeys(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/students/me - Fetch the logged-in user's own student profile (secured)
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM students WHERE user_id = $1", [req.user.id]);
    if (result.rows.length === 0) {
      return res.json({ success: true, student: null });
    }
    return res.json({
      success: true,
      student: camelizeKeys(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/students - List all student profiles (secured)
router.get("/admin/all", requireAuth, isAdmin, async (req, res, next) => {
  try {
    const query = `
      SELECT 
        u.id AS user_id,
        u.name AS full_name,
        u.email,
        u.phone,
        u.gender,
        u.joined_at AS submitted_at,
        u.nationality,
        u.status,
        u.church,
        u.niche,
        u.university,
        u.school_type,
        u.uni_type,
        u.faculty,
        u.department,
        u.program,
        u.level,
        u.profile_complete,
        s.id AS student_profile_id,
        s.dob,
        s.index_number,
        s.address
      FROM users u
      LEFT JOIN students s ON u.id = s.user_id
      WHERE u.role = 'member'
      ORDER BY u.joined_at DESC
    `;
    const result = await db.query(query);
    const mapped = result.rows.map((row) => {
      const camel = camelizeKeys(row);
      return {
        ...camel,
        id: camel.studentProfileId || `s-mock-${camel.userId}`,
        joinedAt: camel.submittedAt,
      };
    });

    return res.json({
      success: true,
      students: mapped,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/students/:id - View details of a specific student (secured)
router.get("/admin/:id", requireAuth, isAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM students WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Student profile not found." });
    }
    return res.json({
      success: true,
      student: camelizeKeys(result.rows[0]),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/students/admin/save - Admin save/update any student profile & user details (secured)
router.post("/admin/save", requireAuth, isAdmin, async (req, res, next) => {
  const data = snakifyKeys(req.body);
  const {
    user_id,
    email,
    full_name,
    phone,
    gender,
    dob,
    university,
    school_type,
    uni_type,
    faculty,
    department,
    program,
    level,
    index_number,
    address,
    nationality,
    status,
    church,
    niche,
  } = data;

  if (
    !email ||
    !full_name ||
    !phone ||
    !gender ||
    !dob ||
    !university ||
    !department ||
    !program ||
    !level ||
    !index_number ||
    !address
  ) {
    return res.status(400).json({ error: true, message: "Missing required student details." });
  }

  try {
    // 1. Find or create user record
    let targetUserId = user_id;
    if (
      !targetUserId ||
      String(targetUserId).startsWith("u-mock") ||
      String(targetUserId).includes("mock")
    ) {
      const userRes = await db.query("SELECT id FROM users WHERE LOWER(email) = LOWER($1)", [
        email.trim(),
      ]);
      if (userRes.rows.length > 0) {
        targetUserId = userRes.rows[0].id;
      } else {
        const bcrypt = await import("bcryptjs");
        const defaultHash = await bcrypt.default.hash("student123", 12);
        const newUserRes = await db.query(
          `INSERT INTO users (name, email, password_hash, role, phone, gender, nationality, university, school_type, uni_type, faculty, department, program, level, status, church, niche, profile_complete)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING id`,
          [
            full_name.trim(),
            email.toLowerCase().trim(),
            defaultHash,
            "member",
            phone.trim(),
            gender,
            nationality || "Ghanaian",
            university.trim(),
            school_type,
            uni_type,
            faculty,
            department.trim(),
            program.trim(),
            level,
            status || "Active Student",
            church,
            niche,
            true,
          ],
        );
        targetUserId = newUserRes.rows[0].id;
      }
    }

    // Update user profile fields
    await db.query(
      `UPDATE users SET
        name = $2, phone = $3, gender = $4, nationality = $5, university = $6,
        school_type = $7, uni_type = $8, faculty = $9, department = $10,
        program = $11, level = $12, status = $13, church = $14, niche = $15,
        profile_complete = TRUE
       WHERE id = $1`,
      [
        targetUserId,
        full_name.trim(),
        phone.trim(),
        gender,
        nationality || "Ghanaian",
        university.trim(),
        school_type,
        uni_type,
        faculty,
        department.trim(),
        program.trim(),
        level,
        status || "Active Student",
        church,
        niche,
      ],
    );

    // 2. Insert or update student record
    const existing = await db.query(
      "SELECT id FROM students WHERE user_id = $1 OR LOWER(email) = LOWER($2)",
      [targetUserId, email.trim()],
    );
    let studentResult;
    if (existing.rows.length > 0) {
      const query = `
        UPDATE students SET
          full_name = $2, email = $3, phone = $4, gender = $5, dob = $6,
          university = $7, school_type = $8, uni_type = $9, faculty = $10,
          department = $11, program = $12, level = $13, index_number = $14,
          address = $15, nationality = $16, status = $17, church = $18, niche = $19
        WHERE id = $1
        RETURNING *
      `;
      studentResult = await db.query(query, [
        existing.rows[0].id,
        full_name.trim(),
        email.toLowerCase().trim(),
        phone.trim(),
        gender,
        dob,
        university.trim(),
        school_type,
        uni_type,
        faculty,
        department.trim(),
        program.trim(),
        level,
        index_number.trim(),
        address.trim(),
        nationality,
        status,
        church,
        niche,
      ]);
    } else {
      const query = `
        INSERT INTO students (
          user_id, full_name, email, phone, gender, dob, university,
          school_type, uni_type, faculty, department, program, level,
          index_number, address, nationality, status, church, niche
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `;
      studentResult = await db.query(query, [
        targetUserId,
        full_name.trim(),
        email.toLowerCase().trim(),
        phone.trim(),
        gender,
        dob,
        university.trim(),
        school_type,
        uni_type,
        faculty,
        department.trim(),
        program.trim(),
        level,
        index_number.trim(),
        address.trim(),
        nationality,
        status,
        church,
        niche,
      ]);
    }

    return res.json({
      success: true,
      message: "Student saved successfully by admin.",
      student: camelizeKeys(studentResult.rows[0]),
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/students/admin/:id - Admin delete student profile & user account (secured)
router.delete("/admin/:id", requireAuth, isAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    if (id.startsWith("s-mock-")) {
      const userId = id.replace("s-mock-", "");
      await db.query("DELETE FROM users WHERE id = $1", [userId]);
      return res.json({
        success: true,
        message: "User account deleted successfully.",
        id,
      });
    }

    const studentRes = await db.query("SELECT email, user_id FROM students WHERE id = $1", [id]);
    if (studentRes.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Student profile not found." });
    }
    const student = studentRes.rows[0];

    // Delete student record
    await db.query("DELETE FROM students WHERE id = $1", [id]);

    // If associated with a user account, delete it too
    if (student.user_id) {
      await db.query("DELETE FROM users WHERE id = $1", [student.user_id]);
    } else {
      await db.query("DELETE FROM users WHERE LOWER(email) = LOWER($1)", [student.email]);
    }

    return res.json({
      success: true,
      message: "Student profile and user account deleted successfully.",
      id,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
