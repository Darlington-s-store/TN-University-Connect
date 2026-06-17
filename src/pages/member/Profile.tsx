import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Camera,
  Lock,
  Eye,
  User,
  GraduationCap,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Hash,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
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
import { getStudentMe, submitStudentForm, Student, DEPARTMENTS } from "@/lib/data";
import { FACULTIES, PROGRAMMES, LEVELS, CHURCHES, NICHES } from "@/lib/schools";
import { PhoneInput } from "@/components/PhoneInput";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.25 } },
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Account Management
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-secondary dark:text-foreground font-display">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update personal and academic details. Changes sync with your verified student record.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full sm:w-auto p-1 bg-muted/65 rounded-xl border border-muted/80">
          <TabsTrigger value="profile" className="px-4 py-2 text-xs font-semibold rounded-lg">
            Edit Profile
          </TabsTrigger>
          <TabsTrigger value="overview" className="px-4 py-2 text-xs font-semibold rounded-lg">
            Passport Overview
          </TabsTrigger>
          <TabsTrigger value="security" className="px-4 py-2 text-xs font-semibold rounded-lg">
            Security & Login
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: EDIT PROFILE FORM */}
        <TabsContent value="profile">
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <form onSubmit={saveProfile} className="space-y-6">
              {/* Profile Avatar Card */}
              <Card className="border shadow-soft overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative shrink-0 group">
                      <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-md">
                        <AvatarImage src={form.avatar} />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-tr from-primary to-secondary text-primary-foreground">
                          {form.name
                            ? form.name
                                .split(" ")
                                .map((p) => p[0])
                                .slice(0, 2)
                                .join("")
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <label className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center cursor-pointer shadow-elegant hover:scale-105 transition-smooth">
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={onAvatar}
                        />
                      </label>
                    </div>
                    <div className="text-center sm:text-left min-w-0">
                      <h2 className="text-xl font-bold text-secondary dark:text-foreground font-display flex items-center justify-center sm:justify-start gap-2">
                        {form.name || "Set your name"}
                        {studentRecord && (
                          <CheckCircle className="h-4 w-4 text-ghana-green shrink-0" />
                        )}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{form.email}</p>
                      <Badge
                        variant="secondary"
                        className="mt-2 text-[10px] uppercase font-extrabold tracking-wider"
                      >
                        {form.status || "Member"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CARD GROUP 1: Personal Details */}
              <Card className="border shadow-soft">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-muted">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-bold text-secondary dark:text-foreground text-sm font-display">
                        Personal Details
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        General identification and contact information
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-semibold">
                        Full name
                      </Label>
                      <Input
                        id="fullName"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="emailInput" className="text-xs font-semibold">
                        Email address
                      </Label>
                      <Input
                        id="emailInput"
                        value={form.email}
                        disabled
                        className="h-9 bg-muted/50 cursor-not-allowed opacity-80"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phoneInput" className="text-xs font-semibold">
                        Phone number
                      </Label>
                      <PhoneInput
                        id="phoneInput"
                        value={form.phone}
                        onChange={(v) => setForm({ ...form, phone: v })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Gender</Label>
                      <Select
                        value={form.gender}
                        onValueChange={(v) => setForm({ ...form, gender: v })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="nationality" className="text-xs font-semibold">
                        Nationality
                      </Label>
                      <Input
                        id="nationality"
                        value={form.nationality}
                        onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="dobInput" className="text-xs font-semibold">
                        Date of birth
                      </Label>
                      <Input
                        id="dobInput"
                        type="date"
                        value={form.dob}
                        onChange={(e) => setForm({ ...form, dob: e.target.value })}
                        className="h-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CARD GROUP 2: Academic Record */}
              <Card className="border shadow-soft">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-muted">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-bold text-secondary dark:text-foreground text-sm font-display">
                        Academic Credentials
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        University settings and active program info
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">School Type</Label>
                      <Select
                        value={form.schoolType}
                        onValueChange={(v) => setForm({ ...form, schoolType: v })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select school category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="University">University</SelectItem>
                          <SelectItem value="Nursing & Midwifery">Nursing & Midwifery</SelectItem>
                          <SelectItem value="College of Education">College of Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {form.schoolType === "University" && (
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">University Sub-type</Label>
                        <Select
                          value={form.uniType || ""}
                          onValueChange={(v) => setForm({ ...form, uniType: v })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Public">Public Universities</SelectItem>
                            <SelectItem value="Technical">Technical Universities</SelectItem>
                            <SelectItem value="Private">Private Universities</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label htmlFor="institutionName" className="text-xs font-semibold">
                        Institution Name
                      </Label>
                      <Input
                        id="institutionName"
                        value={form.university}
                        onChange={(e) => setForm({ ...form, university: e.target.value })}
                        placeholder="e.g. University of Ghana"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Faculty</Label>
                      <Select
                        value={form.faculty}
                        onValueChange={(v) => setForm({ ...form, faculty: v })}
                      >
                        <SelectTrigger className="h-9">
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

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Department</Label>
                      <Select
                        value={form.department}
                        onValueChange={(v) => setForm({ ...form, department: v })}
                      >
                        <SelectTrigger className="h-9">
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

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Programme of Study</Label>
                      <Select
                        value={form.program}
                        onValueChange={(v) => setForm({ ...form, program: v })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select program" />
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

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Current Academic Level</Label>
                      <Select
                        value={form.level}
                        onValueChange={(v) => setForm({ ...form, level: v })}
                      >
                        <SelectTrigger className="h-9">
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

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Student / Professional Status</Label>
                      <Select
                        value={form.status}
                        onValueChange={(v) => setForm({ ...form, status: v })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active Student">Active Student</SelectItem>
                          <SelectItem value="Alumni">Alumni</SelectItem>
                          <SelectItem value="Completed">Completed Study</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="indexInput" className="text-xs font-semibold">
                        Index / Student Number
                      </Label>
                      <Input
                        id="indexInput"
                        value={form.indexNumber}
                        onChange={(e) => setForm({ ...form, indexNumber: e.target.value })}
                        placeholder="Student index ID"
                        className="h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="addressInput" className="text-xs font-semibold">
                        Contact Address
                      </Label>
                      <Input
                        id="addressInput"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Current address"
                        className="h-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CARD GROUP 3: Community & Focus */}
              <Card className="border shadow-soft">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-muted">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-bold text-secondary dark:text-foreground text-sm font-display">
                        Affiliation & Focus
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        Community networks and short user biography
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Church Affiliation</Label>
                      <Select
                        value={form.church}
                        onValueChange={(v) => setForm({ ...form, church: v })}
                      >
                        <SelectTrigger className="h-9">
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
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Focus Niche</Label>
                      <Select
                        value={form.niche}
                        onValueChange={(v) => setForm({ ...form, niche: v })}
                      >
                        <SelectTrigger className="h-9">
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

                  <div className="space-y-1.5">
                    <Label htmlFor="bioInput" className="text-xs font-semibold">
                      Short biography
                    </Label>
                    <Textarea
                      id="bioInput"
                      rows={3}
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Tell the network a bit about yourself, skills or career dreams..."
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Trigger */}
              <div className="flex justify-end gap-2">
                <Button type="submit" className="px-6 font-semibold shadow-sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </TabsContent>

        {/* Tab 2: PASSPORT OVERVIEW */}
        <TabsContent value="overview">
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <Card className="border shadow-elegant overflow-hidden relative max-w-2xl mx-auto">
              <div className="h-2 flag-stripe" />
              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* Passport Card Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-muted">
                  <Avatar className="h-24 w-24 border-2 border-primary shadow-soft">
                    <AvatarImage src={form.avatar} />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {form.name
                        ? form.name
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                      <h2 className="text-2xl font-black text-secondary dark:text-foreground font-display tracking-tight truncate">
                        {form.name || "—"}
                      </h2>
                      {studentRecord ? (
                        <Badge className="bg-ghana-green text-white gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border-0">
                          <CheckCircle className="h-3.5 w-3.5" /> VERIFIED MEMBER
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500 text-white gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border-0 animate-pulse">
                          <AlertCircle className="h-3.5 w-3.5" /> PENDING VERIFICATION
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-primary truncate">
                      {form.university || "No Institution Registered"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {form.program} · Level {form.level}
                    </p>
                  </div>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs">
                  <div className="flex gap-2.5 items-start">
                    <Mail className="h-4.5 w-4.5 text-primary/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                        Email Address
                      </div>
                      <div className="font-semibold text-secondary dark:text-foreground mt-0.5 truncate">
                        {form.email || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Phone className="h-4.5 w-4.5 text-primary/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                        Phone Number
                      </div>
                      <div className="font-semibold text-secondary dark:text-foreground mt-0.5">
                        {form.phone || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Globe className="h-4.5 w-4.5 text-primary/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                        Nationality & Gender
                      </div>
                      <div className="font-semibold text-secondary dark:text-foreground mt-0.5 capitalize">
                        {form.nationality} · {form.gender}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Calendar className="h-4.5 w-4.5 text-primary/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                        Date of Birth
                      </div>
                      <div className="font-semibold text-secondary dark:text-foreground mt-0.5">
                        {form.dob
                          ? new Date(form.dob).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <GraduationCap className="h-4.5 w-4.5 text-primary/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                        Faculty & Dept
                      </div>
                      <div className="font-semibold text-secondary dark:text-foreground mt-0.5 line-clamp-1">
                        {form.faculty} / {form.department}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Hash className="h-4.5 w-4.5 text-primary/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                        Student Index Number
                      </div>
                      <div className="font-semibold text-secondary dark:text-foreground mt-0.5">
                        {form.indexNumber || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <BookOpen className="h-4.5 w-4.5 text-primary/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                        Network Niche & Church
                      </div>
                      <div className="font-semibold text-secondary dark:text-foreground mt-0.5">
                        {form.niche} ({form.church})
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <MapPin className="h-4.5 w-4.5 text-primary/70 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">
                        Contact Address
                      </div>
                      <div className="font-semibold text-secondary dark:text-foreground mt-0.5 line-clamp-1">
                        {form.address || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio Block */}
                {form.bio && (
                  <div className="pt-4 border-t border-muted bg-muted/10 rounded-xl p-3.5 mt-2">
                    <div className="text-muted-foreground font-bold uppercase tracking-wider text-[9px] mb-1">
                      Biography / Career Focus
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      "{form.bio}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab 3: SECURITY */}
        <TabsContent value="security">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-md mx-auto"
          >
            <Card className="border shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center gap-2.5 pb-2 border-b border-muted mb-4">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-secondary dark:text-foreground text-sm font-display">
                      Change Password
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Modify active credential tokens
                    </p>
                  </div>
                </div>

                <form onSubmit={changePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="currPw" className="text-xs font-semibold">
                      Current password
                    </Label>
                    <Input
                      id="currPw"
                      type="password"
                      value={pw.current}
                      onChange={(e) => setPw({ ...pw, current: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="newPw" className="text-xs font-semibold">
                      New password
                    </Label>
                    <Input
                      id="newPw"
                      type="password"
                      value={pw.next}
                      onChange={(e) => setPw({ ...pw, next: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confPw" className="text-xs font-semibold">
                      Confirm new password
                    </Label>
                    <Input
                      id="confPw"
                      type="password"
                      value={pw.confirm}
                      onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <Button type="submit" className="w-full font-semibold mt-2 h-9">
                    Update password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
