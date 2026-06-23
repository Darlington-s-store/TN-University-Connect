import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import {
  UserPlus,
  CheckCircle2,
  Mail,
  Eye,
  EyeOff,
  User,
  Lock,
  AlertCircle,
  Camera,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { decodeGoogleCredential, CLIENT_ID, isMockClientId } from "@/lib/google-utils";
import { MockGoogleButton } from "@/lib/google";
import { PhoneInput } from "@/components/PhoneInput";
import Logo from "@/components/Logo";
import AuthVideoBackground from "@/components/auth/AuthVideoBackground";
import { createNotification } from "@/lib/notifications";
import { sendVerificationCode, verifyCode } from "@/lib/verification";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(9, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Stage = "form" | "verify" | "done";

export default function Register() {
  const navigate = useNavigate();
  const { register, googleLogin, logout } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>("form");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    avatar: "" as string,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resending, setResending] = useState(false);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be under 4MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, avatar: reader.result as string }));
    reader.readAsDataURL(file);
  };

  // STEP 1 → Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      toast.error("Please fix the highlighted fields");
      return;
    }

    setLoading(true);
    try {
      const code = await sendVerificationCode(form.email, form.phone);
      setStage("verify");
      setOtp("");
      setOtpError("");
      toast.success("Verification code sent", {
        description: `For demo purposes your code is ${code}`,
        duration: 10000,
      });
    } catch (err) {
      toast.error((err as Error).message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 → Verify OTP & create account
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    if (otp.trim().length !== 6) {
      setOtpError("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const ok = await verifyCode(otp, form.email);
      if (!ok) {
        setOtpError("Invalid or expired code");
        setLoading(false);
        return;
      }

      const newUser = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        avatar: form.avatar || undefined,
      });

      createNotification({
        recipient_role: "admin",
        type: "user.register",
        title: "🎉 New account created",
        body: `${form.name} (${form.email}) just created a TN Connect account.`,
        link: "/admin/students",
        metadata: { userId: newUser?.id, email: form.email, phone: form.phone },
      });

      setStage("done");
      toast.success("Account verified & created!");
      setTimeout(() => navigate("/dashboard"), 1400);
    } catch (err) {
      toast.error((err as Error).message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const code = await sendVerificationCode(form.email, form.phone);
      toast.success("New code sent", {
        description: `Demo code: ${code}`,
        duration: 10000,
      });
    } catch (err) {
      toast.error((err as Error).message || "Failed to resend code");
    } finally {
      setResending(false);
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
        toast.error("Admins must sign in from the Admin Login page.");
        return;
      }
      createNotification({
        recipient_role: "admin",
        type: "user.register",
        title: "🎉 New Google sign-up",
        body: `${user.name || user.email} joined via Google.`,
        link: "/admin/students",
        metadata: { userId: user.id, email: user.email, provider: "google" },
      });
      toast.success(`Welcome${user.name ? `, ${user.name}` : " aboard"}!`);
      navigate("/dashboard");
    } catch (e) {
      toast.error((e as Error).message || "Google sign-up failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  // ---------- DONE ----------
  if (stage === "done") {
    return (
      <AuthVideoBackground>
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <Logo variant="light" />
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="h-1 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
            <div className="p-8 text-center space-y-5">
              <div className="h-16 w-16 rounded-full bg-primary/10 grid place-items-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-2xl font-bold text-foreground">You're verified!</h2>
                <p className="text-sm text-muted-foreground">
                  Your account is ready. Redirecting to your dashboard…
                </p>
              </div>
              <Button asChild className="w-full h-11 bg-primary text-primary-foreground">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </AuthVideoBackground>
    );
  }

  // ---------- VERIFY ----------
  if (stage === "verify") {
    return (
      <AuthVideoBackground>
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <Logo variant="light" />
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="h-1 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
            <div className="p-6 sm:p-8 space-y-5">
              <div className="text-center space-y-2">
                <div className="h-14 w-14 rounded-full bg-primary/10 grid place-items-center mx-auto">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code we sent to{" "}
                  <span className="font-semibold text-foreground">{form.email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyAndRegister} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-xs font-semibold">
                    Verification code
                  </Label>
                  <Input
                    id="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="h-12 text-center text-2xl tracking-[0.5em] font-bold"
                  />
                  {otpError && (
                    <p className="text-xs text-destructive flex items-center gap-1.5">
                      <AlertCircle className="h-3 w-3" /> {otpError}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary text-primary-foreground font-semibold"
                >
                  {loading ? "Verifying…" : "Verify & create account"}
                </Button>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setStage("form")}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3 w-3" /> Edit details
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="font-semibold text-primary hover:underline disabled:opacity-50"
                  >
                    {resending ? "Sending…" : "Resend code"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AuthVideoBackground>
    );
  }

  // ---------- FORM ----------
  return (
    <AuthVideoBackground>
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo variant="light" />
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-1 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
              <p className="text-muted-foreground text-sm">
                Join the TN Universities network — verified in seconds
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
              {/* Avatar */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-md">
                    <AvatarImage src={form.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {form.name
                        ? form.name
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")
                        : "+"}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center shadow"
                    aria-label="Upload profile photo"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onAvatarChange}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Add a profile photo (optional)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Full name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Kwame Mensah"
                    className="pl-10 h-11"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
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
                    className="pl-10 h-11"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-semibold">
                  Phone number
                </Label>
                <PhoneInput
                  id="phone"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" /> {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
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
                    placeholder="At least 8 characters"
                    className="pl-10 pr-10 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" /> {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary text-primary-foreground font-semibold"
              >
                {loading ? (
                  "Sending code…"
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="h-4 w-4" /> Send verification code
                  </span>
                )}
              </Button>
            </form>

            {CLIENT_ID && (
              <>
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-muted-foreground">or sign up with</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  {googleLoading ? (
                    <Button disabled variant="outline" className="w-full h-11">
                      Connecting Google…
                    </Button>
                  ) : isMockClientId(CLIENT_ID) ? (
                    <MockGoogleButton
                      onClick={() => handleGoogleSuccess({ credential: "mock-credential" })}
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

            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs text-white/80 hover:text-white font-medium">
            ← Back to home
          </Link>
        </div>
      </div>
    </AuthVideoBackground>
  );
}
