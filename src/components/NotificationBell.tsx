import { useEffect, useState, useCallback } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AppNotification,
  listNotifications,
  markAllRead,
  markNotificationRead,
} from "@/lib/notifications";
import { supabase } from "@/integrations/supabase/client";

interface NotificationBellProps {
  role: "admin" | "member" | "public";
  iconClassName?: string;
  triggerClassName?: string;
}

export default function NotificationBell({
  role,
  iconClassName,
  triggerClassName,
}: NotificationBellProps) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const data = await listNotifications(role);
      setItems(data);
    } catch (err) {
      console.warn("notifications load failed", err);
    }
  }, [role]);

  useEffect(() => {
    load();
    // Realtime subscription
    const channel = supabase
      .channel(`notif-${role}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `recipient_role=eq.${role}`,
        },
        () => load(),
      )
      .subscribe();
    const poll = setInterval(load, 30000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [load, role]);

  const unread = items.filter((n) => !n.is_read);

  const handleClick = async (n: AppNotification) => {
    if (!n.is_read) {
      await markNotificationRead(n.id);
      setItems((prev) => prev.map((p) => (p.id === n.id ? { ...p, is_read: true } : p)));
    }
    if (n.link) navigate(n.link);
  };

  const handleMarkAll = async () => {
    await markAllRead(role);
    setItems((prev) => prev.map((p) => ({ ...p, is_read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative cursor-pointer ${triggerClassName ?? "text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-300 hover:scale-105"}`}
          aria-label="Notifications"
        >
          <Bell className={iconClassName ?? "h-5 w-5"} />
          {unread.length > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-ghana-red text-[9px] font-black text-white rounded-full flex items-center justify-center border border-white">
              {unread.length > 9 ? "9+" : unread.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto no-scrollbar">
        <DropdownMenuLabel className="font-bold flex items-center justify-between">
          <span>Notifications</span>
          {unread.length > 0 && (
            <button
              onClick={handleMarkAll}
              className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold"
            >
              <CheckCheck className="h-3 w-3" /> Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground">
            You're all caught up — no notifications.
          </div>
        ) : (
          items.map((n) => (
            <DropdownMenuItem
              key={n.id}
              onClick={() => handleClick(n)}
              className={`p-3 cursor-pointer flex flex-col items-start gap-1 text-xs hover:bg-slate-50 border-b last:border-0 ${
                !n.is_read ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-[9px] uppercase font-bold tracking-wider bg-accent/40 text-accent-foreground px-1.5 py-0.5 rounded">
                  {n.type.replace(/\./g, " ")}
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </span>
              </div>
              <div
                className={`leading-snug w-full ${!n.is_read ? "font-bold text-secondary" : "text-foreground/80"}`}
              >
                {n.title}
              </div>
              {n.body && (
                <div className="text-[11px] text-muted-foreground line-clamp-2">{n.body}</div>
              )}
              {!n.is_read && (
                <div className="text-[10px] text-ghana-red font-bold flex items-center gap-1">
                  ● New
                </div>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
