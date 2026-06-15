import dotenv from "dotenv";

dotenv.config();

export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    console.log(`[EMAIL SIMULATION] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL SIMULATION] Content:\n${html}`);
    return true;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "TN Connect <onboarding@resend.dev>",
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Resend API returned status ${response.status}: ${errBody}`);
    }

    return true;
  } catch (err) {
    console.error("[EMAIL SERVICE ERROR]:", err.message);
    return false;
  }
}

export async function sendSMS({ to, message }) {
  const apiKey = process.env.ARKESEL_API_KEY;
  const senderId = process.env.ARKESEL_SENDER_ID || "TN Connect";

  if (!apiKey || apiKey.trim() === "") {
    console.log(`[SMS SIMULATION] To: ${to} | Message: ${message}`);
    return true;
  }

  try {
    const formattedPhone = to.replace(/[^0-9]/g, ""); // strip symbols
    const url = `https://sms.arkesel.com/sms/api?action=send-sms&api_key=${apiKey}&to=${formattedPhone}&from=${senderId}&sms=${encodeURIComponent(message)}`;

    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Arkesel API returned status ${response.status}: ${errBody}`);
    }

    return true;
  } catch (err) {
    console.error("[SMS SERVICE ERROR]:", err.message);
    return false;
  }
}
