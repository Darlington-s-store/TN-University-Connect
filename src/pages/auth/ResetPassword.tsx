import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("tnu_reset_email") || "";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please request a password reset first.");
      navigate("/forgot-password");
      return;
    }
    if (!code.trim() || code.length < 6)
      return toast.error("Enter a valid 6-digit verification code");
    if (pw.length < 8) return toast.error("Password must be at least 8 characters");
    if (pw !== confirm) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await resetPassword(email, code.trim(), pw);
      localStorage.removeItem("tnu_reset_email");
      toast.success("Password reset successfully. You can now sign in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="Choose a new password for your account."
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          Back to login
        </Link>
      }
    >
      {!email ? (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-4">
            No active password reset request found. Please request a verification code first.
          </p>
          <Button asChild>
            <Link to="/forgot-password">Request Reset Code</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email-display">Resetting password for</Label>
            <Input id="email-display" type="text" value={email} disabled className="bg-slate-50" />
          </div>
          <div>
            <Label htmlFor="code">6-Digit Verification Code</Label>
            <Input
              id="code"
              type="text"
              required
              placeholder="123456"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              disabled={loading}
              className="text-center tracking-widest font-bold text-lg"
            />
          </div>
          <div>
            <Label htmlFor="pw">New password</Label>
            <Input
              id="pw"
              type="password"
              required
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
