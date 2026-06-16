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
      {sent ? (
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-primary/10 grid place-items-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <p className="text-secondary font-medium">Check your inbox</p>
          <p className="text-sm text-muted-foreground mt-2">
            We've sent a 6-digit reset code to <strong>{email}</strong>.
          </p>
          <Button asChild className="mt-6">
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
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send reset code"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
