import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldAlert, LogIn, Lock, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

const schema = z.object({
  email: z.string().trim().email("Enter a valid admin email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== "admin") {
        toast.error("Access Denied: This account does not have administrator privileges.");
        return;
      }
      toast.success(`Welcome to Admin Panel, ${user.name}`);
      navigate("/admin");
    } catch (e: unknown) {
      const err = e as Error;
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-[150px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <Logo variant="light" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <ShieldAlert className="h-4 w-4 text-accent" />
            <span className="text-xs uppercase tracking-[0.25em] text-accent font-bold">
              Admin Console
            </span>
          </div>
        </div>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl text-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-1">Administrative Sign In</h2>
            <p className="text-sm text-white/60 text-center mb-6">
              Enter your credentials below to access the management core.
            </p>

            <form onSubmit={submit} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-white/80">
                  Security Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent h-11"
                    placeholder="admin@tnuc.gh"
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-white/80">
                  Security Key (Password)
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent h-11"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-11 text-base font-bold shadow-lg shadow-accent/20 transition-all duration-300 mt-2"
              >
                <LogIn className="h-4 w-4 mr-2" /> {loading ? "Authorizing..." : "Authorize Portal"}
              </Button>
            </form>

            <div className="text-xs text-center text-white/45 pt-4 border-t border-white/10 mt-6">
              <strong>Admin Credentials:</strong> admin@tnuc.gh / admin123
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home Page
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
