import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { UserPlus, CheckCircle2, Mail, Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import RegisterShell from "@/components/auth/RegisterShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { PhoneInput } from "@/components/PhoneInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { decodeGoogleCredential, CLIENT_ID, isMockClientId } from "@/lib/google-utils";
import { MockGoogleButton } from "@/lib/google";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Full name is required").max(100),
  status: z.string().min(1, "Select your role"),
  level: z.string().min(1, "Select your academic level"),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(9, "Enter a valid phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

export default function Register() {
  const navigate = useNavigate();
  const { register, googleLogin, logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    name: "",
    status: "",
    level: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const passChecks = useMemo(() => {
    const pw = form.password;
    return {
      length: pw.length >= 8,
      hasNumber: /[0-9]/.test(pw),
      hasUpper: /[A-Z]/.test(pw),
      hasLower: /[a-z]/.test(pw),
      hasSpecial: /[^A-Za-z0-9]/.test(pw),
    };
  }, [form.password]);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (passChecks.length) score++;
    if (passChecks.hasNumber) score++;
    if (passChecks.hasUpper) score++;
    if (passChecks.hasLower) score++;
    if (passChecks.hasSpecial) score++;
    return score;
  }, [passChecks]);

  const strengthLabel =
    ["Too weak", "Weak", "Fair", "Good", "Strong"][Math.max(0, strengthScore - 1)] || "Too weak";
  const strengthColor = [
    "bg-destructive",
    "bg-destructive",
    "bg-destructive",
    "bg-ghana-gold",
    "bg-primary",
    "bg-primary",
  ][strengthScore];

  const handleRegister = async (e: React.FormEvent) => {
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
        level: form.level,
        status: form.status,
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
      <RegisterShell title="Welcome aboard!" subtitle="Your account has been created successfully.">
        <div className="text-center py-6">
          <div className="h-20 w-20 rounded-full bg-ghana-green/15 border border-ghana-green/30 grid place-items-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-ghana-green" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">You're all set!</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your account has been successfully created.
            </p>
          </div>
          <p className="text-xs text-slate-400 animate-pulse mt-5">
            Redirecting you to your dashboard...
          </p>
          <Button asChild className="w-full h-11 mt-4 font-bold rounded-xl">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </RegisterShell>
    );
  }

  return (
    <RegisterShell
      title="Join the Network"
      subtitle="Create your account to connect with Ghana's universities, alumni, and student community."
    >
      {/* Login nudge */}
      <div className="mb-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <span>Already have an account?</span>
        <Link
          to="/login"
          className="font-bold text-ghana-gold hover:text-ghana-gold/80 underline-offset-4 hover:underline"
        >
          Sign in here →
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">
              Full name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Kwame Mensah"
                className="pl-9 h-9.5 text-sm"
              />
            </div>
            {errors.name && (
              <p className="text-[10px] text-destructive font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Role & Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-semibold">
                I am a
              </Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger id="status" className="h-9.5 text-sm">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Alumni">Alumni</SelectItem>
                  <SelectItem value="Faculty">Faculty Member</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-[10px] text-destructive font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.status}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="level" className="text-xs font-semibold">
                Academic Level
              </Label>
              <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                <SelectTrigger id="level" className="h-9.5 text-sm">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.level && (
                <p className="text-[10px] text-destructive font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.level}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@university.edu.gh"
                className="pl-9 h-9.5 text-sm"
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-destructive font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold">
              Phone number
            </Label>
            <PhoneInput
              id="phone"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            {errors.phone && (
              <p className="text-[10px] text-destructive font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onFocus={() => setIsPasswordFocused(true)}
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
            {errors.password && (
              <p className="text-[10px] text-destructive font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.password}
              </p>
            )}

            {/* Password strength */}
            {(form.password || isPasswordFocused) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2.5 space-y-2 border-t pt-2.5 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-1 max-w-[150px]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${i <= strengthScore ? strengthColor : "bg-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground tracking-wide uppercase">
                    {strengthLabel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-muted-foreground">
                  {[
                    { key: "length" as const, label: "8+ characters" },
                    { key: "hasNumber" as const, label: "One number" },
                    { key: "hasUpper" as const, label: "Uppercase" },
                    { key: "hasLower" as const, label: "Lowercase" },
                    { key: "hasSpecial" as const, label: "Special character" },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className={`flex items-center gap-1 ${passChecks[key] ? "text-ghana-green font-semibold" : ""}`}
                    >
                      <CheckCircle2
                        className={`h-3 w-3 ${passChecks[key] ? "text-ghana-green" : "text-muted/60"}`}
                      />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6 h-10 font-semibold text-xs"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />{" "}
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          {/* Google sign-up */}
          {CLIENT_ID && (
            <>
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-extrabold text-slate-400">
                  <span className="bg-white px-3">or sign up with</span>
                </div>
              </div>

              <div className="flex justify-center">
                {googleLoading ? (
                  <Button disabled variant="outline" className="w-full h-10 font-semibold text-xs">
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
                    Signing up...
                  </Button>
                ) : isMockClientId(CLIENT_ID) ? (
                  <MockGoogleButton
                    onClick={() => handleGoogleSuccess({ credential: "mock-credential" })}
                    text="Sign up with Google"
                  />
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
        </form>
      </motion.div>
    </RegisterShell>
  );
}
