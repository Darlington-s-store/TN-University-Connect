import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth, isAdmin } from "../middleware/auth.js";
import { camelizeKeys } from "../utils/helpers.js";
import { sendEmail } from "../services/notification.js";

const router = Router();

// POST /api/messages - Submit contact message
router.post("/", async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: true, message: "All message fields are required." });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const result = await db.query(
      `INSERT INTO contact_messages (name, email, subject, message, date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name.trim(), email.toLowerCase().trim(), subject.trim(), message.trim(), today],
    );

    const savedMsg = result.rows[0];

    // Send notifications (auto-response to user & alert to admin)
    const adminAlertHtml = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <h2>New Contact Message Received</h2>
        <p><strong>From:</strong> ${savedMsg.name} (${savedMsg.email})</p>
        <p><strong>Subject:</strong> ${savedMsg.subject}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f9f9f9; padding: 10px; border-radius: 3px;">${savedMsg.message}</p>
      </div>
    `;

    const userAutoReplyHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h3>Hi ${savedMsg.name},</h3>
        <p>Thank you for reaching out to TN Universities Connect.</p>
        <p>We have received your message regarding "<strong>${savedMsg.subject}</strong>" and our team will get back to you shortly.</p>
        <br/>
        <p>Best regards,<br/>The TN Connect Team</p>
      </div>
    `;

    // Fire emails
    sendEmail({
      to: "admin@tnuc.gh",
      subject: `ALERT: New message - ${savedMsg.subject}`,
      html: adminAlertHtml,
    });
    sendEmail({
      to: savedMsg.email,
      subject: `We received your message: ${savedMsg.subject}`,
      html: userAutoReplyHtml,
    });

    return res.status(201).json({
      success: true,
      message: "Message submitted successfully.",
      contactMessage: camelizeKeys(savedMsg),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/messages - List all messages (secured)
router.get("/admin/all", requireAuth, isAdmin, async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    return res.json({
      success: true,
      messages: camelizeKeys(result.rows),
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/messages/:id/resolve - Mark message as resolved (secured)
router.put("/admin/:id/resolve", requireAuth, isAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "UPDATE contact_messages SET resolved = TRUE WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Message not found." });
    }

    const resolvedMsg = result.rows[0];

    // Alert user that message has been resolved
    const resolveEmailHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h3>Hello ${resolvedMsg.name},</h3>
        <p>Your support ticket regarding "<strong>${resolvedMsg.subject}</strong>" has been marked as <strong>Resolved</strong> by our administrators.</p>
        <p>If you have any further questions, please do not hesitate to contact us again.</p>
        <br/>
        <p>Best regards,<br/>The TN Connect Team</p>
      </div>
    `;
    sendEmail({
      to: resolvedMsg.email,
      subject: `SUPPORT RESOLVED: ${resolvedMsg.subject}`,
      html: resolveEmailHtml,
    });

    return res.json({
      success: true,
      message: "Message marked as resolved successfully.",
      contactMessage: camelizeKeys(resolvedMsg),
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/messages/admin/:id - Admin delete contact message (secured)
router.delete("/admin/:id", requireAuth, isAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM contact_messages WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Message not found." });
    }
    return res.json({
      success: true,
      message: "Message deleted successfully.",
      id: result.rows[0].id,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
