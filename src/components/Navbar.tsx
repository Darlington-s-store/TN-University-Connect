import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogIn, UserPlus, ChevronDown, ShieldCheck, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/admin/login")}
                  className="cursor-pointer gap-2 text-xs text-muted-foreground"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Admin Login
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <button
          className="lg:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
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
                  <Link
                    to="/admin/login"
                    onClick={() => setOpen(false)}
                    className="text-xs text-muted-foreground flex items-center gap-1.5 px-1 pt-1"
                  >
                    <ShieldCheck className="h-3 w-3" /> Admin Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
