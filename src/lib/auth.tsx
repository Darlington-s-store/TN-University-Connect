import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  avatar?: string;
  university?: string;
  department?: string;
  phone?: string;
  bio?: string;
  joinedAt: string;
  profileComplete?: boolean;
};

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "tnu_user";
const USERS_KEY = "tnu_users";

function readUsers(): Array<User & { password: string }> {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw);
  // seed default admin
  const seed: Array<User & { password: string }> = [
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
      university: "University of Ghana",
      department: "Computer Science",
      joinedAt: new Date().toISOString(),
      profileComplete: true,
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  return seed;
}

function writeUsers(u: Array<User & { password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    readUsers();
    const raw = localStorage.getItem(KEY);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login: AuthCtx["login"] = async (email, password) => {
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const { password: _p, ...safe } = found;
    setUser(safe);
    localStorage.setItem(KEY, JSON.stringify(safe));
    return safe;
  };

  const register: AuthCtx["register"] = async ({ name, email, password }) => {
    const users = readUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with that email already exists");
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: "member" as const,
      joinedAt: new Date().toISOString(),
      profileComplete: false,
    };
    users.push(newUser);
    writeUsers(users);
    const { password: _p, ...safe } = newUser;
    setUser(safe);
    localStorage.setItem(KEY, JSON.stringify(safe));
    return safe;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY);
  };

  const updateUser: AuthCtx["updateUser"] = (patch) => {
    setUser((prev) => {
      if (!prev) return prev;
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

  return <Ctx.Provider value={{ user, login, register, logout, updateUser }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
