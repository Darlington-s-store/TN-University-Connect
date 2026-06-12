import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { UserPlus, CheckCircle2 } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });

function strength(pw: string) {
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
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const s = useMemo(() => strength(form.password), [form.password]);
  const strengthLabel = ["Too weak", "Weak", "Fair", "Good", "Strong"][s];
  const strengthColor = ["bg-destructive", "bg-destructive", "bg-ghana-gold", "bg-primary", "bg-primary"][s];

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
      await register({ name: form.name, email: form.email, password: form.password });
      setDone(true);
      toast.success("Account created!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
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
          <Button asChild><Link to="/dashboard">Go to dashboard</Link></Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join the network of Ghanaian university students and alumni."
      footer={<>Already a member? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded ${i < s ? strengthColor : "bg-muted"}`} />
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{strengthLabel}</div>
            </div>
          )}
          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
        </div>
        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          {errors.confirm && <p className="text-xs text-destructive mt-1">{errors.confirm}</p>}
        </div>
        <Button type="submit" disabled={loading} size="lg" className="w-full">
          <UserPlus className="h-4 w-4" /> {loading ? "Creating..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
