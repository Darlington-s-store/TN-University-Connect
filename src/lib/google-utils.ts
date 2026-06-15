export const CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com";

export const isMockClientId = (clientId: string) => {
  return (
    !clientId ||
    clientId.includes("your-google-client-id") ||
    clientId.includes("y84712210666-sl4hjbnsrot1v0f1c3u4mncq7a9363hj")
  );
};

export function decodeGoogleCredential(
  credential?: string,
): { sub: string; email: string; name: string; picture?: string } | null {
  if (!credential) return null;
  if (credential === "mock-credential") {
    return {
      sub: "mock-sub-12345",
      email: "jane.doe@example.com",
      name: "Jane Doe",
      picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    };
  }
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
