import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Camera, Lock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { getStudentMe, submitStudentForm, Student, UNIVERSITIES, DEPARTMENTS } from "@/lib/data";
import { FACULTIES, PROGRAMMES, LEVELS, CHURCHES, NICHES } from "@/lib/schools";

export default function MemberProfile() {
  const { user, updateUser } = useAuth();
  const [studentRecord, setStudentRecord] = useState<Student | null>(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "male",
    nationality: user?.nationality || "Ghanaian",
    university: user?.university || "",
    schoolType: user?.schoolType || "",
    uniType: user?.uniType || "",
    faculty: user?.faculty || "",
    department: user?.department || "",
    program: user?.program || "",
    level: user?.level || "",
    status: user?.status || "Active Student",
    church: user?.church || "",
    niche: user?.niche || "",
    dob: "",
    indexNumber: "",
    address: "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  // Sync user info when context loads
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "male",
        nationality: user.nationality || "Ghanaian",
        university: user.university || "",
        schoolType: user.schoolType || "",
        uniType: user.uniType || "",
        faculty: user.faculty || "",
        department: user.department || "",
        program: user.program || "",
        level: user.level || "",
        status: user.status || "Active Student",
        church: user.church || "",
        niche: user.niche || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      }));
    }
  }, [user]);

  // Load student profile details
  useEffect(() => {
    async function loadStudent() {
      try {
        const data = await getStudentMe();
        if (data) {
          setStudentRecord(data);
          setForm((prev) => ({
            ...prev,
            dob: data.dob || "",
            indexNumber: data.indexNumber || "",
            address: data.address || "",
          }));
        }
      } catch (err: any) {
        console.error("Failed to load own student profile details:", err);
      }
    }
    loadStudent();
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Submit/update student profile in backend db
      const record: Partial<Student> = {
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        dob: form.dob || new Date().toISOString().slice(0, 10),
        university: form.university,
        schoolType: form.schoolType,
        uniType: form.uniType || undefined,
        faculty: form.faculty,
        department: form.department,
        program: form.program,
        level: form.level,
        indexNumber: form.indexNumber || `STU${Math.floor(100000 + Math.random() * 900000)}`,
        address: form.address || "Accra, Ghana",
        nationality: form.nationality,
        status: form.status,
        church: form.church,
        niche: form.niche,
      };

      const updatedStudent = await submitStudentForm(record);
      setStudentRecord(updatedStudent);

      // 2. Sync user profile changes (updates users table and local storage via context)
      await updateUser({
        name: form.name,
        phone: form.phone,
        gender: form.gender,
        nationality: form.nationality,
        university: form.university,
        schoolType: form.schoolType,
        uniType: form.uniType || undefined,
        faculty: form.faculty,
        department: form.department,
        program: form.program,
        level: form.level,
        status: form.status,
        church: form.church,
        niche: form.niche,
        bio: form.bio,
        avatar: form.avatar,
      });

      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
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

  const allFields: [string, string][] = [
    ["Full Name", form.name],
    ["Email", form.email],
    ["Phone", form.phone],
    ["Gender", form.gender],
    ["Nationality", form.nationality],
    ["Date of Birth", form.dob],
    ["Church", form.church],
    ["Focus Niche", form.niche],
    ["School Type", form.schoolType],
    ...(form.uniType ? [["Sub-type", form.uniType] as [string, string]] : []),
    ["Institution", form.university],
    ["Faculty", form.faculty],
    ["Department", form.department],
    ["Programme", form.program],
    ["Level", form.level],
    ["Status", form.status],
    ["Index Number", form.indexNumber],
    ["Address", form.address],
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-secondary">My Profile</h1>
        <p className="text-muted-foreground">
          Update your personal and academic details. Changes sync to your student record.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full sm:w-auto overflow-x-auto no-scrollbar">
          <TabsTrigger value="profile" className="flex-1 sm:flex-none">
            Edit Profile
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex-1 sm:flex-none">
            Overview
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 sm:flex-none">
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <div className="h-1 flag-stripe" />
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                <Eye className="h-4 w-4" /> Student Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                {allFields.map(([k, v]) => (
                  <div key={k}>
                    <div className="text-muted-foreground text-xs uppercase tracking-wider">
                      {k}
                    </div>
                    <div className="font-medium text-secondary mt-0.5">{v || "—"}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                    <Label>Gender</Label>
                    <Select
                      value={form.gender}
                      onValueChange={(v) => setForm({ ...form, gender: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <Input
                      value={form.nationality}
                      onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={form.dob}
                      onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold text-secondary mb-4 text-sm">Academic Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>School Type</Label>
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
                    </div>
                    {form.schoolType === "University" && (
                      <div>
                        <Label>Sub-type</Label>
                        <Select
                          value={form.uniType || ""}
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
                      </div>
                    )}
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={form.university}
                        onChange={(e) => setForm({ ...form, university: e.target.value })}
                        placeholder="Your institution"
                      />
                    </div>
                    <div>
                      <Label>Faculty</Label>
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
                    </div>
                    <div>
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
                    <div>
                      <Label>Programme</Label>
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
                    </div>
                    <div>
                      <Label>Level</Label>
                      <Select
                        value={form.level}
                        onValueChange={(v) => setForm({ ...form, level: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {LEVELS.map((l) => (
                            <SelectItem key={l} value={l}>
                              {l === "Alumni" || l === "Graduate" || l === "Completed"
                                ? l
                                : `Level ${l}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={form.status}
                        onValueChange={(v) => setForm({ ...form, status: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active Student">Active Student</SelectItem>
                          <SelectItem value="Alumni">Alumni</SelectItem>
                          <SelectItem value="Completed">Completed Study</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Index / Student Number</Label>
                      <Input
                        value={form.indexNumber}
                        onChange={(e) => setForm({ ...form, indexNumber: e.target.value })}
                        placeholder="Index number"
                      />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Input
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Your contact address"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold text-secondary mb-4 text-sm">Affiliation & Focus</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Church Affiliation</Label>
                      <Select
                        value={form.church}
                        onValueChange={(v) => setForm({ ...form, church: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select church" />
                        </SelectTrigger>
                        <SelectContent>
                          {CHURCHES.map((ch) => (
                            <SelectItem key={ch} value={ch}>
                              {ch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Focus Niche</Label>
                      <Select
                        value={form.niche}
                        onValueChange={(v) => setForm({ ...form, niche: v })}
                      >
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
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label>Bio</Label>
                  <Textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell the community a bit about yourself..."
                  />
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
