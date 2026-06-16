import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import AuthShell from "@/components/auth/AuthShell";
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
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your TN Universities Connect dashboard."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
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
        <Button type="submit" disabled={loading} size="lg" className="w-full">
          <LogIn className="h-4 w-4" /> {loading ? "Signing in..." : "Sign in"}
        </Button>
        {CLIENT_ID && (
          <>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>
            <div className="flex justify-center">
              {googleLoading ? (
                <Button disabled variant="outline" size="lg" className="w-full">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
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
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                />
              )}
            </div>
          </>
        )}
      </form>
    </AuthShell>
  );
}
