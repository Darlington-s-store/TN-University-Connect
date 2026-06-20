import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we'll send you a password reset code."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to login
          </Link>
        </>
      }
    >
      <div className="bg-card border border-border/80 shadow-elegant rounded-3xl overflow-hidden backdrop-blur-md relative">
        <div className="h-1.5 flag-stripe" />
        <div className="p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 grid place-items-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <p className="text-secondary font-bold font-display text-base">Check your inbox</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                We've sent a 6-digit reset code to <strong>{email}</strong>.
              </p>
              <Button asChild className="mt-6 w-full h-10 font-semibold text-xs shadow-sm">
                <Link to="/reset-password">Go to Reset Password</Link>
              </Button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email) return toast.error("Enter your email");
                setLoading(true);
                try {
                  await forgotPassword(email.trim());
                  localStorage.setItem("tnu_reset_email", email.trim());
                  setSent(true);
                  toast.success("Reset code sent");
                } catch (err: unknown) {
                  const error = err as Error;
                  toast.error(error.message || "Failed to send reset code");
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu.gh"
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
                {loading ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </AuthShell>
  );
}
