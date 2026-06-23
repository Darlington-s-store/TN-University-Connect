import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Eye,
  ArrowUpDown,
  Pencil,
  Trash2,
  ShieldAlert,
  Plus,
  Key,
  Undo2,
  Mail,
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
  getCustomSchools,
  saveCustomSchools,
  getHiddenSchools,
  saveHiddenSchools,
  getFaculties,
  getCustomFaculties,
  saveCustomFaculties,
  getHiddenFaculties,
  saveHiddenFaculties,
  getProgrammes,
  getCustomProgrammes,
  saveCustomProgrammes,
  getHiddenProgrammes,
  saveHiddenProgrammes,
  getLevels,
  getCustomLevels,
  saveCustomLevels,
  getHiddenLevels,
  saveHiddenLevels,
  GHANA_SCHOOLS,
  GhanaSchool,
  SchoolType,
  UniType,
  NICHES,
  LEVELS as DEFAULT_LEVELS,
  CHURCHES,
  FACULTIES as DEFAULT_FACULTIES,
  DEPARTMENTS,
  PROGRAMMES as DEFAULT_PROGRAMMES,
} from "@/lib/schools";
import {
  getStudents as apiGetStudents,
  deleteStudent as apiDeleteStudent,
  saveStudentAdmin as apiSaveStudent,
  resetPasswordAdmin,
  sendMessageAdmin,
  Student,
} from "@/lib/data";
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
  schoolType?: string;
  uniType?: string;
  avatar?: string;
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
  const [resetPasswordStudent, setResetPasswordStudent] = useState<FullStudent | null>(null);
  const [newPassword, setNewPassword] = useState("");

  // Message Sending States
  const [messagingStudent, setMessagingStudent] = useState<FullStudent | null>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [messageChannel, setMessageChannel] = useState<"email" | "sms" | "both">("email");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const isEditingExisting = useMemo(() => {
    if (!editingStudent) return false;
    return students.some((s) => s.email.toLowerCase() === editingStudent.email.toLowerCase());
  }, [editingStudent, students]);

  const openNewStudent = () => {
    setEditingStudent({
      id: `s-${Date.now()}`,
      userId: `u-${Date.now()}`,
      fullName: "",
      email: "",
      phone: "+233 ",
      gender: "male",
      dob: new Date().toISOString().slice(0, 10),
      university: schools[0]?.name || "Not Chosen",
      faculty: DEFAULT_FACULTIES[0] || "Not Chosen",
      department: DEPARTMENTS[0] || "Not Chosen",
      program: DEFAULT_PROGRAMMES[0] || "Not Chosen",
      level: DEFAULT_LEVELS[0] || "100",
      indexNumber: "",
      address: "Accra, Ghana",
      nationality: "Ghanaian",
      status: "Active Student",
      church: CHURCHES[0] || "None",
      niche: NICHES[0] || "General Studies",
      schoolType: "University",
      uniType: "Public",
      password: "student123",
      submittedAt: new Date().toISOString(),
    });
  };

  // Custom School Form State
  const [newSchool, setNewSchool] = useState({
    name: "",
    type: "University" as SchoolType,
    uniType: "Public" as UniType,
  });

  // School management state
  const [schoolSearch, setSchoolSearch] = useState("");
  const [editingSchool, setEditingSchool] = useState<GhanaSchool | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [hiddenSchools, setHiddenSchools] = useState<string[]>([]);

  // Faculties state
  const [faculties, setFaculties] = useState<string[]>([]);
  const [facultySearch, setFacultySearch] = useState("");
  const [newFaculty, setNewFaculty] = useState("");
  const [editingFaculty, setEditingFaculty] = useState<string | null>(null);
  const [editFacultyVal, setEditFacultyVal] = useState("");
  const [showHiddenFaculties, setShowHiddenFaculties] = useState(false);
  const [hiddenFaculties, setHiddenFaculties] = useState<string[]>([]);

  // Programmes state
  const [programmes, setProgrammes] = useState<string[]>([]);
  const [programmeSearch, setProgrammeSearch] = useState("");
  const [newProgramme, setNewProgramme] = useState("");
  const [editingProgramme, setEditingProgramme] = useState<string | null>(null);
  const [editProgrammeVal, setEditProgrammeVal] = useState("");
  const [showHiddenProgrammes, setShowHiddenProgrammes] = useState(false);
  const [hiddenProgrammes, setHiddenProgrammes] = useState<string[]>([]);

  // Levels state
  const [levels, setLevels] = useState<string[]>([]);
  const [levelSearch, setLevelSearch] = useState("");
  const [newLevel, setNewLevel] = useState("");
  const [editingLevel, setEditingLevel] = useState<string | null>(null);
  const [editLevelVal, setEditLevelVal] = useState("");
  const [showHiddenLevels, setShowHiddenLevels] = useState(false);
  const [hiddenLevels, setHiddenLevels] = useState<string[]>([]);

  // Load Data
  const loadData = async () => {
    try {
      const apiStudents = await apiGetStudents();
      const merged: FullStudent[] = apiStudents.map((s: any) => ({
        ...s,
        password: s.password || "Protected Hash",
        joinedAt: s.joinedAt || s.submittedAt,
        church: s.church || "None",
        niche: s.niche || "General Studies",
        nationality: s.nationality || "Ghanaian",
        status: s.status || "Active Student",
        schoolType: s.schoolType || "University",
        uniType: s.uniType || "Public",
        faculty: s.faculty || DEFAULT_FACULTIES[0],
      }));
      setStudents(merged);
    } catch (error: any) {
      toast.error(error.message || "Failed to load students");
    }

    setSchools(getGhanaSchools());
    setHiddenSchools(getHiddenSchools());
    setFaculties(getFaculties());
    setHiddenFaculties(getHiddenFaculties());
    setProgrammes(getProgrammes());
    setHiddenProgrammes(getHiddenProgrammes());
    setLevels(getLevels());
    setHiddenLevels(getHiddenLevels());
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
  const saveStudentEdit = async () => {
    if (!editingStudent) return;

    if (!editingStudent.fullName.trim() || !editingStudent.email.trim()) {
      toast.error("Full Name and Email are required");
      return;
    }

    // Resolve school type and uniType based on selected university
    const schoolDetails = schools.find((sch) => sch.name === editingStudent.university);
    const resolvedSchoolType = schoolDetails?.type || editingStudent.schoolType || "University";
    const resolvedUniType = schoolDetails?.uniType || editingStudent.uniType || "";

    try {
      const isUUID = (str: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      const cleanUserId =
        editingStudent.userId && isUUID(editingStudent.userId) ? editingStudent.userId : undefined;

      const payload = {
        userId: cleanUserId,
        email: editingStudent.email,
        fullName: editingStudent.fullName,
        phone: editingStudent.phone,
        gender: editingStudent.gender,
        dob: editingStudent.dob || new Date().toISOString().slice(0, 10),
        university: editingStudent.university,
        schoolType: resolvedSchoolType,
        uniType: resolvedUniType,
        faculty: editingStudent.faculty,
        department: editingStudent.department,
        program: editingStudent.program,
        level: editingStudent.level,
        indexNumber:
          editingStudent.indexNumber || `STU${Math.floor(100000 + Math.random() * 900000)}`,
        address: editingStudent.address || "Accra, Ghana",
        nationality: editingStudent.nationality || "Ghanaian",
        status: editingStudent.status || "Active Student",
        church: editingStudent.church || "None",
        niche: editingStudent.niche || "General Studies",
      };

      await apiSaveStudent(payload);
      toast.success(
        isEditingExisting
          ? "Student information updated successfully"
          : "Student registered successfully",
      );
      setEditingStudent(null);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save student profile");
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordStudent) return;
    if (!newPassword.trim()) {
      toast.error("Please enter or generate a password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      await resetPasswordAdmin(resetPasswordStudent.userId || "", newPassword.trim());
      toast.success(
        `Password for ${resetPasswordStudent.fullName} successfully updated to "${newPassword.trim()}"`,
      );
      setResetPasswordStudent(null);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    }
  };

  // Delete student
  const deleteStudent = async (id: string, email: string) => {
    if (confirm(`Are you sure you want to permanently delete student ${email}?`)) {
      try {
        await apiDeleteStudent(id);
        toast.success("Student deleted successfully");
        await loadData();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete student");
      }
    }
  };

  // Add Custom Institution
  const addCustomInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.name.trim()) return toast.error("School name is required");

    const customList = getCustomSchools();

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

  // Delete school (custom or hide default)
  const deleteSchool = (name: string) => {
    const isDefault = GHANA_SCHOOLS.some((g) => g.name === name);
    const label = isDefault
      ? `Hide "${name}" from the directory? You can restore it later.`
      : `Remove "${name}" from the database?`;
    if (confirm(label)) {
      if (isDefault) {
        const hidden = getHiddenSchools();
        if (!hidden.includes(name)) {
          hidden.push(name);
          saveHiddenSchools(hidden);
        }
      } else {
        const list = getCustomSchools();
        saveCustomSchools(list.filter((s) => s.name !== name));
      }
      toast.success(`"${name}" removed`);
      loadData();
    }
  };

  // Restore a hidden default school
  const restoreSchool = (name: string) => {
    const hidden = getHiddenSchools().filter((h) => h !== name);
    saveHiddenSchools(hidden);
    toast.success(`"${name}" restored`);
    loadData();
  };

  // Edit school
  const saveSchoolEdit = () => {
    if (!editingSchool || !editingSchool.name.trim()) {
      toast.error("School name is required");
      return;
    }

    const isDefault = GHANA_SCHOOLS.some((g) => g.name === editingSchool.name);
    if (!isDefault) {
      const list = getCustomSchools();
      const idx = list.findIndex((s) => s.name === editingSchool.name);
      if (idx >= 0) {
        list[idx] = { ...editingSchool };
        saveCustomSchools(list);
      }
    }

    toast.success("School updated");
    setEditingSchool(null);
    loadData();
  };

  // ── Faculties CRUD ───────────────────────────────
  const addFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newFaculty.trim();
    if (!val) return toast.error("Faculty name is required");
    if (faculties.some((f) => f.toLowerCase() === val.toLowerCase()))
      return toast.error("Faculty already exists");
    const custom = getCustomFaculties();
    custom.push(val);
    saveCustomFaculties(custom);
    toast.success(`Faculty "${val}" added`);
    setNewFaculty("");
    loadData();
  };

  const deleteFaculty = (name: string) => {
    const isDefault = DEFAULT_FACULTIES.includes(name);
    if (isDefault) {
      const hidden = getHiddenFaculties();
      if (!hidden.includes(name)) {
        hidden.push(name);
        saveHiddenFaculties(hidden);
      }
    } else {
      const custom = getCustomFaculties().filter((f) => f !== name);
      saveCustomFaculties(custom);
    }
    toast.success(`"${name}" removed`);
    loadData();
  };

  const restoreFaculty = (name: string) => {
    saveHiddenFaculties(getHiddenFaculties().filter((h) => h !== name));
    toast.success(`"${name}" restored`);
    loadData();
  };

  const saveFacultyEdit = () => {
    if (!editFacultyVal.trim()) return toast.error("Faculty name is required");
    const old = editingFaculty!;
    const isDefault = DEFAULT_FACULTIES.includes(old);

    if (isDefault) {
      const hidden = getHiddenFaculties();
      if (hidden.includes(old)) {
        saveHiddenFaculties(hidden.filter((h) => h !== old));
      }
    } else {
      const custom = getCustomFaculties();
      const idx = custom.findIndex((f) => f === old);
      if (idx >= 0) {
        custom[idx] = editFacultyVal.trim();
        saveCustomFaculties(custom);
      }
    }
    toast.success("Faculty updated");
    setEditingFaculty(null);
    loadData();
  };

  // ── Programmes CRUD ──────────────────────────────
  const addProgramme = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newProgramme.trim();
    if (!val) return toast.error("Programme name is required");
    if (programmes.some((p) => p.toLowerCase() === val.toLowerCase()))
      return toast.error("Programme already exists");
    const custom = getCustomProgrammes();
    custom.push(val);
    saveCustomProgrammes(custom);
    toast.success(`Programme "${val}" added`);
    setNewProgramme("");
    loadData();
  };

  const deleteProgramme = (name: string) => {
    const isDefault = DEFAULT_PROGRAMMES.includes(name);
    if (isDefault) {
      const hidden = getHiddenProgrammes();
      if (!hidden.includes(name)) {
        hidden.push(name);
        saveHiddenProgrammes(hidden);
      }
    } else {
      saveCustomProgrammes(getCustomProgrammes().filter((p) => p !== name));
    }
    toast.success(`"${name}" removed`);
    loadData();
  };

  const restoreProgramme = (name: string) => {
    saveHiddenProgrammes(getHiddenProgrammes().filter((h) => h !== name));
    toast.success(`"${name}" restored`);
    loadData();
  };

  const saveProgrammeEdit = () => {
    if (!editProgrammeVal.trim()) return toast.error("Programme name is required");
    const old = editingProgramme!;
    const isDefault = DEFAULT_PROGRAMMES.includes(old);

    if (isDefault) {
      const hidden = getHiddenProgrammes();
      if (hidden.includes(old)) {
        saveHiddenProgrammes(hidden.filter((h) => h !== old));
      }
    } else {
      const custom = getCustomProgrammes();
      const idx = custom.findIndex((p) => p === old);
      if (idx >= 0) {
        custom[idx] = editProgrammeVal.trim();
        saveCustomProgrammes(custom);
      }
    }
    toast.success("Programme updated");
    setEditingProgramme(null);
    loadData();
  };

  // ── Levels CRUD ──────────────────────────────────
  const addLevel = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newLevel.trim();
    if (!val) return toast.error("Level name is required");
    if (levels.some((l) => l.toLowerCase() === val.toLowerCase()))
      return toast.error("Level already exists");
    const custom = getCustomLevels();
    custom.push(val);
    saveCustomLevels(custom);
    toast.success(`Level "${val}" added`);
    setNewLevel("");
    loadData();
  };

  const deleteLevel = (name: string) => {
    const isDefault = DEFAULT_LEVELS.includes(name);
    if (isDefault) {
      const hidden = getHiddenLevels();
      if (!hidden.includes(name)) {
        hidden.push(name);
        saveHiddenLevels(hidden);
      }
    } else {
      saveCustomLevels(getCustomLevels().filter((l) => l !== name));
    }
    toast.success(`"${name}" removed`);
    loadData();
  };

  const restoreLevel = (name: string) => {
    saveHiddenLevels(getHiddenLevels().filter((h) => h !== name));
    toast.success(`"${name}" restored`);
    loadData();
  };

  const saveLevelEdit = () => {
    if (!editLevelVal.trim()) return toast.error("Level name is required");
    const old = editingLevel!;
    const isDefault = DEFAULT_LEVELS.includes(old);

    if (isDefault) {
      const hidden = getHiddenLevels();
      if (hidden.includes(old)) {
        saveHiddenLevels(hidden.filter((h) => h !== old));
      }
    } else {
      const custom = getCustomLevels();
      const idx = custom.findIndex((l) => l === old);
      if (idx >= 0) {
        custom[idx] = editLevelVal.trim();
        saveCustomLevels(custom);
      }
    }
    toast.success("Level updated");
    setEditingLevel(null);
    loadData();
  };

  const isDefaultFaculty = (v: string) => DEFAULT_FACULTIES.includes(v);
  const isDefaultProgramme = (v: string) => DEFAULT_PROGRAMMES.includes(v);
  const isDefaultLevel = (v: string) => DEFAULT_LEVELS.includes(v);

  const AcademicRow = ({
    name,
    isDefault,
    onEdit,
    onDelete,
    onRestore,
  }: {
    name: string;
    isDefault: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onRestore?: () => void;
  }) => (
    <tr className="hover:bg-slate-50/30 transition-colors">
      <td className="py-3 px-4 font-bold text-secondary">{name}</td>
      <td className="py-3 px-4">
        <Badge
          className={`border-0 font-bold text-[10px] ${isDefault ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"}`}
        >
          {isDefault ? "Default" : "Custom"}
        </Badge>
      </td>
      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
        {onRestore ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={onRestore}
            className="h-8 text-xs font-bold text-primary"
          >
            <Undo2 className="h-3.5 w-3.5 mr-1" /> Restore
          </Button>
        ) : (
          <>
            <Button size="sm" variant="ghost" onClick={onEdit} className="h-8 w-8 p-0" title="Edit">
              <Pencil className="h-4 w-4 text-primary" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="h-8 w-8 p-0"
              title="Remove"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </>
        )}
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold text-secondary">Student Management Console</h1>
          <p className="text-muted-foreground text-sm">
            Review credentials, monitor passwords, update niches, and manage school listings.
          </p>
        </div>
        <Button onClick={openNewStudent} className="gap-1.5 font-bold shrink-0">
          <Plus className="h-4 w-4" /> Add New Student
        </Button>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <div className="overflow-x-auto pb-1">
          <TabsList className="w-fit h-11 bg-slate-100 p-1 rounded-xl inline-flex">
            <TabsTrigger
              value="students"
              className="rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap"
            >
              Registered Students
            </TabsTrigger>
            <TabsTrigger
              value="institutions"
              className="rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap"
            >
              Institutions
            </TabsTrigger>
            <TabsTrigger
              value="faculties"
              className="rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap"
            >
              Faculties
            </TabsTrigger>
            <TabsTrigger
              value="programmes"
              className="rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap"
            >
              Programmes
            </TabsTrigger>
            <TabsTrigger
              value="levels"
              className="rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap"
            >
              Levels
            </TabsTrigger>
          </TabsList>
        </div>

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
                            title="View Student details"
                          >
                            <Eye className="h-4 w-4 text-slate-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setMessagingStudent(s);
                              setMessageSubject("Administrative Notification");
                              setMessageBody("");
                              setMessageChannel("email");
                            }}
                            title="Send message to Student"
                          >
                            <Mail className="h-4 w-4 text-sky-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setResetPasswordStudent(s);
                              setNewPassword("");
                            }}
                            title="Reset Student password"
                          >
                            <Key className="h-4 w-4 text-amber-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => setEditingStudent({ ...s })}
                            title="Edit Student info"
                          >
                            <Pencil className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => deleteStudent(s.id, s.email)}
                            title="Delete Student"
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
                    All institutions in the directory. Default schools can be hidden; custom schools
                    can be edited or removed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search institutions..."
                        value={schoolSearch}
                        onChange={(e) => setSchoolSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className={`gap-1.5 font-bold shrink-0 ${showHidden ? "border-primary text-primary" : ""}`}
                      onClick={() => setShowHidden(!showHidden)}
                    >
                      <Undo2 className="h-4 w-4" />{" "}
                      {showHidden ? "Showing hidden" : "Hidden schools"}
                      {hiddenSchools.length > 0 && !showHidden && (
                        <Badge className="ml-1 bg-destructive text-destructive-foreground border-0 text-[10px] h-5 px-1.5">
                          {hiddenSchools.length}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  <div className="overflow-y-auto max-h-[500px] border rounded-xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b bg-slate-50/80 sticky top-0">
                          <th className="py-3 px-4 font-bold">Institution Name</th>
                          <th className="py-3 px-4 font-bold">Category</th>
                          <th className="py-3 px-4 font-bold">Ownership</th>
                          <th className="py-3 px-4 font-bold">Source</th>
                          <th className="py-3 px-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {showHidden
                          ? GHANA_SCHOOLS.filter((s) => hiddenSchools.includes(s.name))
                              .filter(
                                (s) =>
                                  !schoolSearch ||
                                  s.name.toLowerCase().includes(schoolSearch.toLowerCase()),
                              )
                              .map((s) => (
                                <tr key={s.name} className="bg-red-50/30">
                                  <td className="py-3 px-4 font-bold text-secondary line-through opacity-60">
                                    {s.name}
                                  </td>
                                  <td className="py-3 px-4 text-xs font-semibold text-slate-600">
                                    {s.type}
                                  </td>
                                  <td className="py-3 px-4">
                                    {s.uniType ? (
                                      <Badge className="bg-slate-100 text-slate-800 border-0 font-bold text-[10px]">
                                        {s.uniType}
                                      </Badge>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">—</span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-xs text-muted-foreground">
                                    Default
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => restoreSchool(s.name)}
                                      className="h-8 text-xs font-bold text-primary"
                                    >
                                      <Undo2 className="h-3.5 w-3.5 mr-1" /> Restore
                                    </Button>
                                  </td>
                                </tr>
                              ))
                          : schools
                              .filter(
                                (s) =>
                                  !schoolSearch ||
                                  s.name.toLowerCase().includes(schoolSearch.toLowerCase()),
                              )
                              .map((s) => {
                                const isDefault = GHANA_SCHOOLS.some((g) => g.name === s.name);
                                return (
                                  <tr
                                    key={s.name}
                                    className="hover:bg-slate-50/30 transition-colors"
                                  >
                                    <td className="py-3 px-4 font-bold text-secondary">{s.name}</td>
                                    <td className="py-3 px-4 text-xs font-semibold text-slate-600">
                                      {s.type}
                                    </td>
                                    <td className="py-3 px-4">
                                      {s.uniType ? (
                                        <Badge className="bg-slate-100 text-slate-800 border-0 font-bold text-[10px]">
                                          {s.uniType}
                                        </Badge>
                                      ) : (
                                        <span className="text-xs text-muted-foreground">—</span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4">
                                      <Badge
                                        className={`border-0 font-bold text-[10px] ${isDefault ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"}`}
                                      >
                                        {isDefault ? "Default" : "Custom"}
                                      </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditingSchool({ ...s })}
                                        className="h-8 w-8 p-0"
                                        title="Edit school"
                                      >
                                        <Pencil className="h-4 w-4 text-primary" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteSchool(s.name)}
                                        className="h-8 w-8 p-0"
                                        title="Remove school"
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                        {!showHidden &&
                          schools.filter(
                            (s) =>
                              !schoolSearch ||
                              s.name.toLowerCase().includes(schoolSearch.toLowerCase()),
                          ).length === 0 && (
                            <tr>
                              <td
                                colSpan={5}
                                className="text-center py-16 text-muted-foreground font-medium"
                              >
                                {schoolSearch
                                  ? "No institutions match your search."
                                  : "No institutions found in the directory."}
                              </td>
                            </tr>
                          )}
                        {showHidden &&
                          GHANA_SCHOOLS.filter((s) => hiddenSchools.includes(s.name)).filter(
                            (s) =>
                              !schoolSearch ||
                              s.name.toLowerCase().includes(schoolSearch.toLowerCase()),
                          ).length === 0 && (
                            <tr>
                              <td
                                colSpan={5}
                                className="text-center py-16 text-muted-foreground font-medium"
                              >
                                {schoolSearch
                                  ? "No hidden schools match your search."
                                  : "No schools are currently hidden."}
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: FACULTIES */}
        <TabsContent value="faculties" className="space-y-6 pt-4">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <Card className="border-none shadow-soft sticky top-20">
                <CardHeader>
                  <CardTitle className="font-extrabold text-lg">Add New Faculty</CardTitle>
                  <CardDescription>Add a faculty to the academic directory.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addFaculty} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="newFaculty">Faculty Name</Label>
                      <Input
                        id="newFaculty"
                        value={newFaculty}
                        onChange={(e) => setNewFaculty(e.target.value)}
                        placeholder="e.g. Faculty of Pharmacy"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full font-bold gap-1.5 h-11">
                      <Plus className="h-4 w-4" /> Add Faculty
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-8">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="font-extrabold text-lg">Faculties Registry</CardTitle>
                  <CardDescription>Manage all faculties used across the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search faculties..."
                        value={facultySearch}
                        onChange={(e) => setFacultySearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className={`gap-1.5 font-bold shrink-0 ${showHiddenFaculties ? "border-primary text-primary" : ""}`}
                      onClick={() => setShowHiddenFaculties(!showHiddenFaculties)}
                    >
                      <Undo2 className="h-4 w-4" /> Hidden
                      {hiddenFaculties.length > 0 && !showHiddenFaculties && (
                        <Badge className="ml-1 bg-destructive text-destructive-foreground border-0 text-[10px] h-5 px-1.5">
                          {hiddenFaculties.length}
                        </Badge>
                      )}
                    </Button>
                  </div>
                  <div className="overflow-y-auto max-h-[500px] border rounded-xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b bg-slate-50/80 sticky top-0">
                          <th className="py-3 px-4 font-bold">Faculty Name</th>
                          <th className="py-3 px-4 font-bold">Source</th>
                          <th className="py-3 px-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {showHiddenFaculties
                          ? DEFAULT_FACULTIES.filter((f) => hiddenFaculties.includes(f))
                              .filter(
                                (f) =>
                                  !facultySearch ||
                                  f.toLowerCase().includes(facultySearch.toLowerCase()),
                              )
                              .map((f) => (
                                <AcademicRow
                                  key={f}
                                  name={f}
                                  isDefault
                                  onEdit={() => {}}
                                  onDelete={() => {}}
                                  onRestore={() => restoreFaculty(f)}
                                />
                              ))
                          : faculties
                              .filter(
                                (f) =>
                                  !facultySearch ||
                                  f.toLowerCase().includes(facultySearch.toLowerCase()),
                              )
                              .map((f) => (
                                <AcademicRow
                                  key={f}
                                  name={f}
                                  isDefault={isDefaultFaculty(f)}
                                  onEdit={() => {
                                    setEditingFaculty(f);
                                    setEditFacultyVal(f);
                                  }}
                                  onDelete={() => deleteFaculty(f)}
                                />
                              ))}
                        {((showHiddenFaculties &&
                          DEFAULT_FACULTIES.filter((f) => hiddenFaculties.includes(f)).filter(
                            (f) =>
                              !facultySearch ||
                              f.toLowerCase().includes(facultySearch.toLowerCase()),
                          ).length === 0) ||
                          (!showHiddenFaculties &&
                            faculties.filter(
                              (f) =>
                                !facultySearch ||
                                f.toLowerCase().includes(facultySearch.toLowerCase()),
                            ).length === 0)) && (
                          <tr>
                            <td
                              colSpan={3}
                              className="text-center py-16 text-muted-foreground font-medium"
                            >
                              {showHiddenFaculties
                                ? "No hidden faculties."
                                : "No faculties match your search."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: PROGRAMMES */}
        <TabsContent value="programmes" className="space-y-6 pt-4">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <Card className="border-none shadow-soft sticky top-20">
                <CardHeader>
                  <CardTitle className="font-extrabold text-lg">Add New Programme</CardTitle>
                  <CardDescription>Add a programme of study to the directory.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addProgramme} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="newProgramme">Programme Name</Label>
                      <Input
                        id="newProgramme"
                        value={newProgramme}
                        onChange={(e) => setNewProgramme(e.target.value)}
                        placeholder="e.g. BSc Biomedical Engineering"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full font-bold gap-1.5 h-11">
                      <Plus className="h-4 w-4" /> Add Programme
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-8">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="font-extrabold text-lg">Programmes Registry</CardTitle>
                  <CardDescription>
                    Manage all degree programmes used across the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search programmes..."
                        value={programmeSearch}
                        onChange={(e) => setProgrammeSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className={`gap-1.5 font-bold shrink-0 ${showHiddenProgrammes ? "border-primary text-primary" : ""}`}
                      onClick={() => setShowHiddenProgrammes(!showHiddenProgrammes)}
                    >
                      <Undo2 className="h-4 w-4" /> Hidden
                      {hiddenProgrammes.length > 0 && !showHiddenProgrammes && (
                        <Badge className="ml-1 bg-destructive text-destructive-foreground border-0 text-[10px] h-5 px-1.5">
                          {hiddenProgrammes.length}
                        </Badge>
                      )}
                    </Button>
                  </div>
                  <div className="overflow-y-auto max-h-[500px] border rounded-xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b bg-slate-50/80 sticky top-0">
                          <th className="py-3 px-4 font-bold">Programme Name</th>
                          <th className="py-3 px-4 font-bold">Source</th>
                          <th className="py-3 px-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {showHiddenProgrammes
                          ? DEFAULT_PROGRAMMES.filter((p) => hiddenProgrammes.includes(p))
                              .filter(
                                (p) =>
                                  !programmeSearch ||
                                  p.toLowerCase().includes(programmeSearch.toLowerCase()),
                              )
                              .map((p) => (
                                <AcademicRow
                                  key={p}
                                  name={p}
                                  isDefault
                                  onEdit={() => {}}
                                  onDelete={() => {}}
                                  onRestore={() => restoreProgramme(p)}
                                />
                              ))
                          : programmes
                              .filter(
                                (p) =>
                                  !programmeSearch ||
                                  p.toLowerCase().includes(programmeSearch.toLowerCase()),
                              )
                              .map((p) => (
                                <AcademicRow
                                  key={p}
                                  name={p}
                                  isDefault={isDefaultProgramme(p)}
                                  onEdit={() => {
                                    setEditingProgramme(p);
                                    setEditProgrammeVal(p);
                                  }}
                                  onDelete={() => deleteProgramme(p)}
                                />
                              ))}
                        {((showHiddenProgrammes &&
                          DEFAULT_PROGRAMMES.filter((p) => hiddenProgrammes.includes(p)).filter(
                            (p) =>
                              !programmeSearch ||
                              p.toLowerCase().includes(programmeSearch.toLowerCase()),
                          ).length === 0) ||
                          (!showHiddenProgrammes &&
                            programmes.filter(
                              (p) =>
                                !programmeSearch ||
                                p.toLowerCase().includes(programmeSearch.toLowerCase()),
                            ).length === 0)) && (
                          <tr>
                            <td
                              colSpan={3}
                              className="text-center py-16 text-muted-foreground font-medium"
                            >
                              {showHiddenProgrammes
                                ? "No hidden programmes."
                                : "No programmes match your search."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 5: LEVELS */}
        <TabsContent value="levels" className="space-y-6 pt-4">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <Card className="border-none shadow-soft sticky top-20">
                <CardHeader>
                  <CardTitle className="font-extrabold text-lg">Add New Level</CardTitle>
                  <CardDescription>Add a level or academic stage to the directory.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addLevel} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="newLevel">Level Name</Label>
                      <Input
                        id="newLevel"
                        value={newLevel}
                        onChange={(e) => setNewLevel(e.target.value)}
                        placeholder="e.g. Postgraduate"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full font-bold gap-1.5 h-11">
                      <Plus className="h-4 w-4" /> Add Level
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-8">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="font-extrabold text-lg">Levels Registry</CardTitle>
                  <CardDescription>
                    Manage all academic levels used across the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search levels..."
                        value={levelSearch}
                        onChange={(e) => setLevelSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className={`gap-1.5 font-bold shrink-0 ${showHiddenLevels ? "border-primary text-primary" : ""}`}
                      onClick={() => setShowHiddenLevels(!showHiddenLevels)}
                    >
                      <Undo2 className="h-4 w-4" /> Hidden
                      {hiddenLevels.length > 0 && !showHiddenLevels && (
                        <Badge className="ml-1 bg-destructive text-destructive-foreground border-0 text-[10px] h-5 px-1.5">
                          {hiddenLevels.length}
                        </Badge>
                      )}
                    </Button>
                  </div>
                  <div className="overflow-y-auto max-h-[500px] border rounded-xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b bg-slate-50/80 sticky top-0">
                          <th className="py-3 px-4 font-bold">Level Name</th>
                          <th className="py-3 px-4 font-bold">Source</th>
                          <th className="py-3 px-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {showHiddenLevels
                          ? DEFAULT_LEVELS.filter((l) => hiddenLevels.includes(l))
                              .filter(
                                (l) =>
                                  !levelSearch ||
                                  l.toLowerCase().includes(levelSearch.toLowerCase()),
                              )
                              .map((l) => (
                                <AcademicRow
                                  key={l}
                                  name={l}
                                  isDefault
                                  onEdit={() => {}}
                                  onDelete={() => {}}
                                  onRestore={() => restoreLevel(l)}
                                />
                              ))
                          : levels
                              .filter(
                                (l) =>
                                  !levelSearch ||
                                  l.toLowerCase().includes(levelSearch.toLowerCase()),
                              )
                              .map((l) => (
                                <AcademicRow
                                  key={l}
                                  name={l}
                                  isDefault={isDefaultLevel(l)}
                                  onEdit={() => {
                                    setEditingLevel(l);
                                    setEditLevelVal(l);
                                  }}
                                  onDelete={() => deleteLevel(l)}
                                />
                              ))}
                        {((showHiddenLevels &&
                          DEFAULT_LEVELS.filter((l) => hiddenLevels.includes(l)).filter(
                            (l) =>
                              !levelSearch || l.toLowerCase().includes(levelSearch.toLowerCase()),
                          ).length === 0) ||
                          (!showHiddenLevels &&
                            levels.filter(
                              (l) =>
                                !levelSearch || l.toLowerCase().includes(levelSearch.toLowerCase()),
                            ).length === 0)) && (
                          <tr>
                            <td
                              colSpan={3}
                              className="text-center py-16 text-muted-foreground font-medium"
                            >
                              {showHiddenLevels
                                ? "No hidden levels."
                                : "No levels match your search."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* DIALOG: EDIT SCHOOL */}
      <Dialog open={!!editingSchool} onOpenChange={(o) => !o && setEditingSchool(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-secondary">Edit Institution</DialogTitle>
          </DialogHeader>
          {editingSchool && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Institution Name</Label>
                <Input
                  value={editingSchool.name}
                  onChange={(e) => setEditingSchool({ ...editingSchool, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Institution Type</Label>
                <Select
                  value={editingSchool.type}
                  onValueChange={(v: SchoolType) => setEditingSchool({ ...editingSchool, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="University">University</SelectItem>
                    <SelectItem value="Nursing & Midwifery">Nursing & Midwifery</SelectItem>
                    <SelectItem value="College of Education">College of Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editingSchool.type === "University" && (
                <div className="space-y-1.5">
                  <Label>Sub-Type</Label>
                  <Select
                    value={editingSchool.uniType || "Public"}
                    onValueChange={(v: UniType) =>
                      setEditingSchool({ ...editingSchool, uniType: v })
                    }
                  >
                    <SelectTrigger>
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSchool(null)} className="font-bold">
              Cancel
            </Button>
            <Button onClick={saveSchoolEdit} className="font-bold">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: EDIT FACULTY */}
      <Dialog open={!!editingFaculty} onOpenChange={(o) => !o && setEditingFaculty(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-secondary">Edit Faculty</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Faculty Name</Label>
              <Input value={editFacultyVal} onChange={(e) => setEditFacultyVal(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFaculty(null)} className="font-bold">
              Cancel
            </Button>
            <Button onClick={saveFacultyEdit} className="font-bold">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: EDIT PROGRAMME */}
      <Dialog open={!!editingProgramme} onOpenChange={(o) => !o && setEditingProgramme(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-secondary">Edit Programme</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Programme Name</Label>
              <Input
                value={editProgrammeVal}
                onChange={(e) => setEditProgrammeVal(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingProgramme(null)}
              className="font-bold"
            >
              Cancel
            </Button>
            <Button onClick={saveProgrammeEdit} className="font-bold">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: EDIT LEVEL */}
      <Dialog open={!!editingLevel} onOpenChange={(o) => !o && setEditingLevel(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-secondary">Edit Level</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Level Name</Label>
              <Input value={editLevelVal} onChange={(e) => setEditLevelVal(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLevel(null)} className="font-bold">
              Cancel
            </Button>
            <Button onClick={saveLevelEdit} className="font-bold">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  ["School Type", viewingStudent.schoolType || "University"],
                  ["Ownership / Sub-type", viewingStudent.uniType || "N/A"],
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
              {isEditingExisting ? `Edit Profile: ${editingStudent?.fullName}` : "Add New Student"}
            </DialogTitle>
          </DialogHeader>

          {editingStudent && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid sm:grid-cols-3 gap-4">
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
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, email: e.target.value })
                    }
                    disabled={isEditingExisting}
                    className={isEditingExisting ? "bg-slate-100 cursor-not-allowed" : ""}
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
                      {levels.map((l) => (
                        <SelectItem key={l} value={l}>
                          {["Alumni", "Graduate", "Completed"].includes(l) ? l : `Level ${l}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
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
                <div className="space-y-1.5">
                  <Label>School Type</Label>
                  <Select
                    value={editingStudent.schoolType || "University"}
                    onValueChange={(v) => setEditingStudent({ ...editingStudent, schoolType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="Nursing & Midwifery">Nursing & Midwifery</SelectItem>
                      <SelectItem value="College of Education">College of Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                      {faculties.map((f: string) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                      {programmes.map((p: string) => (
                        <SelectItem key={p} value={p}>
                          {p}
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

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Ownership / Sub-type</Label>
                  <Select
                    value={editingStudent.uniType || "Public"}
                    onValueChange={(v) => setEditingStudent({ ...editingStudent, uniType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={editingStudent.dob || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, dob: e.target.value })}
                  />
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
              {isEditingExisting ? "Save Modifications" : "Register Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: RESET PASSWORD */}
      <Dialog
        open={!!resetPasswordStudent}
        onOpenChange={(o) => !o && setResetPasswordStudent(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-secondary flex items-center gap-2">
              <Key className="h-5 w-5 text-amber-500" /> Reset Password
            </DialogTitle>
          </DialogHeader>
          {resetPasswordStudent && (
            <div className="space-y-4 py-2 text-xs">
              <p className="text-sm text-muted-foreground">
                Reset password for student <strong>{resetPasswordStudent.fullName}</strong> (
                {resetPasswordStudent.email}).
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="newPassword"
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const rand = "TN-" + Math.floor(100000 + Math.random() * 900000);
                      setNewPassword(rand);
                    }}
                    className="font-bold shrink-0"
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  At least 8 characters. You can click Generate to create a temporary password.
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setResetPasswordStudent(null)}
              className="font-bold"
            >
              Cancel
            </Button>
            <Button onClick={handleResetPassword} className="font-bold">
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: SEND MESSAGE */}
      <Dialog open={!!messagingStudent} onOpenChange={(o) => !o && setMessagingStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-secondary flex items-center gap-2">
              <Mail className="h-5 w-5 text-sky-500" /> Send Message
            </DialogTitle>
          </DialogHeader>
          {messagingStudent && (
            <div className="space-y-4 py-2 text-xs">
              <p className="text-sm text-muted-foreground">
                Send a message to <strong>{messagingStudent.fullName}</strong>.
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="channel">Delivery Method</Label>
                <Select
                  value={messageChannel}
                  onValueChange={(v: "email" | "sms" | "both") => setMessageChannel(v)}
                >
                  <SelectTrigger id="channel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Only ({messagingStudent.email})</SelectItem>
                    <SelectItem value="sms">SMS Only ({messagingStudent.phone})</SelectItem>
                    <SelectItem value="both">Both Email and SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(messageChannel === "email" || messageChannel === "both") && (
                <div className="space-y-1.5">
                  <Label htmlFor="msgSubject">Email Subject</Label>
                  <Input
                    id="msgSubject"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    placeholder="Enter email subject"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="msgBody">Message Content</Label>
                <textarea
                  id="msgBody"
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setMessagingStudent(null)}
              className="font-bold"
              disabled={isSendingMessage}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!messagingStudent) return;
                if (!messageBody.trim()) {
                  toast.error("Message content is required");
                  return;
                }
                setIsSendingMessage(true);
                try {
                  await sendMessageAdmin({
                    email: messagingStudent.email,
                    phone: messagingStudent.phone,
                    subject: messageSubject.trim(),
                    message: messageBody.trim(),
                    channel: messageChannel,
                  });
                  toast.success("Message dispatched successfully!");
                  setMessagingStudent(null);
                } catch (error: any) {
                  toast.error(error.message || "Failed to send message");
                } finally {
                  setIsSendingMessage(false);
                }
              }}
              className="font-bold"
              disabled={isSendingMessage}
            >
              {isSendingMessage ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
