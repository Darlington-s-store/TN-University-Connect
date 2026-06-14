import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
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
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                <LogIn className="h-4 w-4" /> Login
              </Button>
              <Button onClick={() => navigate("/register")} className="shadow-elegant">
                <UserPlus className="h-4 w-4" /> Join Now
              </Button>
            </>
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
            <div className="flex gap-2 pt-2 border-t border-border mt-2">
              {user ? (
                <Button
                  onClick={() => {
                    setOpen(false);
                    navigate(user.role === "admin" ? "/admin" : "/dashboard");
                  }}
                  className="flex-1"
                >
                  {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setOpen(false);
                      navigate("/register");
                    }}
                  >
                    Join Now
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
