import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, User, FileText, LogOut, Home, Bell, Menu, Megaphone } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAnnouncements, Announcement } from "@/lib/data";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/student-info", label: "Student Info", icon: FileText },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-secondary text-secondary-foreground">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <Logo variant="light" />
      </div>

      <div className="px-4 py-3 border-b border-white/10">
        <div className="text-[11px] uppercase tracking-wider text-accent font-semibold">
          Student Portal
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-smooth ${
                isActive
                  ? "bg-accent text-accent-foreground font-bold"
                  : "text-white/80 hover:bg-white/10"
              }`
            }
          >
            <i.icon className="h-4 w-4" /> {i.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
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

export default function MemberLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const getPageTitle = () => {
    const item = items.find((i) => i.to === location.pathname);
    if (item) return item.label;
    if (location.pathname === "/profile") return "Profile";
    if (location.pathname === "/student-info") return "Student Info";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 bg-secondary text-secondary-foreground flex-col sticky top-0 h-screen z-20">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Topbar */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Navigation Sheet */}
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

            <h2 className="text-lg font-bold text-secondary">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:text-secondary flex"
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

            <div className="h-6 w-px bg-border mx-1"></div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="pl-1 pr-2 py-1.5 h-auto gap-2 hover:bg-muted/50 rounded-full"
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {user?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-bold text-secondary leading-none truncate max-w-[120px]">
                      {user?.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                      {user?.role || "Member"}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                  Profile Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/student-info")}
                  className="cursor-pointer"
                >
                  Student Verification
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="cursor-pointer text-ghana-red focus:text-ghana-red focus:bg-ghana-red/5 font-bold"
                >
                  <LogOut className="h-4 w-4 mr-2 inline" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
