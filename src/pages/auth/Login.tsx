import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";
import { decodeGoogleCredential, CLIENT_ID, isMockClientId } from "@/lib/google-utils";
import { MockGoogleButton } from "@/lib/google";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin, logout } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
                </div>
              </div>

              <div className="flex justify-center">
                {googleLoading ? (
                  <Button
                    disabled
                    variant="outline"
                    size="lg"
                    className="w-full bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  >
                    <svg className="animate-spin h-4 w-4 mr-2 text-ghana-gold" viewBox="0 0 24 24">
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
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google sign-in failed")}
                    theme="filled_blue"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    width="380"
                  />
                )}
              </div>
            </>
          )}
        </form>

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
  );
}
