import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Megaphone,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sun,
  CloudSun,
  Moon,
  ShieldCheck,
  GraduationCap,
  FileText,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import {
  getAnnouncements,
  getBlogs,
  getStudentMe,
  Announcement,
  BlogPost,
  Student,
} from "@/lib/data";

export default function MemberDashboard() {
  const { user } = useAuth();
  const [myStudent, setMyStudent] = useState<Student | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Welcome back");
  const [GreetingIcon, setGreetingIcon] = useState(() => CloudSun);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
      setGreetingIcon(() => Sun);
    } else if (hour < 18) {
      setGreeting("Good afternoon");
      setGreetingIcon(() => CloudSun);
    } else {
      setGreeting("Good evening");
      setGreetingIcon(() => Moon);
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [student, annList, blogList] = await Promise.all([
          getStudentMe(),
          getAnnouncements(),
          getBlogs(),
        ]);
        setMyStudent(student);
        setAnnouncements(annList.filter((a) => a.published).slice(0, 3));
        setBlogs(blogList.filter((b) => b.published).slice(0, 2));
      } catch (err) {
        console.error("Failed to load member dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const profileComplete = !!(user?.university && user?.department && user?.phone && myStudent);
  const progress =
    (user?.name ? 25 : 0) +
    (user?.university ? 25 : 0) +
    (user?.department ? 25 : 0) +
    (myStudent ? 25 : 0);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded-lg w-1/2" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary dark:text-foreground flex items-center gap-2">
            {greeting}, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Catch up on announcements and manage your profile.
          </p>
        </div>
        {profileComplete && (
          <div className="flex items-center gap-2 text-xs text-ghana-green bg-ghana-green/10 px-3 py-1.5 rounded-lg shrink-0">
            <ShieldCheck className="h-4 w-4" />
            <span className="font-semibold">Verified Student</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-secondary dark:text-foreground flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-ghana-red" />
                Announcements
              </h2>
              <Button asChild size="sm" variant="ghost" className="text-xs h-7">
                <Link to="/announcements">
                  View All <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="space-y-2">
              {announcements.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-6 text-center text-sm text-muted-foreground">
                    No announcements yet.
                  </CardContent>
                </Card>
              ) : (
                announcements.map((a) => (
                  <Link
                    key={a.id}
                    to={`/announcements/${a.id}`}
                    className="block bg-card border rounded-lg p-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 font-semibold">
                        {a.category}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(a.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-secondary dark:text-foreground">
                      {a.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {a.excerpt || "Click to read more..."}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-secondary dark:text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Blog Posts
              </h2>
              <Button asChild size="sm" variant="ghost" className="text-xs h-7">
                <Link to="/blog">
                  View All <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {blogs.length === 0 ? (
                <Card className="border-dashed sm:col-span-2">
                  <CardContent className="py-6 text-center text-sm text-muted-foreground">
                    No blog posts yet.
                  </CardContent>
                </Card>
              ) : (
                blogs.map((b) => (
                  <Link
                    key={b.id}
                    to={`/blog/${b.id}`}
                    className="bg-card border rounded-lg p-4 hover:border-primary/40 transition-colors flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {b.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">By {b.author}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-secondary dark:text-foreground line-clamp-2 flex-1">
                      {b.title}
                    </h3>
                    <div className="mt-3 pt-2 border-t text-xs font-semibold text-primary flex items-center gap-1">
                      Read Article <ArrowUpRightIcon />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-secondary dark:text-foreground">
                    Profile Progress
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {profileComplete ? "All set!" : "Complete your profile"}
                  </p>
                </div>
                <span className="text-xl font-bold text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${user?.name ? "text-ghana-green" : "text-muted-foreground"}`}
                  />
                  <span className={user?.name ? "text-secondary" : "text-muted-foreground"}>
                    Basic profile
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {user?.university && user?.department ? (
                    <CheckCircle2 className="h-4 w-4 text-ghana-green shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-dashed border-muted-foreground shrink-0" />
                  )}
                  <span
                    className={
                      user?.university && user?.department
                        ? "text-secondary"
                        : "text-muted-foreground"
                    }
                  >
                    University & department
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {myStudent ? (
                    <CheckCircle2 className="h-4 w-4 text-ghana-green shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-dashed border-muted-foreground shrink-0" />
                  )}
                  <span className={myStudent ? "text-secondary" : "text-muted-foreground"}>
                    Student verification
                  </span>
                </div>
              </div>
              {!profileComplete ? (
                <div className="flex gap-2 pt-1">
                  <Button asChild size="sm" className="text-xs h-8 flex-1">
                    <Link to="/profile">Edit Profile</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="text-xs h-8 flex-1">
                    <Link to="/student-info">Submit Info</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-xs bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-ghana-green">
                    <GraduationCap className="h-3.5 w-3.5" /> Academic Records
                  </div>
                  <p className="text-muted-foreground">
                    Uni: <span className="font-medium text-secondary">{user?.university}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Dept: <span className="font-medium text-secondary">{user?.department}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-3">
              <div className="divide-y">
                <Link
                  to="/profile"
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors text-xs font-medium"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-primary" />
                    Account Settings
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </Link>
                <Link
                  to="/student-info"
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors text-xs font-medium"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    Verification Form
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {!profileComplete && (
            <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50">
              <CardContent className="p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    Verification Needed
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400/90 mt-0.5">
                    Complete your student verification to unlock all features.
                  </p>
                  <Link
                    to="/student-info"
                    className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5 mt-1"
                  >
                    Verify now <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17l9.2-9.2M17 17V7H7" />
    </svg>
  );
}
