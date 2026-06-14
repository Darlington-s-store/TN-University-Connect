/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  avatar?: string;
  university?: string;
  schoolType?: string;
  uniType?: string;
  faculty?: string;
  department?: string;
  program?: string;
  level?: string;
  status?: string;
  church?: string;
  niche?: string;
  phone?: string;
  bio?: string;
  joinedAt: string;
  profileComplete?: boolean;
  gender?: string;
  nationality?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  phone: string;
  gender: string;
  nationality: string;
  school: string;
  schoolType: string;
  uniType?: string;
  faculty: string;
  department: string;
  program: string;
  level: string;
  status: string;
  church: string;
  niche?: string;
}

type AuthCtx = {
  user: User | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "tnu_user";
const USERS_KEY = "tnu_users";

function readUsers(): Array<User & { password?: string }> {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw);

  // seed default admin and user
  const seed: Array<User & { password?: string }> = [
    {
      id: "admin-1",
      name: "TN Admin",
      email: "admin@tnuc.gh",
      password: "admin123",
      role: "admin",
      joinedAt: new Date().toISOString(),
      profileComplete: true,
    },
    {
      id: "user-1",
      name: "Kwame Mensah",
      email: "kwame@tnuc.gh",
      password: "member123",
      role: "member",
      phone: "+233 24 123 4567",
      gender: "male",
      nationality: "Ghanaian",
      university: "University of Ghana (UG) - Legon",
      schoolType: "University",
      uniType: "Public",
      faculty: "Faculty of Science",
      department: "Computer Science & IT",
      program: "BSc Computer Science",
      level: "300",
      status: "Active Student",
      church: "Pentecost Church",
      niche: "Tech & STEM Enthusiasts",
      joinedAt: new Date().toISOString(),
      profileComplete: true,
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  return seed;
}

function writeUsers(u: Array<User & { password?: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    readUsers();
    const raw = localStorage.getItem(KEY);
    if (raw) setUser(JSON.parse(raw));
    setInitializing(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const users = readUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) throw new Error("Invalid email or password");
    const { password: _p, ...safe } = found;
    setUser(safe);
    localStorage.setItem(KEY, JSON.stringify(safe));
    return safe;
  };

  const register = async (data: RegisterData): Promise<User> => {
    const users = readUsers();
    if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error("An account with that email already exists");
    }
    const newUser: User & { password?: string } = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: "member" as const,
      joinedAt: new Date().toISOString(),
      profileComplete: true,
      phone: data.phone,
      gender: data.gender,
      nationality: data.nationality,
      university: data.school,
      schoolType: data.schoolType,
      uniType: data.uniType,
      faculty: data.faculty,
      department: data.department,
      program: data.program,
      level: data.level,
      status: data.status,
      church: data.church,
      niche: data.niche || "General Studies",
    };
    users.push(newUser);
    writeUsers(users);

    // Also write to tnu_students so it appears there
    const studentsRaw = localStorage.getItem("tnu_students");
    const students = studentsRaw ? JSON.parse(studentsRaw) : [];
    const newStudent = {
      id: `s-${Date.now()}`,
      userId: newUser.id,
      fullName: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      gender: newUser.gender,
      dob: new Date().toISOString().slice(0, 10), // placeholder DOB
      university: newUser.university,
      department: newUser.department,
      program: newUser.program,
      level: newUser.level,
      indexNumber: `STU${Math.floor(100000 + Math.random() * 900000)}`,
      address: "Accra, Ghana",
      submittedAt: new Date().toISOString(),
      nationality: newUser.nationality,
      status: newUser.status,
      church: newUser.church,
      niche: newUser.niche,
    };
    students.push(newStudent);
    localStorage.setItem("tnu_students", JSON.stringify(students));

    const { password: _p, ...safe } = newUser;
    setUser(safe);
    localStorage.setItem(KEY, JSON.stringify(safe));
    return safe;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY);
  };

  const updateUser = (patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...patch };
      localStorage.setItem(KEY, JSON.stringify(next));
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === prev.id);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...patch };
        writeUsers(users);
      }
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ user, initializing, login, register, logout, updateUser }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
