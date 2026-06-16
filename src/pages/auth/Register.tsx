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
} from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { sendVerificationCode, verifyCode } from "@/lib/verification";

// Validation schema for registering user
const registerSchema = z.object({
  name: z.string().trim().min(2, "Full name is required").max(100),
  status: z.string().min(1, "Select your role"),
  level: z.string().min(1, "Select your academic level"),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(9, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Wizard state: Step 1 (Sign Up Form), Step 2 (Verify profile code)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Streamlined Form fields
  const [form, setForm] = useState({
    name: "",
    status: "", // Dropdown: Student, Alumni, Faculty, Other
    level: "",  // Dropdown: Undergraduate, Postgraduate, High School, Other
    email: "",
    phone: "+233 ",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password checklist evaluation
  const passChecks = useMemo(() => {
    const pw = form.password;
    return {
      length: pw.length >= 8,
      hasNumber: /[0-9]/.test(pw),
      hasUpper: /[A-Z]/.test(pw),
      hasLower: /[a-z]/.test(pw),
      notCommon: pw.length > 0 && !["password", "12345678", "qwertyui", "password123"].includes(pw.toLowerCase()),
    };
  }, [form.password]);

  // Score count out of 5
  const strengthScore = useMemo(() => {
    let score = 0;
    if (passChecks.length) score++;
    if (passChecks.hasNumber) score++;
    if (passChecks.hasUpper) score++;
    if (passChecks.hasLower) score++;
    if (passChecks.notCommon) score++;
    return score;
  }, [passChecks]);

  const strengthLabel = ["Too weak", "Weak", "Fair", "Good", "Strong"][Math.max(0, strengthScore - 1)] || "Too weak";
  const strengthColor = [
    "bg-destructive", // 0
    "bg-destructive", // 1
    "bg-destructive", // 2
    "bg-ghana-gold",   // 3
    "bg-primary",      // 4
    "bg-primary",      // 5
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
      return;
    }

    setVerificationLoading(true);
    try {
      // Dispatch OTP code via backend SMTP route
      await sendVerificationCode(form.email, form.phone);
      setStep(2);
      toast.success("Verification code sent to your email!");
    } catch (err) {
      toast.error("Failed to send verification code. Try again.");
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

      // Complete registration with the simplified details
      // Fill out backward compatible mock values for other fields required by DB/context
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
      toast.error("Resend failed.");
    } finally {
      setVerificationLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell title="Welcome aboard!" subtitle="Your account has been created successfully.">
        <div className="text-center py-8">
          <div className="h-20 w-20 rounded-full bg-primary/10 grid place-items-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <p className="text-muted-foreground mb-6">Redirecting you to your dashboard...</p>
          <Button asChild>
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Welcome"
      subtitle="Sign in to access your account or create a new one"
    >
      {/* Navigation tab control */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <Link
          to="/login"
          className="flex-1 text-center py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-secondary transition-all"
        >
          Sign In
        </Link>
        <div className="flex-1 text-center py-2.5 rounded-lg text-sm font-bold bg-white text-secondary shadow-soft">
          Sign Up
        </div>
      </div>

      <div className="relative overflow-hidden min-h-[380px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >


              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="status">I am a *</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => setForm({ ...form, status: v })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Alumni">Alumni</SelectItem>
                        <SelectItem value="Faculty">Faculty</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="level">Academic Level</Label>
                    <Select
                      value={form.level}
                      onValueChange={(v) => setForm({ ...form, level: v })}
                    >
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.level && <p className="text-xs text-destructive">{errors.level}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+233 50 000 0000"
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}

                  {/* Password strength & requirements checklist */}
                  {form.password && (
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex gap-1 flex-1 max-w-[200px]">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded ${i <= strengthScore ? strengthColor : "bg-muted"}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground tracking-wide uppercase">
                          {strengthLabel}
                        </span>
                      </div>

                      {/* Checklist grid matching reference image */}
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-[10px] sm:text-xs text-muted-foreground mt-2 border-t pt-2">
                        <div className={`flex items-center gap-1.5 ${passChecks.length ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                          <CheckCircle2 className={`h-3.5 w-3.5 ${passChecks.length ? "text-primary" : "text-slate-300"}`} />
                          <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passChecks.hasNumber ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                          <CheckCircle2 className={`h-3.5 w-3.5 ${passChecks.hasNumber ? "text-primary" : "text-slate-300"}`} />
                          <span>Contains a number</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passChecks.hasUpper ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                          <CheckCircle2 className={`h-3.5 w-3.5 ${passChecks.hasUpper ? "text-primary" : "text-slate-300"}`} />
                          <span>Contains uppercase letter</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passChecks.hasLower ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                          <CheckCircle2 className={`h-3.5 w-3.5 ${passChecks.hasLower ? "text-primary" : "text-slate-300"}`} />
                          <span>Contains lowercase letter</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passChecks.notCommon ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                          <CheckCircle2 className={`h-3.5 w-3.5 ${passChecks.notCommon ? "text-primary" : "text-slate-300"}`} />
                          <span>Not a common password</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={verificationLoading}
                  size="lg"
                  className="w-full mt-6 h-12"
                >
                  {verificationLoading ? "Sending Code..." : "Create Account"} <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="p-4 bg-muted/50 border rounded-2xl flex flex-col items-center text-center">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-bold text-secondary text-sm">Security Code Sent!</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  We have dispatched a 6-digit confirmation key to <strong>{form.email}</strong>.
                </p>
              </div>

              <form onSubmit={submitRegister} className="space-y-4">
                <div className="space-y-2 text-center">
                  <Label htmlFor="verificationCode" className="text-sm font-bold">
                    Enter 6-Digit Code
                  </Label>
                  <Input
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                    }
                    placeholder="Enter Code"
                    className="text-center text-2xl font-bold tracking-[0.4em] h-12 focus-visible:ring-primary max-w-xs mx-auto"
                    maxLength={6}
                  />
                </div>

                <div className="flex justify-center text-xs text-muted-foreground mt-2">
                  Didn't receive the code?&nbsp;
                  <button
                    type="button"
                    onClick={resendCode}
                    className="text-primary hover:underline font-bold"
                  >
                    Resend Code
                  </button>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 sm:w-1/3 sm:flex-none h-11"
                    disabled={loading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:w-2/3 sm:flex-none h-11"
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
    </AuthShell>
  );
}
