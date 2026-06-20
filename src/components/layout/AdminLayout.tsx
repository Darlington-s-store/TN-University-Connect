import { NavLink, useNavigate, useLocation } from "react-router-dom";
import AnimatedOutlet from "@/components/AnimatedOutlet";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Megaphone,
  BookOpen,
  Mail,
  Settings,
  LogOut,
  Home,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import {
  getAnnouncements,
  Announcement,
  getReadAnnouncements,
  markAnnouncementAsRead,
} from "@/lib/data";

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/blog", label: "Blog Posts", icon: BookOpen },
  { to: "/admin/messages", label: "Messages", icon: Mail },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <Logo variant="light" />
      </div>

      <div className="px-4 py-3 border-b border-white/10">
        <div className="text-[11px] uppercase tracking-wider text-accent font-semibold">
          Admin Panel
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        {items.map((i) => {
          const [path, query] = i.to.split("?");
          const isLinkActive = query
            ? location.pathname === path && location.search.includes(query)
            : i.end
              ? location.pathname === path
              : location.pathname === path && !location.search.includes("tab=");
          return (
            <NavLink
              key={i.to}
              to={i.to}
              onClick={onClose}
              className={() =>
                `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-smooth ${
                  isLinkActive
                    ? "bg-accent text-accent-foreground font-bold"
                    : "text-white/80 hover:bg-white/10"
                }`
              }
            >
              <i.icon className="h-4 w-4" /> {i.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 gap-2"
          onClick={() => {
            onClose?.();
            navigate("/");
          }}
        >
          <Home className="h-4 w-4" /> Back to site
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        console.error("Failed to load announcements in AdminLayout:", err);
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
          console.error("Failed to load read announcements in AdminLayout:", err);
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

  const getPageTitle = () => {
    const item = items.find((i) => i.to === location.pathname);
    if (item) return item.label;
    if (location.pathname === "/admin/settings") return "Settings";
    return "Admin Panel";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 bg-secondary text-secondary-foreground flex-col fixed inset-y-0 left-0 z-20">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 bg-secondary border-none w-64">
                <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>

            <h2 className="text-lg font-semibold text-secondary sm:block">{getPageTitle()}</h2>

            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 bg-muted/50 border-none rounded-full text-sm focus:ring-1 focus:ring-primary w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
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

            <div className="h-8 w-px bg-border mx-1"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="pl-1 pr-2 py-1.5 h-auto gap-2 hover:bg-muted/50 rounded-full"
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {user?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-medium text-secondary leading-none truncate max-w-[100px]">
                      {user?.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">Administrator</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/admin/settings")}
                  className="cursor-pointer gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/")} className="cursor-pointer gap-2">
                  <Home className="h-4 w-4" />
                  <span>View Website</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="cursor-pointer gap-2 text-ghana-red focus:text-ghana-red focus:bg-ghana-red/5"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <AnimatedOutlet />
        </main>
      </div>
    </div>
  );
}
