import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";
import { decodeGoogleCredential, CLIENT_ID, isMockClientId } from "@/lib/google-utils";
import { MockGoogleButton } from "@/lib/google";
import { motion } from "framer-motion";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin, logout } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      toast.error("Please verify your credentials");
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === "admin") {
        logout();
        toast.error("Access Denied: Administrators must sign in using the Admin Login page.");
        return;
      }
      toast.success(`Welcome back, ${user.name}`);
      navigate("/dashboard");
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    const profile = decodeGoogleCredential(credentialResponse.credential);
    if (!profile) {
      toast.error("Failed to verify Google credentials");
      return;
    }
    setGoogleLoading(true);
    try {
      const user = await googleLogin(profile);
      if (user.role === "admin") {
        logout();
        toast.error("Access Denied: Administrators must sign in using the Admin Login page.");
        return;
      }
      toast.success(`Welcome${user.name ? `, ${user.name}` : " back"}!`);
      navigate("/dashboard");
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to connect with your university workspace"
    >
      {/* Navigation tab control */}
      <div className="flex bg-muted/65 p-1 rounded-xl mb-6 border border-muted/80">
        <div className="flex-1 text-center py-2 text-xs font-bold bg-card text-secondary shadow-soft cursor-default rounded-lg border">
          Sign In
        </div>
        <Link
          to="/register"
          className="flex-1 text-center py-2 text-xs font-semibold text-muted-foreground hover:text-secondary transition-all rounded-lg"
        >
          Sign Up
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <form onSubmit={submit} className="space-y-4" noValidate>
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="pl-9 h-9.5 text-sm"
              />
            </div>
            {errors.email && <p className="text-[10px] text-destructive font-medium mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="pl-9 pr-10 h-9.5 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-destructive font-medium mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.password}</p>}
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
              <Checkbox
                checked={form.remember}
                onCheckedChange={(v) => setForm({ ...form, remember: !!v })}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit Trigger */}
          <Button type="submit" disabled={loading} className="w-full h-10 font-semibold text-xs mt-2 shadow-sm">
            <LogIn className="h-4 w-4" /> {loading ? "Signing in..." : "Sign In"}
          </Button>

          {/* Social Divider & Google authentication */}
          {CLIENT_ID && (
            <>
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted/80" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-extrabold text-muted-foreground">
                  <span className="bg-background px-3">or login with</span>
=======
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-ghana-green/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-ghana-red/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[35%] right-[15%] w-[40%] h-[40%] rounded-full bg-ghana-gold/5 blur-[110px] pointer-events-none" />

      <div className="max-w-md w-full backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 text-white space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Logo variant="light" size="lg" className="mb-2" />
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400">
            Sign in to access your TN Universities Connect dashboard.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <Label
              htmlFor="email"
              className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-ghana-gold focus-visible:border-ghana-gold h-12 rounded-xl"
            />
            {errors.email && (
              <p className="text-xs text-ghana-red mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="text-xs text-ghana-gold hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-ghana-gold focus-visible:border-ghana-gold h-12 rounded-xl"
            />
            {errors.password && (
              <p className="text-xs text-ghana-red mt-1 font-medium">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm py-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 select-none">
              <Checkbox
                checked={form.remember}
                onCheckedChange={(v) => setForm({ ...form, remember: !!v })}
                className="border-white/20 data-[state=checked]:bg-ghana-green data-[state=checked]:text-white rounded"
              />
              <span>Remember me</span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full bg-ghana-green hover:bg-ghana-green/90 text-white h-12 rounded-xl transition-all duration-300 font-bold tracking-wide shadow-lg shadow-ghana-green/20"
          >
            <LogIn className="h-4 w-4 mr-2" /> {loading ? "Signing in..." : "Sign In"}
          </Button>

          {CLIENT_ID && (
            <>
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-950 px-3 text-slate-500 font-semibold tracking-wider">
                    or continue with
                  </span>
>>>>>>> 811c9f95b1fbe7c5428131b7a8d8c92208fe075f
                </div>
              </div>

              <div className="flex justify-center">
                {googleLoading ? (
<<<<<<< HEAD
                  <Button disabled variant="outline" className="w-full h-10 font-semibold text-xs">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
=======
                  <Button
                    disabled
                    variant="outline"
                    size="lg"
                    className="w-full bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  >
                    <svg className="animate-spin h-4 w-4 mr-2 text-ghana-gold" viewBox="0 0 24 24">
>>>>>>> 811c9f95b1fbe7c5428131b7a8d8c92208fe075f
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in...
                  </Button>
                ) : isMockClientId(CLIENT_ID) ? (
                  <MockGoogleButton
                    onClick={() => handleGoogleSuccess({ credential: "mock-credential" })}
                  />
                ) : (
<<<<<<< HEAD
                  <div className="w-full [&>div]:!w-full [&_iframe]:!w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error("Google sign-in failed")}
                      theme="outline"
                      size="large"
                      text="signin_with"
                      shape="rectangular"
                      width="100%"
                    />
                  </div>
=======
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google sign-in failed")}
                    theme="filled_blue"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    width="380"
                  />
>>>>>>> 811c9f95b1fbe7c5428131b7a8d8c92208fe075f
                )}
              </div>
            </>
          )}
        </form>
<<<<<<< HEAD
      </motion.div>
    </AuthShell>
=======

        <div className="pt-4 text-center text-sm text-slate-400 border-t border-white/5">
          New here?{" "}
          <Link to="/register" className="text-ghana-gold font-semibold hover:underline">
            Create an account
          </Link>
        </div>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
>>>>>>> 811c9f95b1fbe7c5428131b7a8d8c92208fe075f
  );
}
