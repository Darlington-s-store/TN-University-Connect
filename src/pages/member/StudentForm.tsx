import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Eye,
  Pencil,
  Upload,
  ArrowRight,
  ArrowLeft,
  User,
  GraduationCap,
  Sparkles,
  Check,
  FileText,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { getStudentMe, submitStudentForm, Student } from "@/lib/data";
import {
  FACULTIES,
  DEPARTMENTS,
  PROGRAMMES,
  LEVELS,
  CHURCHES,
  NICHES,
  getGhanaSchools,
  GhanaSchool,
} from "@/lib/schools";
import { PhoneInput } from "@/components/PhoneInput";

// Base validation schema
const schema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(120),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().min(7, "Phone number too short").max(20),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().min(1, "Date of birth required"),
  nationality: z.string().min(1, "Nationality required"),
  church: z.string().min(1, "Church affiliation is required"),
  niche: z.string().min(1, "Focus niche is required"),
  schoolType: z.string().min(1, "School type is required"),
  uniType: z.string().optional(),
  university: z.string().min(1, "Institution name is required"),
  faculty: z.string().min(1, "Faculty is required"),
  department: z.string().min(1, "Department is required"),
  program: z.string().min(1, "Programme of study is required"),
  level: z.string().min(1, "Level is required"),
  status: z.string().min(1, "Enrollment status is required"),
  indexNumber: z.string().min(3, "Index/Student ID required"),
  address: z.string().min(2, "Contact address is required"),
});

// Step-specific Zod schemas for partial validation
const step1Schema = schema.pick({
  fullName: true,
  email: true,
  phone: true,
  gender: true,
  dob: true,
  nationality: true,
});

const step2Schema = schema.pick({
  schoolType: true,
  uniType: true,
  university: true,
  faculty: true,
  department: true,
  program: true,
  level: true,
  status: true,
  indexNumber: true,
  address: true,
});

const step3Schema = schema.pick({
  church: true,
  niche: true,
});

export default function StudentForm() {
  const { user, updateUser } = useAuth();
  const [existing, setExisting] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<GhanaSchool[]>([]);

  // Wizard state: "form" | "preview" | "done"
  const [step, setStep] = useState<"form" | "preview" | "done">("form");
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "male",
    dob: "",
    nationality: user?.nationality || "Ghanaian",
    church: user?.church || "",
    niche: user?.niche || "",
    schoolType: user?.schoolType || "",
    uniType: user?.uniType || "",
    university: user?.university || "",
    faculty: user?.faculty || "",
    department: user?.department || "",
    program: user?.program || "",
    level: user?.level || "",
    status: user?.status || "Active Student",
    indexNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      try {
        const student = await getStudentMe();
        if (student) {
          setExisting(student);
          const isComplete = !!(student.university && student.department);
          setForm({
            fullName: student.fullName || user?.name || "",
            email: student.email || user?.email || "",
            phone: student.phone || user?.phone || "",
            gender: student.gender || user?.gender || "male",
            dob:
              student.dob && student.dob !== new Date().toISOString().slice(0, 10)
                ? student.dob
                : "",
            nationality: student.nationality || user?.nationality || "Ghanaian",
            church: student.church || user?.church || "",
            niche: student.niche || user?.niche || "",
            schoolType: student.schoolType || user?.schoolType || "",
            uniType: student.uniType || user?.uniType || "",
            university: student.university || user?.university || "",
            faculty: student.faculty || user?.faculty || "",
            department: student.department || user?.department || "",
            program: student.program || user?.program || "",
            level: student.level || user?.level || "",
            status: student.status || user?.status || "Active Student",
            indexNumber:
              student.indexNumber && !student.indexNumber.startsWith("STU")
                ? student.indexNumber
                : "",
            address: student.address && student.address !== "Accra, Ghana" ? student.address : "",
          });
          if (isComplete) {
            setStep("done");
          }
        }
      } catch (err) {
        console.error("Failed to load student info:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
    setSchools(getGhanaSchools());
  }, [user]);

  useEffect(() => {
    if (user && !existing) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        gender:
          prev.gender === "male" && user.gender
            ? (user.gender as "male" | "female" | "other")
            : prev.gender,
        nationality:
          prev.nationality === "Ghanaian" && user.nationality ? user.nationality : prev.nationality,
        church: prev.church || user.church || "",
        niche: prev.niche || user.niche || "",
        schoolType: prev.schoolType || user.schoolType || "",
        uniType: prev.uniType || user.uniType || "",
        university: prev.university || user.university || "",
        faculty: prev.faculty || user.faculty || "",
        department: prev.department || user.department || "",
        program: prev.program || user.program || "",
        level: prev.level || user.level || "",
        status: prev.status === "Active Student" && user.status ? user.status : prev.status,
      }));
    }
  }, [user, existing]);

  // Reset institution when school type or sub-type shifts
  useEffect(() => {
    setForm((f) => ({ ...f, uniType: "", university: "" }));
  }, [form.schoolType]);

  useEffect(() => {
    setForm((f) => ({ ...f, university: "" }));
  }, [form.uniType]);

  const filteredSchools = useMemo(() => {
    if (!form.schoolType) return [];
    return schools.filter((s) => {
      if (s.type !== form.schoolType) return false;
      if (form.schoolType === "University") {
        return form.uniType ? s.uniType === form.uniType : true;
      }
      return true;
    });
  }, [schools, form.schoolType, form.uniType]);

  // Validate step 1 fields
  const validateStep1 = () => {
    const result = step1Schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      toast.error("Please fill all required personal fields");
      return false;
    }
    setErrors({});
    return true;
  };

  // Validate step 2 fields
  const validateStep2 = () => {
    const result = step2Schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      toast.error("Please fill all required academic fields");
      return false;
    }
    setErrors({});
    return true;
  };

  // Validate step 3 fields
  const validateStep3 = () => {
    const result = step3Schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      toast.error("Please select a church and niche focus");
      return false;
    }
    setErrors({});
    return true;
  };

  const nextStep = () => {
    if (wizardStep === 1 && validateStep1()) {
      setWizardStep(2);
    } else if (wizardStep === 2 && validateStep2()) {
      setWizardStep(3);
    }
  };

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const goPreview = () => {
    if (validateStep3()) {
      setStep("preview");
    }
  };

  const submit = async () => {
    const record: Partial<Student> = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      gender: form.gender,
      dob: form.dob,
      university: form.university,
      faculty: form.faculty,
      department: form.department,
      program: form.program,
      level: form.level,
      indexNumber: form.indexNumber,
      address: form.address,
      nationality: form.nationality,
      status: form.status,
      church: form.church,
      niche: form.niche,
      schoolType: form.schoolType,
      uniType: form.uniType || undefined,
    };

    try {
      const savedStudent = await submitStudentForm(record);
      setExisting(savedStudent);

      updateUser({
        name: form.fullName,
        phone: form.phone,
        gender: form.gender,
        nationality: form.nationality,
        church: form.church,
        niche: form.niche,
        schoolType: form.schoolType,
        uniType: form.uniType || undefined,
        university: form.university,
        faculty: form.faculty,
        department: form.department,
        program: form.program,
        level: form.level,
        status: form.status,
      });

      toast.success(
        existing ? "Information updated successfully" : "Information submitted successfully",
      );
      setStep("done");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit form");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;
      setUploadedFile({ name: file.name, size: sizeStr });
      toast.success("Document attached successfully");
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.preventDefault();
    setUploadedFile(null);
  };

  const Field = ({
    label,
    error,
    id,
    children,
  }: {
    label: string;
    error?: string;
    id?: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-[10px] text-destructive font-medium mt-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );

  // Animation variants
  const slideVariants = {
    initial: { opacity: 0, x: 15 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: -15, transition: { duration: 0.15 } },
  };

  // Wizard Stepper Config
  const stepsList = [
    { num: 1, label: "Personal", icon: User },
    { num: 2, label: "Academic", icon: GraduationCap },
    { num: 3, label: "Network", icon: Sparkles },
    { num: 4, label: "Review", icon: FileText },
  ];

  const renderStepper = (activeStep: number) => (
    <div className="w-full py-4 mb-6 select-none">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {stepsList.map((s, idx) => {
          const Icon = s.icon;
          const isCompleted = activeStep > s.num;
          const isActive = activeStep === s.num;

          return (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <div
                  className={`h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-ghana-green border-ghana-green text-white"
                      : isActive
                        ? "border-primary text-primary bg-primary/5 shadow-soft ring-4 ring-primary/10"
                        : "border-muted text-muted-foreground bg-card"
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4.5 w-4.5" />}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 hidden sm:block ${isActive ? "text-primary" : "text-muted-foreground"}`}
                >
                  {s.label}
                </span>
              </div>

              {idx < stepsList.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-muted relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-primary transition-all duration-300 ${
                      isCompleted ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (step === "done") {
    return (
      <div className="max-w-xl mx-auto py-10 font-sans">
        <Card className="border-0 shadow-elegant overflow-hidden">
          <div className="h-1.5 flag-stripe" />
          <CardContent className="p-8 text-center space-y-6">
            <div
              className="h-16 w-16 rounded-full bg-primary/10 grid place-items-center mx-auto mb-2 animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-secondary dark:text-foreground font-display">
                Submission Received!
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
                Your student profiles have been verified successfully. You can update or verify your
                academic record at any point.
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep("preview")}
                className="px-4 font-semibold text-xs h-9"
              >
                <Eye className="h-4 w-4" /> View Info
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setStep("form");
                  setWizardStep(1);
                }}
                className="px-4 font-semibold text-xs h-9"
              >
                <Pencil className="h-4 w-4" /> Edit Record
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div className="max-w-2xl mx-auto space-y-6 font-sans">
        <div>
          {renderStepper(4)}
          <h1 className="text-2xl font-extrabold tracking-tight text-secondary dark:text-foreground font-display">
            Verify & Confirm
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Check your details before submitting to the university registrar.
          </p>
        </div>

        <Card className="border shadow-soft">
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs">
            {[
              ["Full name", form.fullName],
              ["Email address", form.email],
              ["Phone number", form.phone],
              ["Gender", form.gender],
              ["Date of birth", form.dob],
              ["Nationality", form.nationality],
              ["Church Affiliation", form.church],
              ["Focus Niche", form.niche],
              ["School type", form.schoolType],
              ...(form.uniType ? [["Sub-type", form.uniType] as const] : []),
              ["Institution", form.university],
              ["Faculty", form.faculty],
              ["Department", form.department],
              ["Program", form.program],
              ["Level", form.level],
              ["Status", form.status],
              ["Index number", form.indexNumber],
              ["Contact address", form.address],
            ].map(([k, v]) => (
              <div key={k} className="space-y-0.5">
                <div className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                  {k}
                </div>
                <div className="font-semibold text-secondary dark:text-foreground truncate">
                  {v || "—"}
                </div>
              </div>
            ))}

            {uploadedFile && (
              <div className="sm:col-span-2 border-t pt-4 mt-2">
                <div className="text-muted-foreground font-bold uppercase tracking-wider text-[9px] mb-1.5">
                  Attached Document
                </div>
                <div className="flex items-center gap-2 text-xs bg-muted/40 p-2.5 rounded-xl border max-w-sm">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-secondary truncate">{uploadedFile.name}</div>
                    <div className="text-[10px] text-muted-foreground">{uploadedFile.size}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setStep("form");
              setWizardStep(3);
            }}
            className="font-semibold text-xs h-9"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Form
          </Button>
          <Button onClick={submit} className="font-semibold text-xs h-9 px-5">
            Submit Verification <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <div>
        {renderStepper(wizardStep)}
        <h1 className="text-2xl font-extrabold tracking-tight text-secondary dark:text-foreground font-display">
          {wizardStep === 1 && "Personal Information"}
          {wizardStep === 2 && "Academic Credentials"}
          {wizardStep === 3 && "Affiliations & Documents"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {wizardStep === 1 && "Start by adding your basic contact details."}
          {wizardStep === 2 && "Configure institution and programme registry details."}
          {wizardStep === 3 && "Submit community tags and support verification documents."}
        </p>
      </div>

      <Card className="border shadow-soft">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {wizardStep === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full name" error={errors.fullName} id="fullName">
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="h-9"
                    />
                  </Field>
                  <Field label="Email" error={errors.email} id="email">
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      disabled
                      className="h-9 bg-muted/50 cursor-not-allowed opacity-80"
                    />
                  </Field>
                  <Field label="Phone number" error={errors.phone} id="phone">
                    <PhoneInput
                      id="phone"
                      value={form.phone}
                      onChange={(v) => setForm({ ...form, phone: v })}
                    />
                  </Field>
                  <Field label="Date of birth" error={errors.dob} id="dob">
                    <Input
                      id="dob"
                      type="date"
                      value={form.dob}
                      onChange={(e) => setForm({ ...form, dob: e.target.value })}
                      className="h-9"
                    />
                  </Field>
                  <Field label="Nationality" error={errors.nationality} id="nationality">
                    <Input
                      id="nationality"
                      value={form.nationality}
                      onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                      className="h-9"
                    />
                  </Field>
                  <Field label="Gender" error={errors.gender}>
                    <RadioGroup
                      value={form.gender}
                      onValueChange={(v) =>
                        setForm({ ...form, gender: v as "male" | "female" | "other" })
                      }
                      className="flex gap-4 mt-2"
                    >
                      {(["male", "female", "other"] as const).map((g) => (
                        <label
                          key={g}
                          className="flex items-center gap-2 cursor-pointer text-xs font-semibold"
                        >
                          <RadioGroupItem value={g} className="h-4 w-4" />
                          <span className="capitalize">{g}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </Field>
                </div>
              </motion.div>
            )}

            {wizardStep === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="School Type" error={errors.schoolType}>
                    <Select
                      value={form.schoolType}
                      onValueChange={(v) => setForm({ ...form, schoolType: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="University">University</SelectItem>
                        <SelectItem value="Nursing & Midwifery">Nursing & Midwifery</SelectItem>
                        <SelectItem value="College of Education">College of Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  {form.schoolType === "University" && (
                    <Field label="University Sub-type" error={errors.uniType}>
                      <Select
                        value={form.uniType}
                        onValueChange={(v) => setForm({ ...form, uniType: v })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Public">Public Universities</SelectItem>
                          <SelectItem value="Technical">Technical Universities</SelectItem>
                          <SelectItem value="Private">Private Universities</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}

                  <div className="sm:col-span-2">
                    <Field label="Institution Name" error={errors.university}>
                      <Select
                        value={form.university}
                        onValueChange={(v) => setForm({ ...form, university: v })}
                        disabled={
                          !form.schoolType || (form.schoolType === "University" && !form.uniType)
                        }
                      >
                        <SelectTrigger className="text-left whitespace-normal h-auto py-2">
                          <SelectValue
                            placeholder={
                              !form.schoolType ? "Select school type first" : "Select institution"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {filteredSchools.map((s) => (
                            <SelectItem key={s.name} value={s.name}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <Field label="Faculty" error={errors.faculty}>
                    <Select
                      value={form.faculty}
                      onValueChange={(v) => setForm({ ...form, faculty: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {FACULTIES.map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Department" error={errors.department}>
                    <Select
                      value={form.department}
                      onValueChange={(v) => setForm({ ...form, department: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Programme" error={errors.program}>
                    <Select
                      value={form.program}
                      onValueChange={(v) => setForm({ ...form, program: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select programme" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROGRAMMES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Current Level" error={errors.level}>
                    <Select
                      value={form.level}
                      onValueChange={(v) => setForm({ ...form, level: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEVELS.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l === "Alumni" || l === "Graduate" || l === "Completed"
                              ? l
                              : `Level ${l}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Enrollment Status" error={errors.status}>
                    <Select
                      value={form.status}
                      onValueChange={(v) => setForm({ ...form, status: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active Student">Active Student</SelectItem>
                        <SelectItem value="Alumni">Alumni</SelectItem>
                        <SelectItem value="Completed">Completed Study</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Index / Student Number" error={errors.indexNumber} id="indexNum">
                    <Input
                      id="indexNum"
                      value={form.indexNumber}
                      onChange={(e) => setForm({ ...form, indexNumber: e.target.value })}
                      className="h-9"
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Contact Address" error={errors.address} id="address">
                      <Input
                        id="address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="h-9"
                      />
                    </Field>
                  </div>
                </div>
              </motion.div>
            )}

            {wizardStep === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Church Affiliation" error={errors.church}>
                    <Select
                      value={form.church}
                      onValueChange={(v) => setForm({ ...form, church: v })}
                    >
                      <SelectTrigger className="h-9">
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
                  </Field>

                  <Field label="Focus Niche / Category" error={errors.niche}>
                    <Select
                      value={form.niche}
                      onValueChange={(v) => setForm({ ...form, niche: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select niche" />
                      </SelectTrigger>
                      <SelectContent>
                        {NICHES.map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                {/* Optional Document Upload Zone */}
                <div className="space-y-2 pt-2">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    Supporting Documents{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      (Optional)
                    </span>
                  </Label>

                  {!uploadedFile ? (
                    <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/10 transition-smooth">
                      <Upload className="h-7 w-7 mx-auto text-muted-foreground mb-1.5" />
                      <div className="text-xs font-semibold text-secondary">
                        Click to upload document verification
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        PDF, JPG, PNG up to 5MB
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between border bg-muted/20 p-3 rounded-xl max-w-md shadow-sm">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="h-5 w-5 text-primary shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-secondary truncate">
                            {uploadedFile.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {uploadedFile.size}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearFile}
                        className="h-8 w-8 hover:text-destructive hover:bg-destructive/5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stepper Wizard Actions */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={wizardStep === 1}
              className="font-bold text-xs h-9 hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            {wizardStep < 3 ? (
              <Button onClick={nextStep} className="font-semibold text-xs h-9 px-5">
                Next Step <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={goPreview} className="font-semibold text-xs h-9 px-5">
                Preview Details <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
