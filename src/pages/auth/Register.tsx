import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import {
  UserPlus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  Sparkles,
  Smartphone,
  Mail,
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
import { GHANA_SCHOOLS, FACULTIES, DEPARTMENTS, PROGRAMMES, LEVELS, CHURCHES } from "@/lib/schools";
import { sendVerificationCode, verifyCode } from "@/lib/verification";

// Step 1 schema
const step1Schema = z
  .object({
    name: z.string().trim().min(2, "Full name is required").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z.string().trim().min(9, "Enter a valid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters").max(100),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

// Step 2 schema
const step2Schema = z.object({
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  nationality: z.string().trim().min(2, "Nationality is required"),
  church: z.string().min(1, "Please select your church"),
});

// Step 3 schema
const step3Schema = z.object({
  schoolType: z.string().min(1, "Select school type"),
  uniType: z.string().optional(),
  school: z.string().min(1, "Select your school"),
  faculty: z.string().min(1, "Select your faculty"),
  department: z.string().min(1, "Select your department"),
  program: z.string().min(1, "Select your programme"),
  level: z.string().min(1, "Select your level"),
  status: z.string().min(1, "Select status"),
});

function passwordStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Wizard state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "+233 ",
    password: "",
    confirm: "",
    gender: "",
    nationality: "Ghanaian",
    church: "",
    schoolType: "",
    uniType: "",
    school: "",
    faculty: "",
    department: "",
    program: "",
    level: "",
    status: "Active Student",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);

  // Filter schools list based on selections
  const filteredSchools = useMemo(() => {
    if (!form.schoolType) return [];
    return GHANA_SCHOOLS.filter((s) => {
      if (s.type !== form.schoolType) return false;
      if (form.schoolType === "University") {
        return form.uniType ? s.uniType === form.uniType : true;
      }
      return true;
    });
  }, [form.schoolType, form.uniType]);

  const strength = useMemo(() => passwordStrength(form.password), [form.password]);
  const strengthLabel = ["Too weak", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "bg-destructive",
    "bg-destructive",
    "bg-ghana-gold",
    "bg-primary",
    "bg-primary",
  ][strength];

  // Reset uni sub-type & school selection when school type changes
  useEffect(() => {
    setForm((f) => ({ ...f, uniType: "", school: "" }));
  }, [form.schoolType]);

  useEffect(() => {
    setForm((f) => ({ ...f, school: "" }));
  }, [form.uniType]);

  // Handle navigation
  const nextStep = async () => {
    setErrors({});
    if (step === 1) {
      const result = step1Schema.safeParse({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirm: form.confirm,
      });
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
        setErrors(errs);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const result = step2Schema.safeParse({
        gender: form.gender,
        nationality: form.nationality,
        church: form.church,
      });
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
        setErrors(errs);
        return;
      }
      setStep(3);
    } else if (step === 3) {
      const result = step3Schema.safeParse({
        schoolType: form.schoolType,
        uniType: form.uniType || undefined,
        school: form.school,
        faculty: form.faculty,
        department: form.department,
        program: form.program,
        level: form.level,
        status: form.status,
      });
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
        setErrors(errs);
        return;
      }

      // Trigger verification code sending when moving to Step 4
      setVerificationLoading(true);
      try {
        await sendVerificationCode(form.email, form.phone);
        setStep(4);
      } catch (err) {
        toast.error("Failed to send verification code. Try again.");
      } finally {
        setVerificationLoading(false);
      }
    }
  };

  const prevStep = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      return toast.error("Verification code is required");
    }

    setLoading(true);
    try {
      const isValid = verifyCode(verificationCode);
      if (!isValid) {
        toast.error("Invalid or expired verification code");
        setLoading(false);
        return;
      }

      await register(form);
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

  const stepPercentage = (step / 4) * 100;

  return (
    <AuthShell
      title="Create your account"
      subtitle={`Step ${step} of 4 — ${["Account Credentials", "Personal Details", "Institution Info", "Verify Profile"][step - 1]}`}
      footer={
        step === 1 ? (
          <>
            Already a member?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </>
        ) : null
      }
    >
      <div className="mb-6">
        <Progress value={stepPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-2 font-medium">
          <span className={step >= 1 ? "text-primary font-bold" : ""}>Credentials</span>
          <span className={step >= 2 ? "text-primary font-bold" : ""}>Personal</span>
          <span className={step >= 3 ? "text-primary font-bold" : ""}>School</span>
          <span className={step >= 4 ? "text-primary font-bold" : ""}>Verification</span>
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
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Kwame Mensah"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="kwame@example.com"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number (For SMS)</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+233 24 123 4567"
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  {form.password && (
                    <div className="mt-1">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded ${i < strength ? strengthColor : "bg-muted"}`}
                          />
                        ))}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {strengthLabel}
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  />
                  {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
                </div>
              </div>

              <Button onClick={nextStep} className="w-full mt-4 h-11">
                Continue <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="gender">Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other / Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={form.nationality}
                  onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                />
                {errors.nationality && (
                  <p className="text-xs text-destructive">{errors.nationality}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="church">Church Affiliation</Label>
                <Select value={form.church} onValueChange={(v) => setForm({ ...form, church: v })}>
                  <SelectTrigger id="church">
                    <SelectValue placeholder="Select Church" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHURCHES.map((ch) => (
                      <SelectItem key={ch} value={ch}>
                        {ch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.church && <p className="text-xs text-destructive">{errors.church}</p>}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={prevStep} className="w-1/3 h-11">
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                </Button>
                <Button onClick={nextStep} className="w-2/3 h-11">
                  Continue <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="schoolType">School Type</Label>
                  <Select
                    value={form.schoolType}
                    onValueChange={(v) => setForm({ ...form, schoolType: v })}
                  >
                    <SelectTrigger id="schoolType">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="Nursing & Midwifery">Nursing & Midwifery</SelectItem>
                      <SelectItem value="College of Education">College of Education</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.schoolType && (
                    <p className="text-xs text-destructive">{errors.schoolType}</p>
                  )}
                </div>

                {form.schoolType === "University" && (
                  <div className="space-y-1">
                    <Label htmlFor="uniType">University Sub-type</Label>
                    <Select
                      value={form.uniType}
                      onValueChange={(v) => setForm({ ...form, uniType: v })}
                    >
                      <SelectTrigger id="uniType">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Public Universities</SelectItem>
                        <SelectItem value="Technical">Technical Universities</SelectItem>
                        <SelectItem value="Private">Private Universities</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.uniType && <p className="text-xs text-destructive">{errors.uniType}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="school">School / Institution Name</Label>
                <Select
                  value={form.school}
                  onValueChange={(v) => setForm({ ...form, school: v })}
                  disabled={!form.schoolType || (form.schoolType === "University" && !form.uniType)}
                >
                  <SelectTrigger id="school" className="text-left whitespace-normal h-auto py-2">
                    <SelectValue
                      placeholder={
                        !form.schoolType ? "Select School Type First" : "Select Institution"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {filteredSchools.map((s) => (
                      <SelectItem key={s.name} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.school && <p className="text-xs text-destructive">{errors.school}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="faculty">Faculty</Label>
                  <Select
                    value={form.faculty}
                    onValueChange={(v) => setForm({ ...form, faculty: v })}
                  >
                    <SelectTrigger id="faculty">
                      <SelectValue placeholder="Select Faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {FACULTIES.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.faculty && <p className="text-xs text-destructive">{errors.faculty}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={form.department}
                    onValueChange={(v) => setForm({ ...form, department: v })}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-xs text-destructive">{errors.department}</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="program">Programme of Study</Label>
                  <Select
                    value={form.program}
                    onValueChange={(v) => setForm({ ...form, program: v })}
                  >
                    <SelectTrigger id="program">
                      <SelectValue placeholder="Select Programme" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAMMES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.program && <p className="text-xs text-destructive">{errors.program}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="level">Current Level</Label>
                  <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((l) => (
                        <SelectItem key={l} value={l}>
                          Level {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.level && <p className="text-xs text-destructive">{errors.level}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="status">Student / Professional Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active Student">Active Student</SelectItem>
                    <SelectItem value="Alumni">Alumni</SelectItem>
                    <SelectItem value="Completed">Completed Study</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={prevStep} className="w-1/3 h-11">
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                </Button>
                <Button onClick={nextStep} disabled={verificationLoading} className="w-2/3 h-11">
                  {verificationLoading ? "Sending Code..." : "Continue"}{" "}
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="p-4 bg-muted/50 border rounded-2xl flex flex-col items-center text-center">
                <div className="flex gap-3 mb-2">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center text-accent-foreground">
                    <Smartphone className="h-4.5 w-4.5" />
                  </div>
                </div>
                <h4 className="font-bold text-secondary text-sm">Security Codes Sent!</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  We have dispatched a 6-digit confirmation key to <strong>{form.email}</strong> and
                  SMS to <strong>{form.phone}</strong>.
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
                    onClick={prevStep}
                    className="w-1/3 h-11"
                    disabled={loading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                  </Button>
                  <Button type="submit" disabled={loading} className="w-2/3 h-11">
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
