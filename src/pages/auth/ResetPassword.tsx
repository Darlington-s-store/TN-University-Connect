import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, AlertCircle } from "lucide-react";
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
      <div className="bg-card border border-border/80 shadow-elegant rounded-3xl overflow-hidden backdrop-blur-md relative">
        <div className="h-1.5 flag-stripe" />
        <div className="p-6 sm:p-8">
          {!email ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-4">
                No active password reset request found. Please request a verification code first.
              </p>
              <Button asChild className="w-full h-10 font-semibold text-xs shadow-sm">
                <Link to="/forgot-password">Request Reset Code</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email-display" className="text-xs font-semibold">
                  Resetting password for
                </Label>
                <Input
                  id="email-display"
                  type="text"
                  value={email}
                  disabled
                  className="bg-slate-50/50 h-9.5 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="code" className="text-xs font-semibold">
                  6-Digit Verification Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  required
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  disabled={loading}
                  className="text-center tracking-widest font-bold text-lg h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pw" className="text-xs font-semibold">
                  New password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pw"
                    type="password"
                    required
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    disabled={loading}
                    className="pl-9 h-9.5 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-xs font-semibold">
                  Confirm new password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm"
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={loading}
                    className="pl-9 h-9.5 text-sm"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-10 font-semibold text-xs mt-2 shadow-sm"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </AuthShell>
  );
}
