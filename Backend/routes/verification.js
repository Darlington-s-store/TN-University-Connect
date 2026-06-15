import { Router } from "express";
import { db } from "../db/index.js";
import { sendEmail, sendSMS } from "../services/notification.js";

const router = Router();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/verification/send
router.post("/send", async (req, res, next) => {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ error: true, message: "Email and phone number are required." });
  }

  try {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save for email identifier
    await db.query("INSERT INTO otps (identifier, code, expires_at) VALUES ($1, $2, $3)", [
      email.toLowerCase().trim(),
      code,
      expiresAt,
    ]);

    // Save for phone identifier
    await db.query("INSERT INTO otps (identifier, code, expires_at) VALUES ($1, $2, $3)", [
      phone.trim(),
      code,
      expiresAt,
    ]);

    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <h2>Welcome to TN Universities Connect!</h2>
        <p>Your verification code is: <strong style="font-size: 24px; color: #006B2D; letter-spacing: 2px;">${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `;
    const smsMessage = `Your TN Connect verification code is ${code}. Expires in 10 mins.`;

    await Promise.all([
      sendEmail({ to: email, subject: "Verify your TN Connect Account", html: emailHtml }),
      sendSMS({ to: phone, message: smsMessage }),
    ]);

    return res.json({ success: true, message: "Verification code sent successfully." });
  } catch (err) {
    next(err);
  }
});

// POST /api/verification/verify
router.post("/verify", async (req, res, next) => {
  const { code, identifier } = req.body;

  if (!code || !identifier) {
    return res
      .status(400)
      .json({ error: true, message: "Verification code and identifier are required." });
  }

  try {
    const result = await db.query(
      `SELECT * FROM otps 
       WHERE identifier = $1 AND code = $2 AND expires_at > NOW() AND verified = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [identifier.trim(), code.trim()],
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid or expired verification code." });
    }

    const otpId = result.rows[0].id;
    await db.query("UPDATE otps SET verified = TRUE WHERE id = $1", [otpId]);

    return res.json({ success: true, message: "Code verified successfully." });
  } catch (err) {
    next(err);
  }
});

export default router;
