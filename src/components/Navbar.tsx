import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  ChevronDown,
  ShieldCheck,
  User as UserIcon,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { getAnnouncements, Announcement } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/announcements", label: "Announcements" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Notification states
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    // Load announcements
    setAnnouncements(getAnnouncements().filter((a) => a.published));

    // Load read announcements
    const stored = localStorage.getItem("tnu_read_announcements");
    if (stored) {
      setReadIds(JSON.parse(stored));
    }
  }, [location.pathname]);

  const unreadAnnouncements = announcements.filter((a) => !readIds.includes(a.id));
  const unreadCount = unreadAnnouncements.length;

  const markAsRead = (id: string) => {
    const next = [...readIds, id];
    setReadIds(next);
    localStorage.setItem("tnu_read_announcements", JSON.stringify(next));
    navigate(`/announcements/${id}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="h-1 flag-stripe" />
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80 hover:text-primary hover:bg-muted"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Notification Bell (Visible on both desktop and mobile header) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-secondary flex cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-ghana-red text-[9px] font-black text-white rounded-full flex items-center justify-center border border-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 max-h-[350px] overflow-y-auto no-scrollbar"
            >
              <DropdownMenuLabel className="font-bold flex items-center justify-between">
                <span>Announcements</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] text-ghana-red bg-ghana-red/5 px-2 py-0.5 rounded">
                    {unreadCount} unread
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {announcements.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No announcements available.
                </div>
              ) : (
                announcements.map((a) => {
                  const isUnread = !readIds.includes(a.id);
                  return (
                    <DropdownMenuItem
                      key={a.id}
                      onClick={() => markAsRead(a.id)}
                      className={`p-3 cursor-pointer flex flex-col items-start gap-1 text-xs hover:bg-slate-50 border-b last:border-0 ${isUnread ? "bg-primary/5 font-semibold" : ""}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] text-accent-foreground bg-accent/40 px-1.5 py-0.2 rounded uppercase font-bold tracking-wider">
                          {a.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(a.date).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                      <div className="text-secondary leading-snug truncate w-full">{a.title}</div>
                      {isUnread && (
                        <div className="text-[10px] text-primary flex items-center gap-1 font-bold">
                          ● New Announcement
                        </div>
                      )}
                    </DropdownMenuItem>
                  );
                })
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop Auth Buttons / Dropdowns */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <Button
                onClick={() => navigate(user.role === "admin" ? "/admin" : "/dashboard")}
                variant="default"
              >
                {user.role === "admin" ? "Admin Panel" : "Dashboard"}
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="shadow-elegant gap-1.5">
                    <UserIcon className="h-4 w-4" />
                    Account
                    <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                    Get started
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => navigate("/login")}
                    className="cursor-pointer gap-2 font-semibold"
                  >
                    <LogIn className="h-4 w-4 text-primary" /> Login
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/register")}
                    className="cursor-pointer gap-2 font-semibold"
                  >
                    <UserPlus className="h-4 w-4 text-primary" /> Join Now
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-md text-sm font-medium ${
                    isActive ? "text-primary bg-primary/10" : "text-foreground/80"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="pt-3 mt-2 border-t border-border space-y-2">
              {user ? (
                <Button
                  onClick={() => {
                    setOpen(false);
                    navigate(user.role === "admin" ? "/admin" : "/dashboard");
                  }}
                  className="w-full"
                >
                  {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                </Button>
              ) : (
                <>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold px-1">
                    Account
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                  >
                    <LogIn className="h-4 w-4" /> Login
                  </Button>
                  <Button
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setOpen(false);
                      navigate("/register");
                    }}
                  >
                    <UserPlus className="h-4 w-4" /> Join Now
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
