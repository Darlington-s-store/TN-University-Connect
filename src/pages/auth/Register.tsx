import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { UserPlus, CheckCircle2, Mail, Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { decodeGoogleCredential, CLIENT_ID, isMockClientId } from "@/lib/google-utils";
import { MockGoogleButton } from "@/lib/google";
import { PhoneInput } from "@/components/PhoneInput";
import Logo from "@/components/Logo";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(9, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Register() {
  const navigate = useNavigate();
  const { register, googleLogin, logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      toast.error("Please fill all fields correctly");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        gender: "other",
        nationality: "Ghanaian",
        school: "",
        schoolType: "University",
        uniType: "Public",
        faculty: "",
        department: "",
        program: "",
        level: "",
        status: "Active Student",
        church: "",
        niche: "",
      });

      setDone(true);
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: unknown) {
      const e = err as Error;
      toast.error(e.message || "Registration failed");
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
      toast.success(`Welcome${user.name ? `, ${user.name}` : " aboard"}!`);
      navigate("/dashboard");
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || "Google sign-up failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fff5f5] via-[#fffdf2] to-[#effaf3] px-4 py-12 relative overflow-hidden">
        {/* Background orbs in Logo colors */}
        <div className="absolute -top-40 -right-40 w-[450px] h-[450px] rounded-full bg-ghana-gold/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full bg-ghana-red/6 blur-[120px]" />

        <div className="w-full max-w-md relative z-10 space-y-6">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.06)] rounded-3xl overflow-hidden relative">
            <div className="h-1 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
            <div className="p-6 sm:p-8 text-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary/20 grid place-items-center mx-auto">
                <CheckCircle2 className="h-10 w-10 text-primary animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">You're all set!</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Your account has been created. Redirecting to your dashboard...
                </p>
              </div>
              <Button asChild className="w-full h-11 bg-ghana-gold hover:bg-ghana-gold/90 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-[0_4px_15px_rgba(212,160,23,0.18)]">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Join the Network</h1>
              <p className="text-slate-500 text-xs leading-relaxed">Create your account to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Full name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Kwame Mensah"
                    className="pl-10.5 h-11 bg-slate-50/50 border-slate-200/80 text-slate-950 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary/50 placeholder:text-slate-400 rounded-xl text-sm transition-colors"
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] text-ghana-red font-bold mt-1 flex items-center gap-1.5 animate-pulse">
                    <AlertCircle className="h-3 w-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Address */}
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
                    placeholder="you@university.edu.gh"
                    className="pl-10.5 h-11 bg-slate-50/50 border-slate-200/80 text-slate-950 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary/50 placeholder:text-slate-400 rounded-xl text-sm transition-colors"
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-ghana-red font-bold mt-1 flex items-center gap-1.5 animate-pulse">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Phone number
                </Label>
                <PhoneInput
                  id="phone"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                />
                {errors.phone && (
                  <p className="text-[10px] text-ghana-red font-bold mt-1 flex items-center gap-1.5 animate-pulse">
                    <AlertCircle className="h-3 w-3" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
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

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full h-11 bg-ghana-gold hover:bg-ghana-gold/90 text-slate-950 font-black tracking-wider uppercase text-xs rounded-xl transition-all shadow-[0_4px_15px_rgba(212,160,23,0.18)] hover:shadow-[0_4px_20px_rgba(212,160,23,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="h-4 w-4" /> Create Account
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
                    <span className="bg-white px-4 text-slate-400">or sign up with</span>
                  </div>
                </div>

                <div className="flex justify-center pt-1">
                  {googleLoading ? (
                    <Button disabled variant="outline" className="w-full h-11 bg-slate-50 border-slate-200 text-slate-400 font-bold text-xs rounded-xl">
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Connecting Google...
                    </Button>
                  ) : isMockClientId(CLIENT_ID) ? (
                    <MockGoogleButton onClick={() => handleGoogleSuccess({ credential: "mock-credential" })} />
                  ) : (
                    <div className="w-full [&>div]:!w-full [&_iframe]:!w-full">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => toast.error("Google sign-up failed")}
                        theme="outline"
                        size="large"
                        text="signup_with"
                        shape="rectangular"
                        width="100%"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Sign In Callout */}
            <div className="text-center mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-black text-primary hover:text-primary/80 underline underline-offset-4 decoration-2 decoration-primary/20 hover:decoration-primary/60 transition-all ml-1"
                >
                  Sign in here →
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
