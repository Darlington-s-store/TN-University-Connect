import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { CheckCircle2, Eye, Pencil, Upload, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { UNIVERSITIES, DEPARTMENTS, getStudents, saveStudents, Student } from "@/lib/data";

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(20),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().min(1, "Date of birth required"),
  university: z.string().min(1, "University required"),
  department: z.string().min(1, "Department required"),
  program: z.string().min(2),
  level: z.string().min(1),
  indexNumber: z.string().min(3),
  address: z.string().min(2),
});

export default function StudentForm() {
  const { user } = useAuth();
  const existing = useMemo(() => getStudents().find((s) => s.email === user?.email), [user?.email]);

  const [step, setStep] = useState<"form" | "preview" | "done">(existing ? "done" : "form");
  const [form, setForm] = useState<Omit<Student, "id" | "submittedAt">>({
    fullName: existing?.fullName || user?.name || "",
    email: existing?.email || user?.email || "",
    phone: existing?.phone || user?.phone || "",
    gender: existing?.gender || "male",
    dob: existing?.dob || "",
    university: existing?.university || user?.university || "",
    department: existing?.department || user?.department || "",
    program: existing?.program || "",
    level: existing?.level || "",
    indexNumber: existing?.indexNumber || "",
    address: existing?.address || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const submit = () => {
    const all = getStudents();
    const idx = all.findIndex((s) => s.email === form.email);
    const record: Student = {
      ...form,
      id: existing?.id || `s-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    if (idx >= 0) all[idx] = record; else all.unshift(record);
    saveStudents(all);
    toast.success(existing ? "Information updated" : "Information submitted");
    setStep("done");
  };

  if (step === "done") {
    return (
      <div className="max-w-3xl">
        <div className="mb-6"><Badge variant="outline" className="border-primary text-primary">Student Information</Badge></div>
        <Card className="border-0 shadow-elegant">
          <div className="h-1 flag-stripe" />
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 grid place-items-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-secondary mb-2">Submission received</h2>
            <p className="text-muted-foreground">Your student details are on file. You can edit them anytime.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="outline" onClick={() => setStep("preview")}><Eye className="h-4 w-4" /> View</Button>
              <Button onClick={() => setStep("form")}><Pencil className="h-4 w-4" /> Edit</Button>
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
          <Badge variant="outline" className="border-primary text-primary mb-2">Step 2 of 2</Badge>
          <h1 className="text-3xl font-bold text-secondary">Review your information</h1>
          <p className="text-muted-foreground">Check everything is correct before submitting.</p>
        </div>
        <Card>
          <CardContent className="p-6 grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {[
              ["Full name", form.fullName],
              ["Email", form.email],
              ["Phone", form.phone],
              ["Gender", form.gender],
              ["Date of birth", form.dob],
              ["University", form.university],
              ["Department", form.department],
              ["Program", form.program],
              ["Level", form.level],
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
          <Button variant="outline" onClick={() => setStep("form")}><ArrowLeft className="h-4 w-4" /> Edit</Button>
          <Button onClick={submit}>Confirm & Submit <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Badge variant="outline" className="border-primary text-primary mb-2">Step 1 of 2</Badge>
        <h1 className="text-3xl font-bold text-secondary">Student Information Form</h1>
        <p className="text-muted-foreground">Fill in your academic and contact details. You can preview before submitting.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-8">
          <section>
            <h3 className="font-bold text-secondary mb-4">Personal details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" error={errors.fullName}><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
              <Field label="Email" error={errors.email}><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="Phone" error={errors.phone}><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
              <Field label="Date of birth" error={errors.dob}><Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} /></Field>
              <div className="sm:col-span-2">
                <Label>Gender</Label>
                <RadioGroup value={form.gender} onValueChange={(v: any) => setForm({ ...form, gender: v })} className="flex gap-6 mt-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value={g} /> <span className="capitalize">{g}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-secondary mb-4">Academic details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="University" error={errors.university}>
                <Select value={form.university} onValueChange={(v) => setForm({ ...form, university: v })}>
                  <SelectTrigger><SelectValue placeholder="Select university" /></SelectTrigger>
                  <SelectContent>{UNIVERSITIES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Department" error={errors.department}>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Program / Degree" error={errors.program}><Input value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} placeholder="e.g. BSc Computer Science" /></Field>
              <Field label="Level" error={errors.level}>
                <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>{["100", "200", "300", "400", "500", "600"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Index / Student number" error={errors.indexNumber}><Input value={form.indexNumber} onChange={(e) => setForm({ ...form, indexNumber: e.target.value })} /></Field>
              <Field label="Contact address" error={errors.address}><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-secondary mb-4">Documents <span className="text-xs font-normal text-muted-foreground">(optional)</span></h3>
            <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-smooth">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <div className="text-sm font-medium text-secondary">Click to upload supporting documents</div>
              <div className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG · Max 5MB</div>
              <input type="file" className="hidden" />
            </label>
          </section>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={goPreview}>Preview <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
