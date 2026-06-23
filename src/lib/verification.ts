// Mock OTP system - in production this would email the code.
// For the demo we generate the code, store it in localStorage with a TTL,
// and return it so the UI can surface it (toast) for testing.

export interface VerificationData {
  email: string;
  phone: string;
  code: string;
  expiresAt: number;
}

const STORAGE_KEY = "tnu_active_verification";
const TTL_MS = 10 * 60 * 1000;

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generates a 6-digit OTP, stores it, and returns the code so the demo UI
 * can display it (acts as the "email" delivery channel for this mock build).
 */
export async function sendVerificationCode(email: string, phone: string): Promise<string> {
  const code = generateCode();
  const data: VerificationData = {
    email: email.trim().toLowerCase(),
    phone,
    code,
    expiresAt: Date.now() + TTL_MS,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Tiny artificial delay so it feels like a network roundtrip
  await new Promise((r) => setTimeout(r, 350));
  return code;
}

export async function verifyCode(enteredCode: string, email?: string): Promise<boolean> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const data: VerificationData = JSON.parse(raw);
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
    if (email && data.email !== email.trim().toLowerCase()) return false;
    const ok = data.code === enteredCode.trim();
    if (ok) localStorage.removeItem(STORAGE_KEY);
    return ok;
  } catch {
    return false;
  }
}

export function clearVerification() {
  localStorage.removeItem(STORAGE_KEY);
}
