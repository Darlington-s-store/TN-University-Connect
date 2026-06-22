import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";
import { decodeGoogleCredential, CLIENT_ID, isMockClientId } from "@/lib/google-utils";
import { MockGoogleButton } from "@/lib/google";
import Logo from "@/components/Logo";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
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
    loadingStatus(true);
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
      loadingStatus(false);
    }
  };

  const loadingStatus = (val: boolean) => {
    setLoading(val);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fff5f5] via-[#fffdf2] to-[#effaf3] px-4 py-12 relative overflow-hidden">
      {/* Background orbs in Logo colors */}
      <div
        className="absolute -top-40 -right-40 w-[450px] h-[450px] rounded-full bg-ghana-gold/10 blur-[120px]"
        style={{ animation: "orb-drift 20s infinite ease-in-out" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full bg-ghana-red/6 blur-[120px]"
        style={{ animation: "orb-drift 25s infinite ease-in-out reverse" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-ghana-green/5 blur-[100px]"
        style={{ animation: "orb-drift 30s infinite ease-in-out" }}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes orb-drift {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(20px, -20px) scale(1.05); }
          }
        `
      }} />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Logo centered */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.06)] rounded-3xl overflow-hidden relative">
          <div className="h-1 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
          <div className="p-6 sm:p-8 space-y-5">
            {/* Title & Subtitle */}
            <div className="text-center space-y-2 mb-4">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Welcome Back</h1>
              <p className="text-slate-500 text-xs leading-relaxed">Sign in to connect with your university workspace.</p>
            </div>

            <form onSubmit={submit} className="space-y-4" noValidate>
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="kwame@university.edu.gh"
                    className="pl-10.5 h-11 bg-slate-50/50 border-slate-200/80 text-slate-950 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary/50 placeholder:text-slate-400 rounded-xl text-sm transition-colors"
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-ghana-red font-bold mt-1 flex items-center gap-1.5 animate-pulse">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="pl-10.5 pr-10.5 h-11 bg-slate-50/50 border-slate-200/80 text-slate-950 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary/50 placeholder:text-slate-400 rounded-xl text-sm transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-ghana-red font-bold mt-1 flex items-center gap-1.5 animate-pulse">
                    <AlertCircle className="h-3 w-3" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-600 hover:text-slate-800 transition-colors">
                  <Checkbox
                    checked={form.remember}
                    onCheckedChange={(v) => setForm({ ...form, remember: !!v })}
                    className="border-slate-300 bg-slate-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-white rounded-md"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-ghana-gold hover:bg-ghana-gold/90 text-slate-950 font-black tracking-wider uppercase text-xs rounded-xl transition-all shadow-[0_4px_15px_rgba(212,160,23,0.18)] hover:shadow-[0_4px_20px_rgba(212,160,23,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="h-4 w-4" /> Sign In
                  </span>
                )}
              </Button>
            </form>

            {/* Social Logins */}
            {CLIENT_ID && (
              <>
                <div className="relative py-2 mt-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase tracking-[0.25em] font-black">
                    <span className="bg-white px-4 text-slate-400">or connect with</span>
                  </div>
                </div>

                <div className="flex justify-center pt-1">
                  {googleLoading ? (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full h-11 bg-slate-50 border-slate-200 text-slate-400 font-bold text-xs rounded-xl"
                    >
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying Google...
                    </Button>
                  ) : isMockClientId(CLIENT_ID) ? (
                    <MockGoogleButton onClick={() => handleGoogleSuccess({ credential: "mock-credential" })} />
                  ) : (
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
                  )}
                </div>
              </>
            )}

            {/* Register Callout */}
            <div className="text-center mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium">
                New to TN Connect?{" "}
                <Link
                  to="/register"
                  className="font-black text-primary hover:text-primary/80 underline underline-offset-4 decoration-2 decoration-primary/20 hover:decoration-primary/60 transition-all ml-1"
                >
                  Create account here →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors duration-300 font-bold uppercase tracking-wider"
          >
            <span>← Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
