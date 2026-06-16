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

export interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

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
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "tnu_token";
const USER_KEY = "tnu_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setInitializing(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setUser(data.user);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          } else {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setUser(null);
          }
        } else {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setUser(null);
        }
      } catch (err) {
        console.error("Session restoration failed:", err);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Invalid credentials.");
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (data: RegisterData): Promise<User> => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok) {
      throw new Error(resData.message || "Registration failed.");
    }

    localStorage.setItem(TOKEN_KEY, resData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(resData.user));
    setUser(resData.user);
    return resData.user;
  };

  const googleLogin = async (profile: GoogleProfile): Promise<User> => {
    const res = await fetch(`${API_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Google sign-in failed.");
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const updateUser = async (patch: Partial<User>) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patch),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Update failed.");
      }

      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
    } catch (err) {
      console.error("Failed to sync user updates:", err);
      setUser((prev) => {
        if (!prev) return null;
        return { ...prev, ...patch };
      });
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to send reset code.");
    }
  };

  const resetPassword = async (email: string, code: string, password: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to reset password.");
    }
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
