import type { ReactElement } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { GoogleProvider } from "@/lib/google";
import Preloader from "@/components/Preloader";
import BreakingNewsOverlay from "@/components/BreakingNewsOverlay";
import PageTransition from "@/components/PageTransition";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./App.css";

import PublicLayout from "@/components/layout/PublicLayout";
import MemberLayout from "@/components/layout/MemberLayout";
import AdminLayout from "@/components/layout/AdminLayout";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Announcements from "@/pages/Announcements";
import AnnouncementDetail from "@/pages/AnnouncementDetail";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

import Login from "@/pages/auth/Login";
import AdminLogin from "@/pages/auth/AdminLogin";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

import MemberDashboard from "@/pages/member/Dashboard";
import MemberProfile from "@/pages/member/Profile";
import StudentForm from "@/pages/member/StudentForm";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminStudents from "@/pages/admin/Students";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminAnnouncements from "@/pages/admin/Announcements";
import AdminBlog from "@/pages/admin/Blog";
import AdminMessages from "@/pages/admin/Messages";
import AdminSettings from "@/pages/admin/Settings";

const queryClient = new QueryClient();

function RequireAuth({ children, role }: { children: ReactElement; role?: "admin" | "member" }) {
  const { user, initializing } = useAuth();
  if (initializing) return null;
  if (!user) return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />;
  if (role === "admin" && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GoogleProvider>
            <TooltipProvider>
              <Preloader />
              <BrowserRouter>
                <BreakingNewsOverlay />
                <Routes>
                  {/* Public */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/announcements" element={<Announcements />} />
                    <Route path="/announcements/:id" element={<AnnouncementDetail />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    <Route path="/contact" element={<Contact />} />
                  </Route>

                  {/* Auth */}
                  <Route
                    path="/login"
                    element={
                      <PageTransition>
                        <Login defaultTab="login" />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/admin/login"
                    element={
                      <PageTransition>
                        <AdminLogin />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PageTransition>
                        <Login defaultTab="register" />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PageTransition>
                        <ForgotPassword />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <PageTransition>
                        <ResetPassword />
                      </PageTransition>
                    }
                  />

                  {/* Member */}
                  <Route
                    element={
                      <RequireAuth>
                        <MemberLayout />
                      </RequireAuth>
                    }
                  >
                    <Route path="/dashboard" element={<MemberDashboard />} />
                    <Route path="/profile" element={<MemberProfile />} />
                    <Route path="/student-info" element={<StudentForm />} />
                  </Route>

                  {/* Admin */}
                  <Route
                    element={
                      <RequireAuth role="admin">
                        <AdminLayout />
                      </RequireAuth>
                    }
                  >
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/students" element={<AdminStudents />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                    <Route path="/admin/blog" element={<AdminBlog />} />
                    <Route path="/admin/messages" element={<AdminMessages />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Route>

                  <Route
                    path="*"
                    element={
                      <PageTransition>
                        <NotFound />
                      </PageTransition>
                    }
                  />
                </Routes>
                <Toaster richColors position="top-right" />
              </BrowserRouter>
            </TooltipProvider>
          </GoogleProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
