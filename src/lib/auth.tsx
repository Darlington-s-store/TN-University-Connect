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
  avatar?: string;
  gender?: string;
  nationality?: string;
  school?: string;
  schoolType?: string;
  uniType?: string;
  faculty?: string;
  department?: string;
  program?: string;
  level?: string;
  status?: string;
  church?: string;
  niche?: string;
}

export interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

type StoredUser = User & { password?: string };

type AuthCtx = {
  user: User | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  googleLogin: (profile: GoogleProfile) => Promise<User>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, password: string) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);
const USERS_KEY = "tnu_users";
const SESSION_KEY = "tnu_session_user";

// ---- mock store helpers ----
function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return seedUsers();
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : seedUsers();
  } catch {
    return seedUsers();
  }
}
function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function seedUsers(): StoredUser[] {
  const seeded: StoredUser[] = [
    {
      id: "admin-1",
      name: "TN Admin",
      email: "admin@tn.edu.gh",
      password: "admin1234",
      role: "admin",
      joinedAt: new Date().toISOString(),
    },
  ];
  writeUsers(seeded);
  return seeded;
}

function publicUser(u: StoredUser): User {
  const { password: _pw, ...pub } = u;
  return pub;
}

function saveSession(u: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(u));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* noop */
    }
    setInitializing(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const users = readUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!match) throw new Error("Invalid email or password.");
    const pub = publicUser(match);
    saveSession(pub);
    setUser(pub);
    return pub;
  };

  const register = async (data: RegisterData): Promise<User> => {
    const users = readUsers();
    const email = data.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === email)) {
      throw new Error("An account already exists for that email.");
    }
    const newUser: StoredUser = {
      id: `u-${Date.now()}`,
      name: data.name.trim(),
      email,
      password: data.password,
      role: "member",
      phone: data.phone,
      avatar: data.avatar,
      gender: data.gender || "other",
      nationality: data.nationality || "Ghanaian",
      university: data.school || "",
      schoolType: data.schoolType || "",
      uniType: data.uniType || "",
      faculty: data.faculty || "",
      department: data.department || "",
      program: data.program || "",
      level: data.level || "",
      status: data.status || "Active Student",
      church: data.church || "",
      niche: data.niche || "",
      joinedAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);
    const pub = publicUser(newUser);
    saveSession(pub);
    setUser(pub);
    return pub;
  };

  const googleLogin = async (profile: GoogleProfile): Promise<User> => {
    const users = readUsers();
    const email = profile.email.trim().toLowerCase();
    let existing = users.find((u) => u.email.toLowerCase() === email);
    if (!existing) {
      existing = {
        id: `g-${profile.sub}`,
        name: profile.name,
        email,
        avatar: profile.picture,
        role: "member",
        joinedAt: new Date().toISOString(),
      };
      users.push(existing);
      writeUsers(users);
    }
    const pub = publicUser(existing);
    saveSession(pub);
    setUser(pub);
    return pub;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const updateUser = (patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...patch };
      saveSession(next);
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === prev.id);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...patch };
        writeUsers(users);
      }
      return next;
    });
  };

  const forgotPassword = async (email: string): Promise<void> => {
    const users = readUsers();
    if (!users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error("No account found for that email.");
    }
  };

  const resetPassword = async (
    email: string,
    _code: string,
    password: string,
  ): Promise<void> => {
    const users = readUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (idx < 0) throw new Error("No account found for that email.");
    users[idx].password = password;
    writeUsers(users);
  };

  return (
    <Ctx.Provider
      value={{
        user,
        initializing,
        login,
        register,
        googleLogin,
        logout,
        updateUser,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
