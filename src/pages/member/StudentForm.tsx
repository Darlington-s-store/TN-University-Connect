import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { CheckCircle2, Eye, Pencil, Upload, ArrowRight, ArrowLeft } from "lucide-react";
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

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(20),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().min(1, "Date of birth required"),
  nationality: z.string().min(1, "Nationality required"),
  church: z.string().min(1, "Church required"),
  niche: z.string().min(1, "Niche required"),
  schoolType: z.string().min(1, "School type required"),
  uniType: z.string().optional(),
  university: z.string().min(1, "Institution required"),
  faculty: z.string().min(1, "Faculty required"),
  department: z.string().min(1, "Department required"),
  program: z.string().min(1, "Program required"),
  level: z.string().min(1, "Level required"),
  status: z.string().min(1, "Status required"),
  indexNumber: z.string().min(3, "Index number required"),
  address: z.string().min(2, "Address required"),
});

export default function StudentForm() {
  const { user, updateUser } = useAuth();
  const [existing, setExisting] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<GhanaSchool[]>([]);

  const [step, setStep] = useState<"form" | "preview" | "done">("form");
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
          setForm({
            fullName: student.fullName,
            email: student.email,
            phone: student.phone,
            gender: student.gender,
            dob: student.dob,
            nationality: student.nationality || "Ghanaian",
            church: student.church || "",
            niche: student.niche || "",
            schoolType: student.schoolType || "",
            uniType: student.uniType || "",
            university: student.university,
            faculty: student.faculty || "",
            department: student.department,
            program: student.program,
            level: student.level,
            status: student.status || "Active Student",
            indexNumber: student.indexNumber,
            address: student.address,
          });
          setStep("done");
        }
      } catch (err) {
        console.error("Failed to load student info:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
    setSchools(getGhanaSchools());
  }, []);

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

  const goPreview = () => {
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    setStep("preview");
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

      toast.success(existing ? "Information updated" : "Information submitted");
      setStep("done");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit form");
    }
  };

  const Field = ({
    label,
    error,
    children,
  }: {
    label: string;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );

  if (step === "done") {
    return (
      <div className="max-w-3xl">
        <div className="mb-6">
          <Badge variant="outline" className="border-primary text-primary">
            Student Information
          </Badge>
        </div>
        <Card className="border-0 shadow-elegant">
          <div className="h-1 flag-stripe" />
          <CardContent className="p-4 sm:p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 grid place-items-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-secondary mb-2">Submission received</h2>
            <p className="text-muted-foreground">
              Your student details are on file. You can edit them anytime.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="outline" onClick={() => setStep("preview")}>
                <Eye className="h-4 w-4" /> View
              </Button>
              <Button onClick={() => setStep("form")}>
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <Badge variant="outline" className="border-primary text-primary mb-2">
            Step 2 of 2
          </Badge>
          <h1 className="text-3xl font-bold text-secondary">Review your information</h1>
          <p className="text-muted-foreground">Check everything is correct before submitting.</p>
        </div>
        <Card>
          <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {[
              ["Full name", form.fullName],
              ["Email", form.email],
              ["Phone", form.phone],
              ["Gender", form.gender],
              ["Date of birth", form.dob],
              ["Nationality", form.nationality],
              ["Church", form.church],
              ["Niche", form.niche],
              ["School type", form.schoolType],
              ...(form.uniType ? [["Sub-type", form.uniType] as const] : []),
              ["Institution", form.university],
              ["Faculty", form.faculty],
              ["Department", form.department],
              ["Program", form.program],
              ["Level", form.level],
              ["Status", form.status],
              ["Index number", form.indexNumber],
              ["Address", form.address],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-muted-foreground text-xs uppercase tracking-wider">{k}</div>
                <div className="font-medium text-secondary mt-0.5">{v}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep("form")}>
            <ArrowLeft className="h-4 w-4" /> Edit
          </Button>
          <Button onClick={submit}>
            Confirm & Submit <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Badge variant="outline" className="border-primary text-primary mb-2">
          Step 1 of 2
        </Badge>
        <h1 className="text-3xl font-bold text-secondary">Student Information Form</h1>
        <p className="text-muted-foreground">
          Fill in your academic and contact details. You can preview before submitting.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6 space-y-8">
          {/* Personal details */}
          <section>
            <h3 className="font-bold text-secondary mb-4">Personal details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full name" error={errors.fullName}>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Field>
              <Field label="Date of birth" error={errors.dob}>
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                />
              </Field>
              <Field label="Nationality" error={errors.nationality}>
                <Input
                  value={form.nationality}
                  onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                />
              </Field>
              <Field label="Church Affiliation" error={errors.church}>
                <Select value={form.church} onValueChange={(v) => setForm({ ...form, church: v })}>
                  <SelectTrigger>
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
              <div className="sm:col-span-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={form.gender}
                  onValueChange={(v) =>
                    setForm({ ...form, gender: v as "male" | "female" | "other" })
                  }
                  className="flex flex-wrap gap-4 mt-2"
                >
                  {(["male", "female", "other"] as const).map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value={g} /> <span className="capitalize">{g}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </section>

          {/* Focus Niche */}
          <section>
            <h3 className="font-bold text-secondary mb-4">Focus & Affiliation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Focus Niche / Category" error={errors.niche}>
                <Select value={form.niche} onValueChange={(v) => setForm({ ...form, niche: v })}>
                  <SelectTrigger>
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
          </section>

          {/* Academic details */}
          <section>
            <h3 className="font-bold text-secondary mb-4">Academic details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="School Type" error={errors.schoolType}>
                <Select
                  value={form.schoolType}
                  onValueChange={(v) => setForm({ ...form, schoolType: v })}
                >
                  <SelectTrigger>
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
                    <SelectTrigger>
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
                    <SelectContent className="max-h-[300px]">
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l === "Alumni" || l === "Graduate" || l === "Completed" ? l : `Level ${l}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Student / Professional Status" error={errors.status}>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active Student">Active Student</SelectItem>
                    <SelectItem value="Alumni">Alumni</SelectItem>
                    <SelectItem value="Completed">Completed Study</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Index / Student number" error={errors.indexNumber}>
                <Input
                  value={form.indexNumber}
                  onChange={(e) => setForm({ ...form, indexNumber: e.target.value })}
                />
              </Field>

              <Field label="Contact address" error={errors.address}>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </Field>
            </div>
          </section>

          {/* Documents */}
          <section>
            <h3 className="font-bold text-secondary mb-4">
              Documents{" "}
              <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </h3>
            <label className="block border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-primary transition-smooth">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <div className="text-sm font-medium text-secondary">
                Click to upload supporting documents
              </div>
              <div className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG · Max 5MB</div>
              <input type="file" className="hidden" />
            </label>
          </section>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={goPreview}>
              Preview <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
