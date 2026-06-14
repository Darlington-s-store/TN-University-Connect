import { GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";
import { ReactNode } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export function GoogleProvider({ children }: { children: ReactNode }) {
  if (!CLIENT_ID) return <>{children}</>;
  return <GoogleOAuthProvider clientId={CLIENT_ID}>{children}</GoogleOAuthProvider>;
}

export function decodeGoogleCredential(
  credential: string,
): { sub: string; email: string; name: string; picture?: string } | null {
  try {
    const base64 = credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    return {
      sub: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };
  } catch {
    return null;
  }
}
