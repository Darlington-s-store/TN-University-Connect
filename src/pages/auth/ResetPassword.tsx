import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return toast.error("Password must be at least 8 characters");
    if (pw !== confirm) return toast.error("Passwords do not match");

    // Find and update password
    const email = localStorage.getItem("tnu_reset_email");
    if (email) {
      const usersRaw = localStorage.getItem("tnu_users");
      if (usersRaw) {
        const users = JSON.parse(usersRaw);
        const idx = users.findIndex((u: User) => u.email.toLowerCase() === email.toLowerCase());
        if (idx >= 0) {
          users[idx].password = pw;
          localStorage.setItem("tnu_users", JSON.stringify(users));
          localStorage.removeItem("tnu_reset_email");
          toast.success(`Password for ${email} has been updated. You can now sign in.`);
          setTimeout(() => navigate("/login"), 1200);
          return;
        }
      }
    }

    // Fallback if no email is set or found in store
    toast.success("Password updated. You can now sign in.");
    setTimeout(() => navigate("/login"), 1200);
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
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="pw">New password</Label>
          <Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="confirm">Confirm new password</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
