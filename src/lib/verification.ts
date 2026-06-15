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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Sends verification code via the backend API.
 */
export async function sendVerificationCode(email: string, phone: string): Promise<string> {
  // Save details to localStorage to track the active verification identifier (email)
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const data = { email, phone, expiresAt };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  const response = await fetch(`${API_URL}/api/verification/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, phone }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to send verification code.");
  }

  // The actual OTP code is stored securely in the database and not sent back in the response body.
  return "code_sent";
}

/**
 * Verifies the code entered by the user via the backend API.
 */
export async function verifyCode(enteredCode: string): Promise<boolean> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const data = JSON.parse(raw);
    if (Date.now() > data.expiresAt) {
      toast.error("Verification code has expired. Please request a new one.");
      return false;
    }

    const response = await fetch(`${API_URL}/api/verification/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: enteredCode.trim(),
        identifier: data.email, // Identify the verification record using the email
      }),
    });

    if (response.ok) {
      localStorage.removeItem(STORAGE_KEY); // clean up
      return true;
    }
  } catch (e) {
    console.error("Verification connection error:", e);
  }
  return false;
}
