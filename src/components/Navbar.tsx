import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  getAnnouncements,
  Announcement,
  getReadAnnouncements,
  markAnnouncementAsRead,
} from "@/lib/data";
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
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Notification states
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  useEffect(() => {
    // Load announcements
    async function loadAnnouncements() {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data.filter((a) => a.published));
      } catch (err) {
        console.error("Failed to load announcements in Navbar:", err);
      }
    }
    loadAnnouncements();

    // Load read announcements
    async function loadReadAnnouncements() {
      if (user) {
        try {
          const ids = await getReadAnnouncements();
          setReadIds(ids);
        } catch (err) {
          console.error("Failed to load read announcements in Navbar:", err);
          const stored = localStorage.getItem("tnu_read_announcements");
          if (stored) setReadIds(JSON.parse(stored));
        }
      } else {
        const stored = localStorage.getItem("tnu_read_announcements");
        if (stored) {
          setReadIds(JSON.parse(stored));
        }
      }
    }
    loadReadAnnouncements();
  }, [location.pathname, user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const unreadAnnouncements = announcements.filter((a) => !readIds.includes(a.id));
  const unreadCount = unreadAnnouncements.length;

  const markAsRead = async (id: string) => {
    const next = [...readIds, id];
    setReadIds(next);
    if (user) {
      try {
        await markAnnouncementAsRead(id);
      } catch (err) {
        console.error("Failed to mark announcement as read on backend:", err);
        localStorage.setItem("tnu_read_announcements", JSON.stringify(next));
      }
    } else {
      localStorage.setItem("tnu_read_announcements", JSON.stringify(next));
    }
    navigate(`/announcements/${id}`);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-out relative ${
        scrolled
          ? "bg-background/95 backdrop-blur-lg shadow-lg border-b border-border/80"
          : "bg-background/60 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="h-1 flag-stripe" />
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `py-2 text-sm font-semibold transition-all duration-300 relative ${
                  isActive
                    ? "text-primary after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-primary"
                    : "text-foreground/70 hover:text-primary hover-underline-animate"
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
                className="relative text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-300 hover:scale-105 flex cursor-pointer"
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
              <div className="flex items-center gap-2">
                {user.role === "member" && !user.profileComplete && (
                  <Button
                    onClick={() => navigate("/student-info")}
                    className="bg-ghana-gold hover:bg-ghana-gold/90 text-slate-900 shadow-glow-accent font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Register Student
                  </Button>
                )}
                <Button
                  onClick={() => navigate(user.role === "admin" ? "/admin" : "/dashboard")}
                  variant={user.role === "member" && !user.profileComplete ? "outline" : "default"}
                >
                  {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                </Button>
              </div>
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.95 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: "top" }}
            className="lg:hidden absolute top-full left-0 w-full border-t border-border bg-background/95 backdrop-blur-lg shadow-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: -12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.97 }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.07,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <NavLink
                    to={l.to}
                    end={l.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-sm font-semibold block transition-all duration-300 relative overflow-hidden ${
                        isActive
                          ? "text-primary bg-primary/5 border-l-2 border-primary pl-5"
                          : "text-foreground/80 hover:text-primary hover:bg-muted/30 border-l-2 border-transparent hover:pl-5"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{
                  duration: 0.35,
                  delay: links.length * 0.07 + 0.1,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="pt-3 mt-2 border-t border-border space-y-2"
              >
                {user ? (
                  <div className="space-y-2">
                    {user.role === "member" && !user.profileComplete && (
                      <Button
                        onClick={() => {
                          setOpen(false);
                          navigate("/student-info");
                        }}
                        className="w-full bg-ghana-gold hover:bg-ghana-gold/90 text-slate-900 font-bold"
                      >
                        Register Student
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        setOpen(false);
                        navigate(user.role === "admin" ? "/admin" : "/dashboard");
                      }}
                      variant={
                        user.role === "member" && !user.profileComplete ? "outline" : "default"
                      }
                      className="w-full"
                    >
                      {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                    </Button>
                  </div>
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
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
