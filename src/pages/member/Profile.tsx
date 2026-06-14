import { useState } from "react";
import { toast } from "sonner";
import { Camera, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { UNIVERSITIES, DEPARTMENTS } from "@/lib/data";

export default function MemberProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    university: user?.university || "",
    department: user?.department || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(form);
    toast.success("Profile updated");
  };

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, avatar: reader.result as string });
    reader.readAsDataURL(file);
  };

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next.length < 8) return toast.error("Password must be at least 8 characters");
    if (pw.next !== pw.confirm) return toast.error("Passwords do not match");
    toast.success("Password changed successfully");
    setPw({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-secondary">My Profile</h1>
        <p className="text-muted-foreground">Update your personal details and account settings.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full sm:w-auto overflow-x-auto no-scrollbar">
          <TabsTrigger value="profile" className="flex-1 sm:flex-none">
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 sm:flex-none">
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={saveProfile} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                  <div className="relative shrink-0">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                      <AvatarImage src={form.avatar} />
                      <AvatarFallback className="text-xl sm:text-2xl bg-primary text-primary-foreground">
                        {form.name
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute -bottom-1 -right-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary text-primary-foreground grid place-items-center cursor-pointer shadow-elegant hover:scale-110 transition-smooth">
                      <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                      <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
                    </label>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-secondary truncate">{form.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{form.email}</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Full name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={form.email} disabled />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+233 ..."
                    />
                  </div>
                  <div>
                    <Label>University</Label>
                    <Select
                      value={form.university}
                      onValueChange={(v) => setForm({ ...form, university: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select university" />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIVERSITIES.map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Department</Label>
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
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Bio</Label>
                    <Textarea
                      rows={4}
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Tell the community a bit about yourself..."
                    />
                  </div>
                </div>

                <Button type="submit">Save changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-secondary flex items-center gap-2 mb-4">
                <Lock className="h-4 w-4" /> Change password
              </h3>
              <form onSubmit={changePassword} className="space-y-4 max-w-md">
                <div>
                  <Label>Current password</Label>
                  <Input
                    type="password"
                    value={pw.current}
                    onChange={(e) => setPw({ ...pw, current: e.target.value })}
                  />
                </div>
                <div>
                  <Label>New password</Label>
                  <Input
                    type="password"
                    value={pw.next}
                    onChange={(e) => setPw({ ...pw, next: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Confirm new password</Label>
                  <Input
                    type="password"
                    value={pw.confirm}
                    onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                  />
                </div>
                <Button type="submit">Update password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
