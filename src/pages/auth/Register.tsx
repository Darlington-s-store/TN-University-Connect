import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import {
  UserPlus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Eye,
  EyeOff,
  User,
  Lock,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import RegisterShell from "@/components/auth/RegisterShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { sendVerificationCode, verifyCode } from "@/lib/verification";
import { PhoneInput } from "@/components/PhoneInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Validation schema for registering user
const registerSchema = z.object({
  name: z.string().trim().min(2, "Full name is required").max(100),
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

export default function Register({ noShell = false }: { noShell?: boolean }) {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Wizard state: Step 1 (Sign Up Form), Step 2 (Verify profile code)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Password checklist evaluation
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

  // Score count out of 5
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
    "bg-destructive", // 0
    "bg-destructive", // 1
    "bg-destructive", // 2
    "bg-ghana-gold", // 3
    "bg-primary", // 4
    "bg-primary", // 5
  ][strengthScore];

  // Submit Step 1: Send Verification Code
  const handleCreateAccount = async (e: React.FormEvent) => {
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

    setVerificationLoading(true);
    try {
      await sendVerificationCode(form.email, form.phone);
      setStep(2);
      toast.success("Verification code sent to your email!");
    } catch (err: unknown) {
      const e = err as Error;
      toast.error(e.message || "Failed to send verification code. Try again.");
    } finally {
      setVerificationLoading(false);
    }
  };

  // Submit Step 2: Verify Code and complete registration
  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      return toast.error("Verification code is required");
    }

    setLoading(true);
    try {
      const isValid = await verifyCode(verificationCode);
      if (!isValid) {
        toast.error("Invalid or expired verification code");
        setLoading(false);
        return;
      }

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
      toast.success("Verification successful! Account created.");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: unknown) {
      const e = err as Error;
      toast.error(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setVerificationLoading(true);
    try {
      await sendVerificationCode(form.email, form.phone);
      toast.success("New verification code sent!");
    } catch (err) {
      const e = err as Error;
      toast.error(e.message || "Resend failed.");
    } finally {
      setVerificationLoading(false);
    }
  };

  if (done) {
    const successContent = (
      <div className="text-center py-6">
        <div className="h-20 w-20 rounded-full bg-accent/15 border border-accent/30 grid place-items-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-accent animate-bounce" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight">You're all set!</h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Your account has been successfully created. We are setting up your student dashboard.
          </p>
        </div>
        <p className="text-xs text-white/50 animate-pulse my-5">
          Redirecting you to your dashboard...
        </p>
        <Button
          asChild
          className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl font-bold"
        >
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );

    if (noShell) {
      return successContent;
    }

    return (
      <RegisterShell title="Welcome aboard!" subtitle="Your account has been created successfully.">
        {successContent}
      </RegisterShell>
    );
  }

  const formContent = (
    <>
      {/* Step badge if noShell */}
      {noShell && typeof step === "number" && (
        <div className="flex items-center justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              Step {step} of 2
            </span>
          </div>
        </div>
      )}

      {/* Already-a-member nudge — only show if not in tabs */}
      {!noShell && (
        <div className="mb-6 flex items-center justify-center gap-2 text-xs text-white/60">
          <span>Already have an account?</span>
          <Link
            to="/login"
            className="font-bold text-accent hover:text-accent/80 underline-offset-4 hover:underline"
          >
            Sign in here →
          </Link>
        </div>
      )}

      <div className="relative overflow-hidden min-h-[420px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <form onSubmit={handleCreateAccount} className="space-y-4" noValidate>
                {/* 1. Name Input */}
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


                {/* 3. Email Input */}
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

                {/* 4. Phone Input */}
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

                {/* 5. Password Input */}
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

                  {/* Password strength & requirements checklist */}
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

                      {/* Checklist Grid */}
                      <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-muted-foreground">
                        <div
                          className={`flex items-center gap-1 ${passChecks.length ? "text-ghana-green font-semibold" : ""}`}
                        >
                          <CheckCircle2
                            className={`h-3 w-3 ${passChecks.length ? "text-ghana-green" : "text-muted/60"}`}
                          />
                          <span>8+ characters</span>
                        </div>
                        <div
                          className={`flex items-center gap-1 ${passChecks.hasNumber ? "text-ghana-green font-semibold" : ""}`}
                        >
                          <CheckCircle2
                            className={`h-3 w-3 ${passChecks.hasNumber ? "text-ghana-green" : "text-muted/60"}`}
                          />
                          <span>One number</span>
                        </div>
                        <div
                          className={`flex items-center gap-1 ${passChecks.hasUpper ? "text-ghana-green font-semibold" : ""}`}
                        >
                          <CheckCircle2
                            className={`h-3 w-3 ${passChecks.hasUpper ? "text-ghana-green" : "text-muted/60"}`}
                          />
                          <span>Uppercase</span>
                        </div>
                        <div
                          className={`flex items-center gap-1 ${passChecks.hasLower ? "text-ghana-green font-semibold" : ""}`}
                        >
                          <CheckCircle2
                            className={`h-3 w-3 ${passChecks.hasLower ? "text-ghana-green" : "text-muted/60"}`}
                          />
                          <span>Lowercase</span>
                        </div>
                        <div
                          className={`flex items-center gap-1 ${passChecks.hasSpecial ? "text-ghana-green font-semibold" : ""}`}
                        >
                          <CheckCircle2
                            className={`h-3 w-3 ${passChecks.hasSpecial ? "text-ghana-green" : "text-muted/60"}`}
                          />
                          <span>Special character</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={verificationLoading}
                  className="w-full mt-6 h-10 font-semibold text-xs"
                >
                  {verificationLoading ? "Sending Verification..." : "Create Account"}
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="p-4 bg-primary/5 border border-primary/15 rounded-2xl flex flex-col items-center text-center">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-bold text-secondary text-sm font-display">
                  Security Code Sent!
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1 max-w-sm leading-normal">
                  We have dispatched a 6-digit confirmation key to <strong>{form.email}</strong>.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-200">0{step}</span>
                <span className="text-slate-300 text-xs font-bold">/02</span>
              </div>

              <form onSubmit={submitRegister} className="space-y-5">
                <div className="space-y-2 text-center">
                  <Label
                    htmlFor="verificationCode"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Enter 6-Digit Code
                  </Label>
                  <Input
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    className="text-center text-2xl font-bold tracking-[0.4em] h-12 focus-visible:ring-primary max-w-xs mx-auto rounded-xl"
                    maxLength={6}
                  />
                </div>

                <div className="flex justify-center text-xs text-muted-foreground">
                  Didn't receive the code?&nbsp;
                  <button
                    type="button"
                    onClick={resendCode}
                    className="text-primary hover:underline font-bold"
                  >
                    Resend Code
                  </button>
                </div>

                <div className="flex gap-3 mt-6 border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-9.5 text-xs font-semibold"
                    disabled={loading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] h-9.5 text-xs font-semibold"
                  >
                    <UserPlus className="h-4 w-4 mr-1.5" />{" "}
                    {loading ? "Creating..." : "Confirm & Sign Up"}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  if (noShell) {
    return formContent;
  }

  return (
    <RegisterShell
      title="Join the Network"
      subtitle="Create your account to connect with Ghana's universities, alumni, and student community."
      step={step}
      totalSteps={2}
    >
      {formContent}
    </RegisterShell>
  );
}
