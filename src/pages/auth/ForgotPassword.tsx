import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={<>Remembered it? <Link to="/login" className="text-primary font-medium hover:underline">Back to login</Link></>}
    >
      {sent ? (
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-primary/10 grid place-items-center mx-auto mb-4"><Mail className="h-8 w-8 text-primary" /></div>
          <p className="text-secondary font-medium">Check your inbox</p>
          <p className="text-sm text-muted-foreground mt-2">We've sent reset instructions to <strong>{email}</strong>.</p>
          <Button asChild variant="outline" className="mt-6"><Link to="/reset-password">Open reset page (demo)</Link></Button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (!email) return toast.error("Enter your email"); setSent(true); toast.success("Reset link sent"); }} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <Button type="submit" size="lg" className="w-full">Send reset link</Button>
        </form>
      )}
    </AuthShell>
  );
}
