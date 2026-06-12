import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, FileText, LogOut, Home } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/student-info", label: "Student Info", icon: FileText },
];

export default function MemberLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col lg:flex-row">
      <aside className="lg:w-64 bg-secondary text-secondary-foreground lg:min-h-screen flex lg:flex-col">
        <div className="p-4 border-b border-white/10 hidden lg:block">
          <Logo variant="light" />
        </div>

        <nav className="flex lg:flex-col gap-1 p-4 flex-1 overflow-x-auto">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-smooth whitespace-nowrap ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-white/80 hover:bg-white/10"
                }`
              }
            >
              <i.icon className="h-4 w-4" /> {i.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 hidden lg:block space-y-2">
          <div className="text-xs text-white/60">Signed in as</div>
          <div className="text-sm font-medium text-white truncate">{user?.name}</div>
          <Button variant="outline" size="sm" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10" onClick={() => navigate("/")}>
            <Home className="h-4 w-4" /> Back to site
          </Button>
          <Button variant="destructive" size="sm" className="w-full" onClick={() => { logout(); navigate("/"); }}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-full">
        <Outlet />
      </main>
    </div>
  );
}
