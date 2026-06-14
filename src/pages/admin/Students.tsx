import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Eye,
  ArrowUpDown,
  Pencil,
  Trash2,
  ShieldAlert,
  Plus,
  Save,
  Settings,
  Key,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  getGhanaSchools,
  saveCustomSchools,
  GHANA_SCHOOLS,
  GhanaSchool,
  SchoolType,
  UniType,
  NICHES,
  LEVELS,
  CHURCHES,
  FACULTIES,
  DEPARTMENTS,
  PROGRAMMES,
} from "@/lib/schools";
import { Student } from "@/lib/data";
import { User } from "@/lib/auth";

interface FullStudent {
  id: string; // student profile id
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  university: string;
  faculty?: string;
  department: string;
  program: string;
  level: string;
  indexNumber: string;
  address: string;
  submittedAt: string;
  nationality: string;
  status: string;
  church: string;
  niche: string;
  password?: string; // from tnu_users
  joinedAt?: string;
}

export default function AdminStudents() {
  const [students, setStudents] = useState<FullStudent[]>([]);
  const [schools, setSchools] = useState<GhanaSchool[]>([]);

  // Search & Filter State
  const [q, setQ] = useState("");
  const [uniFilter, setUniFilter] = useState("all");
  const [nicheFilter, setNicheFilter] = useState("all");
  const [sort, setSort] = useState<"date" | "name">("date");

  // Dialog States
  const [viewingStudent, setViewingStudent] = useState<FullStudent | null>(null);
  const [editingStudent, setEditingStudent] = useState<FullStudent | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Custom School Form State
  const [newSchool, setNewSchool] = useState({
    name: "",
    type: "University" as SchoolType,
    uniType: "Public" as UniType,
  });

  // Sandbox settings form state
  const [sandbox, setSandbox] = useState({
    resendKey: "",
    arkeselKey: "",
    arkeselSender: "TN Connect",
  });

  // Load Data
  const loadData = () => {
    // Read students profiles
    const rawStu = localStorage.getItem("tnu_students");
    const stuList = rawStu ? JSON.parse(rawStu) : [];

    // Read users registry (for passwords and joined dates)
    const rawUsers = localStorage.getItem("tnu_users");
    const usersList = rawUsers ? JSON.parse(rawUsers) : [];

    // Merge
    const merged: FullStudent[] = stuList.map((s: Student) => {
      const user = usersList.find(
        (u: User & { password?: string }) =>
          u.email.toLowerCase() === s.email.toLowerCase() || u.id === s.userId,
      );
      return {
        ...s,
        password: user?.password || "No Password Found",
        joinedAt: user?.joinedAt || s.submittedAt,
        church: s.church || user?.church || "None",
        niche: s.niche || user?.niche || "General Studies",
        nationality: s.nationality || user?.nationality || "Ghanaian",
        status: s.status || user?.status || "Active Student",
      };
    });

    // Also include registered users who haven't completed student profile form yet
    usersList.forEach((u: User & { password?: string; role?: string }) => {
      if (u.role === "admin") return;
      const alreadyMerged = merged.some((m) => m.email.toLowerCase() === u.email.toLowerCase());
      if (!alreadyMerged) {
        merged.push({
          id: `s-mock-${u.id}`,
          userId: u.id,
          fullName: u.name,
          email: u.email,
          phone: u.phone || "No Phone",
          gender: u.gender || "other",
          dob: "N/A",
          university: u.university || "Not Chosen",
          department: u.department || "Not Chosen",
          program: u.program || "Not Chosen",
          level: u.level || "N/A",
          indexNumber: "N/A",
          address: "N/A",
          submittedAt: u.joinedAt,
          joinedAt: u.joinedAt,
          password: u.password,
          nationality: u.nationality || "Ghanaian",
          status: u.status || "Active Student",
          church: u.church || "None",
          niche: u.niche || "General Studies",
        });
      }
    });

    setStudents(merged);
    setSchools(getGhanaSchools());

    // Load sandbox keys
    setSandbox({
      resendKey: localStorage.getItem("resend_api_key") || "",
      arkeselKey: localStorage.getItem("arkesel_api_key") || "",
      arkeselSender: localStorage.getItem("arkesel_sender_id") || "TN Connect",
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and Sort List
  const filteredList = useMemo(() => {
    return students
      .filter((s) =>
        uniFilter === "all" ? true : s.university.toLowerCase().includes(uniFilter.toLowerCase()),
      )
      .filter((s) => (nicheFilter === "all" ? true : s.niche === nicheFilter))
      .filter((s) =>
        `${s.fullName} ${s.email} ${s.university} ${s.phone}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      )
      .sort((a, b) => {
        if (sort === "name") {
          return a.fullName.localeCompare(b.fullName);
        } else {
          return new Date(b.joinedAt || 0).getTime() - new Date(a.joinedAt || 0).getTime();
        }
      });
  }, [students, q, uniFilter, nicheFilter, sort]);

  // Unique list of universities represented by students for filters
  const studentUnis = useMemo(() => {
    return Array.from(
      new Set(students.map((s) => s.university).filter((u) => u && u !== "Not Chosen")),
    );
  }, [students]);

  // Save student modifications
  const saveStudentEdit = () => {
    if (!editingStudent) return;

    // 1. Update tnu_students
    const rawStu = localStorage.getItem("tnu_students");
    const stuList = rawStu ? JSON.parse(rawStu) : [];
    const stuIdx = stuList.findIndex(
      (s: Student) => s.email.toLowerCase() === editingStudent.email.toLowerCase(),
    );

    const updatedStu = {
      fullName: editingStudent.fullName,
      email: editingStudent.email,
      phone: editingStudent.phone,
      gender: editingStudent.gender,
      university: editingStudent.university,
      department: editingStudent.department,
      program: editingStudent.program,
      level: editingStudent.level,
      nationality: editingStudent.nationality,
      status: editingStudent.status,
      church: editingStudent.church,
      niche: editingStudent.niche,
    };

    if (stuIdx >= 0) {
      stuList[stuIdx] = { ...stuList[stuIdx], ...updatedStu };
    } else if (!editingStudent.id.startsWith("s-mock")) {
      stuList.push({
        id: editingStudent.id,
        userId: editingStudent.userId,
        ...updatedStu,
        dob: editingStudent.dob || new Date().toISOString().slice(0, 10),
        indexNumber:
          editingStudent.indexNumber || `STU${Math.floor(100000 + Math.random() * 900000)}`,
        address: editingStudent.address || "Accra, Ghana",
        submittedAt: new Date().toISOString(),
      });
    }
    localStorage.setItem("tnu_students", JSON.stringify(stuList));

    // 2. Update tnu_users
    const rawUsers = localStorage.getItem("tnu_users");
    const usersList = rawUsers ? JSON.parse(rawUsers) : [];
    const userIdx = usersList.findIndex(
      (u: User & { password?: string }) =>
        u.email.toLowerCase() === editingStudent.email.toLowerCase() ||
        u.id === editingStudent.userId,
    );

    if (userIdx >= 0) {
      usersList[userIdx] = {
        ...usersList[userIdx],
        name: editingStudent.fullName,
        phone: editingStudent.phone,
        gender: editingStudent.gender,
        university: editingStudent.university,
        department: editingStudent.department,
        program: editingStudent.program,
        level: editingStudent.level,
        nationality: editingStudent.nationality,
        status: editingStudent.status,
        church: editingStudent.church,
        niche: editingStudent.niche,
      };
      if (editingStudent.password) {
        usersList[userIdx].password = editingStudent.password;
      }
      localStorage.setItem("tnu_users", JSON.stringify(usersList));
    }

    toast.success("Student information updated successfully");
    setEditingStudent(null);
    loadData();
  };

  // Delete student
  const deleteStudent = (email: string) => {
    if (confirm(`Are you sure you want to permanently delete student ${email}?`)) {
      // Delete from tnu_students
      const rawStu = localStorage.getItem("tnu_students");
      if (rawStu) {
        const list = JSON.parse(rawStu);
        const filtered = list.filter((s: Student) => s.email.toLowerCase() !== email.toLowerCase());
        localStorage.setItem("tnu_students", JSON.stringify(filtered));
      }

      // Delete from tnu_users
      const rawUsers = localStorage.getItem("tnu_users");
      if (rawUsers) {
        const list = JSON.parse(rawUsers);
        const filtered = list.filter((u: User) => u.email.toLowerCase() !== email.toLowerCase());
        localStorage.setItem("tnu_users", JSON.stringify(filtered));
      }

      toast.success("Student deleted successfully");
      loadData();
    }
  };

  // Add Custom Institution
  const addCustomInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.name.trim()) return toast.error("School name is required");

    const customRaw = localStorage.getItem("tnu_custom_schools");
    const customList = customRaw ? JSON.parse(customRaw) : [];

    // Check duplication
    const fullList = [...getGhanaSchools()];
    if (fullList.some((s) => s.name.toLowerCase() === newSchool.name.toLowerCase().trim())) {
      return toast.error("An institution with this name already exists");
    }

    const added: GhanaSchool = {
      name: newSchool.name.trim(),
      type: newSchool.type,
      uniType: newSchool.type === "University" ? newSchool.uniType : undefined,
    };

    customList.push(added);
    saveCustomSchools(customList);
    toast.success(`School "${added.name}" added to database!`);
    setNewSchool({ name: "", type: "University", uniType: "Public" });
    loadData();
  };

  // Delete Custom Institution
  const deleteCustomInstitution = (name: string) => {
    if (confirm(`Remove "${name}" from custom database?`)) {
      const customRaw = localStorage.getItem("tnu_custom_schools");
      if (customRaw) {
        const list: GhanaSchool[] = JSON.parse(customRaw);
        const filtered = list.filter((s) => s.name !== name);
        saveCustomSchools(filtered);
        toast.success("Institution removed");
        loadData();
      }
    }
  };

  // Save Sandbox credentials
  const saveSandboxSettings = () => {
    localStorage.setItem("resend_api_key", sandbox.resendKey.trim());
    localStorage.setItem("arkesel_api_key", sandbox.arkeselKey.trim());
    localStorage.setItem("arkesel_sender_id", sandbox.arkeselSender.trim());
    toast.success("Sandbox API Keys saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold text-secondary">Student Management Console</h1>
        <p className="text-muted-foreground text-sm">
          Review credentials, monitor passwords, update niches, and manage school listings.
        </p>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl h-11 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger
            value="students"
            className="rounded-lg font-bold text-xs uppercase tracking-wider"
          >
            Registered Students
          </TabsTrigger>
          <TabsTrigger
            value="institutions"
            className="rounded-lg font-bold text-xs uppercase tracking-wider"
          >
            Manage Schools
          </TabsTrigger>
          <TabsTrigger
            value="sandbox"
            className="rounded-lg font-bold text-xs uppercase tracking-wider"
          >
            Sandbox API Keys
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: STUDENTS DIRECTORY */}
        <TabsContent value="students" className="space-y-4 pt-4">
          <Card className="border-none shadow-soft">
            <CardContent className="p-6 space-y-5">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search students, emails, or schools..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={uniFilter} onValueChange={setUniFilter}>
                  <SelectTrigger className="md:w-56">
                    <SelectValue placeholder="All schools" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All universities</SelectItem>
                    {studentUnis.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={nicheFilter} onValueChange={setNicheFilter}>
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="All Niches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Niches</SelectItem>
                    {NICHES.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="gap-1.5 font-bold"
                  onClick={() => setSort(sort === "date" ? "name" : "date")}
                >
                  <ArrowUpDown className="h-4 w-4" /> Sort: {sort === "date" ? "Newest" : "Name"}
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b border-slate-100">
                      <th className="py-3 px-2 font-bold">Student</th>
                      <th className="py-3 px-2 font-bold">School & Programme</th>
                      <th className="py-3 px-2 font-bold">Category/Niche</th>
                      <th className="py-3 px-2 font-bold">Status</th>
                      <th className="py-3 px-2 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="font-extrabold text-secondary leading-snug">
                            {s.fullName}
                          </div>
                          <div className="text-xs text-muted-foreground">{s.email}</div>
                          <div className="text-[10px] text-primary font-semibold mt-0.5">
                            {s.phone}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="text-xs font-bold text-secondary max-w-[200px] truncate">
                            {s.university}
                          </div>
                          <div className="text-[11px] text-muted-foreground max-w-[200px] truncate">
                            {s.program} · L{s.level}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-800 font-bold border-0 hover:bg-slate-100 text-[10px]"
                          >
                            {s.niche}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge
                            className={`border-0 font-bold text-[10px] ${
                              s.status === "Active Student"
                                ? "bg-ghana-green/10 text-ghana-green hover:bg-ghana-green/10"
                                : s.status === "Alumni"
                                  ? "bg-accent/20 text-accent-foreground hover:bg-accent/20"
                                  : "bg-ghana-red/10 text-ghana-red hover:bg-ghana-red/10"
                            }`}
                          >
                            {s.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-right space-x-1 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setViewingStudent(s);
                              setShowPassword(false);
                            }}
                          >
                            <Eye className="h-4 w-4 text-slate-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => setEditingStudent({ ...s })}
                          >
                            <Pencil className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => deleteStudent(s.email)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredList.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-12 text-muted-foreground font-medium"
                        >
                          No student records matched your filter settings.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: MANAGE SCHOOLS */}
        <TabsContent value="institutions" className="space-y-6 pt-4">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <Card className="border-none shadow-soft sticky top-20">
                <CardHeader>
                  <CardTitle className="font-extrabold text-lg">Add New Institution</CardTitle>
                  <CardDescription>
                    Expand the directory of Ghanaian higher education providers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addCustomInstitution} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="schoolName">Institution Name</Label>
                      <Input
                        id="schoolName"
                        value={newSchool.name}
                        onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                        placeholder="e.g. Academic City College"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="schoolTypeSelect">Institution Type</Label>
                      <Select
                        value={newSchool.type}
                        onValueChange={(v: SchoolType) => setNewSchool({ ...newSchool, type: v })}
                      >
                        <SelectTrigger id="schoolTypeSelect">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="University">University</SelectItem>
                          <SelectItem value="Nursing & Midwifery">Nursing & Midwifery</SelectItem>
                          <SelectItem value="College of Education">College of Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newSchool.type === "University" && (
                      <div className="space-y-1.5">
                        <Label htmlFor="uniTypeSelect">Sub-Type</Label>
                        <Select
                          value={newSchool.uniType}
                          onValueChange={(v: UniType) => setNewSchool({ ...newSchool, uniType: v })}
                        >
                          <SelectTrigger id="uniTypeSelect">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Public">Public Universities</SelectItem>
                            <SelectItem value="Technical">Technical Universities</SelectItem>
                            <SelectItem value="Private">Private Universities</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button type="submit" className="w-full font-bold gap-1.5 mt-2 h-11">
                      <Plus className="h-4 w-4" /> Add Institution
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="font-extrabold text-lg">
                    Ghanaian Institutions Registry
                  </CardTitle>
                  <CardDescription>
                    Custom schools currently appended to default Ghanaian directory.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-y-auto max-h-[500px]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b border-slate-100 bg-slate-50/50 sticky top-0">
                          <th className="py-3 px-4 font-bold">Institution Name</th>
                          <th className="py-3 px-4 font-bold">Category</th>
                          <th className="py-3 px-4 font-bold">Ownership</th>
                          <th className="py-3 px-4 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {schools.filter((s) => !GHANA_SCHOOLS.some((g) => g.name === s.name))
                          .length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="text-center py-16 text-muted-foreground font-medium"
                            >
                              No custom schools have been added yet. Add some on the left!
                            </td>
                          </tr>
                        ) : (
                          schools
                            .filter((s) => !GHANA_SCHOOLS.some((g) => g.name === s.name))
                            .map((s) => (
                              <tr key={s.name} className="hover:bg-slate-50/30">
                                <td className="py-3.5 px-4 font-bold text-secondary">{s.name}</td>
                                <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                                  {s.type}
                                </td>
                                <td className="py-3.5 px-4">
                                  {s.uniType ? (
                                    <Badge className="bg-slate-100 text-slate-800 border-0 font-bold text-[10px]">
                                      {s.uniType}
                                    </Badge>
                                  ) : (
                                    <span className="text-xs text-white/0">-</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => deleteCustomInstitution(s.name)}
                                    className="h-8 w-8 text-destructive hover:bg-destructive/5"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: VERIFICATION CONFIG */}
        <TabsContent value="sandbox" className="pt-4 max-w-2xl">
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle className="font-extrabold text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" /> Live API Integrations
              </CardTitle>
              <CardDescription>
                Configure credentials for SMS and email verification. Enter keys below to switch
                from sandbox simulation to live dispatches.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-4 bg-muted/60 border rounded-2xl flex gap-3 text-slate-800">
                <ShieldAlert className="h-5 w-5 text-accent-foreground shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>Sandbox Simulator Override:</strong> If fields below are blank, the
                  register panel operates in simulation mode, generating popups in the browser with
                  verification codes. Fill these fields to send real emails/SMS.
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-slate-400" /> Resend API Key (Email)
                  </Label>
                  <Input
                    type="password"
                    placeholder="re_xxxxxxxxxxxxxxxxxxxxx"
                    value={sandbox.resendKey}
                    onChange={(e) => setSandbox({ ...sandbox, resendKey: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Obtain a free key at{" "}
                    <a
                      href="https://resend.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      resend.com
                    </a>
                    . Sent emails will deploy from `onboarding@resend.dev`.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-slate-400" /> Arkesel API Key (SMS)
                  </Label>
                  <Input
                    type="password"
                    placeholder="Arkesel API Key"
                    value={sandbox.arkeselKey}
                    onChange={(e) => setSandbox({ ...sandbox, arkeselKey: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Obtain an SMS API key at{" "}
                    <a
                      href="https://arkesel.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      arkesel.com
                    </a>
                    .
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label>Arkesel Sender ID</Label>
                  <Input
                    placeholder="e.g. TN Connect"
                    value={sandbox.arkeselSender}
                    onChange={(e) => setSandbox({ ...sandbox, arkeselSender: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Must be verified in your Arkesel console (max 11 characters).
                  </p>
                </div>

                <Button onClick={saveSandboxSettings} className="w-full font-bold gap-1.5 h-11">
                  <Save className="h-4 w-4" /> Save Sandbox Configurations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG: VIEW DETAILS (Exposes password!) */}
      <Dialog open={!!viewingStudent} onOpenChange={(o) => !o && setViewingStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-secondary flex items-center gap-2">
              Student Audit: {viewingStudent?.fullName}
            </DialogTitle>
          </DialogHeader>

          {viewingStudent && (
            <div className="space-y-6">
              {/* Security Credentials */}
              <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                <h4 className="text-xs uppercase tracking-wider text-ghana-red font-extrabold mb-3 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" /> Account Credentials
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Login Email:</span>
                    <div className="font-bold text-secondary mt-0.5">{viewingStudent.email}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account Password:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <code className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-ghana-red text-sm">
                        {showPassword ? viewingStudent.password : "••••••••••"}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-[10px] font-bold"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Reveal Plaintext"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-xs">
                {[
                  ["Gender", viewingStudent.gender],
                  ["Nationality", viewingStudent.nationality],
                  ["Phone Number", viewingStudent.phone],
                  ["Church", viewingStudent.church],
                  ["Date of Birth", viewingStudent.dob],
                  [
                    "Account Created",
                    viewingStudent.joinedAt
                      ? new Date(viewingStudent.joinedAt).toLocaleString("en-GB")
                      : "N/A",
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="border-b pb-2 border-slate-100">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                      {k}
                    </div>
                    <div className="font-bold text-secondary text-sm">{v}</div>
                  </div>
                ))}
              </div>

              {/* Academic Details */}
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-xs bg-slate-50/50 p-4 border rounded-2xl">
                {[
                  ["School / Institution", viewingStudent.university],
                  ["Faculty", viewingStudent.faculty || "Not Specified"],
                  ["Department", viewingStudent.department],
                  ["Degree / Program", viewingStudent.program],
                  ["Current Level", viewingStudent.level],
                  ["Academic Status", viewingStudent.status],
                  ["Niche Category", viewingStudent.niche],
                  ["Index Number", viewingStudent.indexNumber || "N/A"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                      {k}
                    </div>
                    <div className="font-extrabold text-secondary text-sm">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingStudent(null)} className="font-bold">
              Close Portal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: EDIT STUDENT & ASSIGN NICHE */}
      <Dialog open={!!editingStudent} onOpenChange={(o) => !o && setEditingStudent(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-secondary">
              Edit Profile: {editingStudent?.fullName}
            </DialogTitle>
          </DialogHeader>

          {editingStudent && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input
                    value={editingStudent.fullName}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, fullName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number</Label>
                  <Input
                    value={editingStudent.phone}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Login Password</Label>
                  <Input
                    type="text"
                    value={editingStudent.password || ""}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, password: e.target.value })
                    }
                    placeholder="Edit password"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Nationality</Label>
                  <Input
                    value={editingStudent.nationality}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, nationality: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <Select
                    value={editingStudent.gender}
                    onValueChange={(v) => setEditingStudent({ ...editingStudent, gender: v })}
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
                <div className="space-y-1.5">
                  <Label>Church</Label>
                  <Select
                    value={editingStudent.church}
                    onValueChange={(v) => setEditingStudent({ ...editingStudent, church: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label>Level</Label>
                  <Select
                    value={editingStudent.level}
                    onValueChange={(v) => setEditingStudent({ ...editingStudent, level: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((l) => (
                        <SelectItem key={l} value={l}>
                          Level {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>School / Institution</Label>
                <Select
                  value={editingStudent.university}
                  onValueChange={(v) => setEditingStudent({ ...editingStudent, university: v })}
                >
                  <SelectTrigger className="text-left py-2 h-auto whitespace-normal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {schools.map((s) => (
                      <SelectItem key={s.name} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Faculty</Label>
                  <Select
                    value={editingStudent.faculty}
                    onValueChange={(v) => setEditingStudent({ ...editingStudent, faculty: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label>Department</Label>
                  <Select
                    value={editingStudent.department}
                    onValueChange={(v) => setEditingStudent({ ...editingStudent, department: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Programme</Label>
                  <Select
                    value={editingStudent.program}
                    onValueChange={(v) => setEditingStudent({ ...editingStudent, program: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label>Index Number</Label>
                  <Input
                    value={editingStudent.indexNumber || ""}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, indexNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* CRITICAL MANAGEMENT FIELDS: STATUS & NICHE */}
              <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-50 border rounded-2xl mt-4">
                <div className="space-y-1.5">
                  <Label className="font-extrabold text-secondary">Assign Student Niche</Label>
                  <Select
                    value={editingStudent.niche}
                    onValueChange={(v) => setEditingStudent({ ...editingStudent, niche: v })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NICHES.map((n) => (
                        <SelectItem key={n} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Filters students by functional focus area.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-extrabold text-secondary">Academic Status</Label>
                  <Select
                    value={editingStudent.status}
                    onValueChange={(v) => setEditingStudent({ ...editingStudent, status: v })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active Student">Active Student</SelectItem>
                      <SelectItem value="Alumni">Alumni</SelectItem>
                      <SelectItem value="Completed">Completed Study</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Identifies active learners versus graduated leaders.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setEditingStudent(null)} className="font-bold">
              Cancel
            </Button>
            <Button onClick={saveStudentEdit} className="font-bold">
              Save Modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
