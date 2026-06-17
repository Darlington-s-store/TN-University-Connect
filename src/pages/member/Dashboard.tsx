import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  FileText,
  Megaphone,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building,
  GraduationCap,
  Sun,
  CloudSun,
  Moon,
  ShieldCheck,
  ChevronRight,
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

  const getCategoryBadge = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("academic") || cat.includes("school")) {
      return (
        <Badge variant="outline" className="border-ghana-green text-ghana-green bg-ghana-green/5 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {category}
        </Badge>
      );
    }
    if (cat.includes("career") || cat.includes("job") || cat.includes("internship")) {
      return (
        <Badge variant="outline" className="border-deep-navy text-deep-navy bg-deep-navy/5 text-[10px] font-bold px-2 py-0.5 rounded-full dark:border-blue-400 dark:text-blue-400 dark:bg-blue-400/10">
          {category}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-accent text-accent-foreground bg-accent/5 text-[10px] font-bold px-2 py-0.5 rounded-full">
        {category}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-2">
        <div className="h-24 bg-muted rounded-2xl w-2/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-muted rounded-2xl" />
            <div className="h-48 bg-muted rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-muted rounded-2xl" />
            <div className="h-40 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 overflow-x-hidden font-sans pb-10"
    >
      {/* 1. Welcoming Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-ghana-green animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Member Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-secondary dark:text-foreground flex items-center gap-2 font-display">
            {greeting}, {user?.name?.split(" ")[0]}!
            <GreetingIcon className="h-7 w-7 text-accent animate-bounce" style={{ animationDuration: "3s" }} />
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Here's your consolidated portal for announcements, professional insights, and verification tasks.
          </p>
        </div>
        
        {profileComplete && (
          <div className="flex items-center gap-2.5 bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2 text-primary self-start md:self-auto shadow-sm">
            <ShieldCheck className="h-5 w-5 text-ghana-green shrink-0" />
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-ghana-green">Verified Student</div>
              <div className="text-[10px] text-muted-foreground font-medium">{user?.university || "TN Network"} Member</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* 2. Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Consumption & Updates Feed (Spans 2 columns on desktop) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Announcements */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-ghana-red/10 text-ghana-red">
                  <Megaphone className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-secondary dark:text-foreground font-display">Official Network Announcements</h2>
              </div>
              <Button asChild size="sm" variant="ghost" className="text-xs text-primary font-bold hover:bg-primary/5">
                <Link to="/announcements" className="flex items-center gap-1">
                  View All <ChevronRight className="h-4.5 w-4.5" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4">
              {announcements.length === 0 ? (
                <Card className="border border-dashed p-6 text-center text-muted-foreground">
                  <CardContent className="pt-6">
                    <p>No active announcements posted recently.</p>
                  </CardContent>
                </Card>
              ) : (
                announcements.map((a) => {
                  const markRead = () => {
                    const stored = localStorage.getItem("tnu_read_announcements");
                    const currentIds = stored ? JSON.parse(stored) : [];
                    if (!currentIds.includes(a.id)) {
                      const next = [...currentIds, a.id];
                      localStorage.setItem("tnu_read_announcements", JSON.stringify(next));
                    }
                  };

                  return (
                    <motion.div
                      key={a.id}
                      whileHover={{ y: -3, scale: 1.005 }}
                      className="group"
                    >
                      <Link
                        to={`/announcements/${a.id}`}
                        onClick={markRead}
                        className="block bg-card border hover:border-primary/45 p-4 rounded-xl shadow-sm hover:shadow-soft transition-smooth relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-ghana-red group-hover:w-1.5 transition-all" />
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getCategoryBadge(a.category)}
                            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                        <h3 className="font-semibold text-secondary dark:text-foreground group-hover:text-primary transition-colors pr-6 font-display">
                          {a.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {a.excerpt || "Click to read full announcement detail..."}
                        </p>
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Section: Blogs */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-secondary dark:text-foreground font-display">Professional Insights & Blogs</h2>
              </div>
              <Button asChild size="sm" variant="ghost" className="text-xs text-primary font-bold hover:bg-primary/5">
                <Link to="/blog" className="flex items-center gap-1">
                  View All <ChevronRight className="h-4.5 w-4.5" />
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {blogs.length === 0 ? (
                <Card className="border border-dashed p-6 text-center text-muted-foreground col-span-2">
                  <CardContent className="pt-6">
                    <p>No blog posts published yet.</p>
                  </CardContent>
                </Card>
              ) : (
                blogs.map((b) => (
                  <motion.div
                    key={b.id}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="flex flex-col h-full"
                  >
                    <Link
                      to={`/blog/${b.id}`}
                      className="flex flex-col justify-between h-full bg-card border hover:border-primary/45 p-4 rounded-xl shadow-sm hover:shadow-soft transition-smooth"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-primary">{b.category}</span>
                          <span className="text-[10px] text-muted-foreground font-medium">By {b.author}</span>
                        </div>
                        <h3 className="font-semibold text-secondary dark:text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors font-display">
                          {b.title}
                        </h3>
                      </div>
                      <div className="mt-4 pt-3 border-t border-muted/70 flex items-center justify-between text-xs font-semibold text-primary">
                        <span>Read Article</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Sidebar (Actions, Profile & Progress) */}
        <div className="space-y-6">
          
          {/* Action Center Widget */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-elegant overflow-hidden bg-card relative">
              <div className="h-1.5 flag-stripe" />
              <CardContent className="p-6 space-y-5">
                
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-secondary dark:text-foreground text-md font-display">Onboarding Status</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {profileComplete 
                        ? "Your account verification is fully verified." 
                        : "Verify your details to gain access to features."}
                    </p>
                  </div>
                  <span className="text-2xl font-black text-primary tracking-tight font-display">{progress}%</span>
                </div>

                {/* Custom Progress Bar */}
                <div className="space-y-1.5">
                  <Progress value={progress} className="h-2.5 rounded-full" />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    <span>Incomplete</span>
                    <span>Fully Verified</span>
                  </div>
                </div>

                {/* Subtasks (Interactive UX checkmarks) to prevent overload */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2.5 text-xs">
                    <CheckCircle2 className="h-4.5 w-4.5 text-ghana-green shrink-0" />
                    <span className="text-secondary dark:text-muted-foreground font-medium">Basic profile registered</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    {user?.university && user?.department ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-ghana-green shrink-0" />
                    ) : (
                      <div className="h-4.5 w-4.5 rounded-full border border-dashed border-muted-foreground/50 shrink-0" />
                    )}
                    <span className={`${user?.university && user?.department ? "text-secondary dark:text-muted-foreground font-medium" : "text-muted-foreground font-normal"}`}>
                      University & department added
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    {myStudent ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-ghana-green shrink-0" />
                    ) : (
                      <div className="h-4.5 w-4.5 rounded-full border border-dashed border-muted-foreground/50 shrink-0" />
                    )}
                    <span className={`${myStudent ? "text-secondary dark:text-muted-foreground font-medium" : "text-muted-foreground font-normal"}`}>
                      Student validation form
                    </span>
                  </div>
                </div>

                {/* Contextual actions */}
                {!profileComplete ? (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button asChild size="sm" variant="default" className="text-xs font-semibold py-4 h-auto shadow-sm">
                      <Link to="/profile">Edit Profile</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="text-xs font-semibold py-4 h-auto">
                      <Link to="/student-info">Submit Info</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <div className="text-xs bg-ghana-green/5 border border-ghana-green/10 rounded-xl p-3 text-secondary dark:text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1 font-bold text-ghana-green text-[11px] uppercase tracking-wider">
                        <GraduationCap className="h-4 w-4" /> Academic Records
                      </div>
                      <div className="text-[11px] font-medium truncate leading-normal">
                        Uni: <span className="font-semibold text-secondary dark:text-foreground">{user?.university}</span>
                      </div>
                      <div className="text-[11px] font-medium truncate leading-normal">
                        Dept: <span className="font-semibold text-secondary dark:text-foreground">{user?.department}</span>
                      </div>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-extrabold">
              Quick Shortcuts
            </h3>
            
            <div className="bg-card border rounded-xl divide-y divide-muted/70 overflow-hidden shadow-sm">
              <Link to="/profile" className="flex items-center justify-between p-3.5 hover:bg-muted/40 transition-smooth group text-xs text-secondary dark:text-foreground font-semibold">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <span>Modify Account Settings</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link to="/student-info" className="flex items-center justify-between p-3.5 hover:bg-muted/40 transition-smooth group text-xs text-secondary dark:text-foreground font-semibold">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <span>Academic Verification Form</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Verification Status Alert card */}
          {!profileComplete && (
            <motion.div variants={itemVariants}>
              <Card className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl overflow-hidden shadow-sm">
                <CardContent className="p-4 flex gap-3.5">
                  <AlertCircle className="h-5.5 w-5.5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-300 font-display">Verification Required</div>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400/90 leading-relaxed font-medium">
                      Please upload your academic detail card or register your student email address to fully unlock student channels and graduation networks.
                    </p>
                    <Link to="/student-info" className="text-[11px] text-amber-600 dark:text-amber-400 hover:text-amber-800 font-extrabold inline-flex items-center gap-0.5 mt-1 hover:underline">
                      Verify Academic Details <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

        </div>

      </div>
    </motion.div>
  );
}
