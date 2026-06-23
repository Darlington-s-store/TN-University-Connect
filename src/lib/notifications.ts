import { supabase } from "@/integrations/supabase/client";

export type AppNotification = {
  id: string;
  recipient_role: "admin" | "member" | "public";
  recipient_id: string | null;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  metadata: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
};

export async function listNotifications(role: "admin" | "member" | "public", limit = 30) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_role", role)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as AppNotification[];
}

export async function createNotification(input: {
  recipient_role: "admin" | "member" | "public";
  recipient_id?: string | null;
  type: string;
  title: string;
  body?: string;
  link?: string;
  metadata?: Record<string, unknown>;
}) {
  // Fire-and-forget; ignore errors so we never block the user flow.
  try {
    await supabase.from("notifications").insert({
      recipient_role: input.recipient_role,
      recipient_id: input.recipient_id ?? null,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      link: input.link ?? null,
      metadata: (input.metadata ?? {}) as never,
    });
  } catch (err) {
    console.warn("[notifications] insert failed:", err);
  }
}

export async function markNotificationRead(id: string) {
  try {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  } catch (err) {
    console.warn("[notifications] mark read failed:", err);
  }
}

export async function markAllRead(role: "admin" | "member" | "public") {
  try {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("recipient_role", role)
      .eq("is_read", false);
  } catch (err) {
    console.warn("[notifications] mark all failed:", err);
  }
}

/** Clear any legacy localStorage notification keys. Called once on app boot. */
export function clearLegacyNotificationStorage() {
  try {
    localStorage.removeItem("tnu_read_announcements");
    localStorage.removeItem("tnu_notifications");
  } catch {
    /* noop */
  }
}
