import { toast } from "sonner";

export interface VerificationData {
  email: string;
  phone: string;
  code: string;
  expiresAt: number;
}

const STORAGE_KEY = "tnu_active_verification";

/**
 * Generates a 6-digit verification code.
 */
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Sends verification code via Resend and Arkesel (or falls back to high-fidelity simulation).
 */
export async function sendVerificationCode(email: string, phone: string): Promise<string> {
  const code = generateCode();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

  // Save to local storage for comparison
  const data: VerificationData = { email, phone, code, expiresAt };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // Retrieve keys from local storage (so users or admins can configure them in Settings)
  const resendKey = localStorage.getItem("resend_api_key") || "";
  const arkeselKey = localStorage.getItem("arkesel_api_key") || "";
  const arkeselSender = localStorage.getItem("arkesel_sender_id") || "TN Connect";

  let emailSent = false;
  let smsSent = false;

  // 1. Resend Email Call
  if (resendKey && resendKey.startsWith("re_")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "TN Connect <onboarding@resend.dev>",
          to: email,
          subject: "Verify your TN Connect Account",
          html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <h2>Welcome to TN Universities Connect!</h2>
            <p>Your verification code is: <strong style="font-size: 24px; color: #006B2D; tracking-wide: 2px;">${code}</strong></p>
            <p>This code will expire in 10 minutes.</p>
          </div>`,
        }),
      });
      if (res.ok) emailSent = true;
    } catch (err) {
      console.error("Resend error:", err);
    }
  }

  // 2. Arkesel SMS Call
  if (arkeselKey) {
    try {
      // Arkesel SMS V2 API endpoint
      const formattedPhone = phone.replace(/[^0-9]/g, ""); // strip symbols
      const res = await fetch(
        `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${arkeselKey}&to=${formattedPhone}&from=${arkeselSender}&sms=Your TN Connect verification code is ${code}. Expires in 10 mins.`,
        {
          method: "GET",
        },
      );
      if (res.ok) smsSent = true;
    } catch (err) {
      console.error("Arkesel error:", err);
    }
  }

  // 3. Simulation Logs & Notifications (Fallback)
  console.log(`[VERIFICATION SANDBOX] Code: ${code} sent to Email: ${email}, Phone: ${phone}`);

  if (emailSent && smsSent) {
    toast.success("Verification code sent successfully via Resend and Arkesel!");
  } else {
    // Show a beautiful toast simulation box
    toast.info(`[SIMULATION MODE] Verification code sent!`, {
      description: `Code: ${code} (Check your console or enter here to proceed). Real SMS/Email will send if API keys are set in Admin Settings.`,
      duration: 8000,
    });
  }

  return code;
}

/**
 * Verifies the code entered by the user.
 */
export function verifyCode(enteredCode: string): boolean {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const data: VerificationData = JSON.parse(raw);
    if (Date.now() > data.expiresAt) {
      toast.error("Verification code has expired. Please request a new one.");
      return false;
    }
    if (data.code === enteredCode.trim()) {
      localStorage.removeItem(STORAGE_KEY); // clean up
      return true;
    }
  } catch (e) {
    console.error(e);
  }
  return false;
}
