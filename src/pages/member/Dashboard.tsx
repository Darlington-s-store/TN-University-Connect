import { Link } from "react-router-dom";
import {
  User,
  FileText,
  Megaphone,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { getAnnouncements, getBlogs, getStudents } from "@/lib/data";

export default function MemberDashboard() {
  const { user } = useAuth();
  const myStudent = getStudents().find((s) => s.email === user?.email);
  const profileComplete = !!(user?.university && user?.department && user?.phone && myStudent);
  const progress =
    (user?.name ? 25 : 0) +
    (user?.university ? 25 : 0) +
    (user?.department ? 25 : 0) +
    (myStudent ? 25 : 0);

  const announcements = getAnnouncements()
    .filter((a) => a.published)
    .slice(0, 3);
  const blogs = getBlogs().slice(0, 2);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant="outline" className="border-primary text-primary mb-2">
            Member Dashboard
          </Badge>
          <h1 className="text-3xl font-bold text-secondary">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your network today.
          </p>
        </div>
      </div>

      {/* Profile completion */}
      <Card className="border-0 shadow-elegant overflow-hidden">
        <div className="h-1 flag-stripe" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-bold text-secondary">Profile completion</h3>
              <p className="text-sm text-muted-foreground">
                {profileComplete
                  ? "Your profile is fully complete."
                  : "Complete your profile to unlock all features."}
              </p>
            </div>
            <div className="text-3xl font-bold text-primary">{progress}%</div>
          </div>
          <Progress value={progress} className="mt-4" />
          {!profileComplete && (
            <div className="flex gap-2 mt-4">
              <Button asChild size="sm">
                <Link to="/profile">Edit profile</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/student-info">Complete student form</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-3">
          Quick actions
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              to: "/profile",
              icon: User,
              title: "Edit Profile",
              desc: "Update your details and avatar",
            },
            {
              to: "/student-info",
              icon: FileText,
              title: "Student Info",
              desc: "Submit academic details",
            },
            {
              to: "/announcements",
              icon: Megaphone,
              title: "View Announcements",
              desc: "Latest network updates",
            },
          ].map((a) => (
            <Card key={a.to} className="hover:shadow-elegant transition-smooth">
              <CardContent className="p-5">
                <a.icon className="h-8 w-8 text-primary mb-3" />
                <div className="font-semibold text-secondary">{a.title}</div>
                <div className="text-sm text-muted-foreground mb-3">{a.desc}</div>
                <Link
                  to={a.to}
                  className="text-sm text-primary font-medium inline-flex items-center gap-1"
                >
                  Open <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-secondary flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-ghana-red" /> Announcements
              </h3>
              <Button asChild size="sm" variant="ghost">
                <Link to="/announcements">All</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {announcements.map((a) => {
                const markRead = () => {
                  const stored = localStorage.getItem("tnu_read_announcements");
                  const currentIds = stored ? JSON.parse(stored) : [];
                  if (!currentIds.includes(a.id)) {
                    const next = [...currentIds, a.id];
                    localStorage.setItem("tnu_read_announcements", JSON.stringify(next));
                  }
                };
                return (
                  <Link
                    key={a.id}
                    to={`/announcements/${a.id}`}
                    onClick={markRead}
                    className="block p-3 rounded-md border hover:border-primary hover:bg-muted/40 transition-smooth"
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      {a.category} · {new Date(a.date).toLocaleDateString("en-GB")}
                    </div>
                    <div className="font-medium text-secondary">{a.title}</div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-secondary flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Latest Blog Posts
              </h3>
              <Button asChild size="sm" variant="ghost">
                <Link to="/blog">All</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {blogs.map((b) => (
                <Link
                  key={b.id}
                  to={`/blog/${b.id}`}
                  className="block p-3 rounded-md border hover:border-primary hover:bg-muted/40 transition-smooth"
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {b.category} · {b.author}
                  </div>
                  <div className="font-medium text-secondary">{b.title}</div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card
        className={myStudent ? "bg-primary/5 border-primary/20" : "bg-accent/10 border-accent/30"}
      >
        <CardContent className="p-6 flex items-start gap-4">
          {myStudent ? (
            <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
          ) : (
            <AlertCircle className="h-6 w-6 text-accent-foreground shrink-0" />
          )}
          <div className="flex-1">
            <div className="font-semibold text-secondary">
              {myStudent ? "Student information submitted" : "Submit your student information"}
            </div>
            <div className="text-sm text-muted-foreground">
              {myStudent
                ? `Submitted on ${new Date(myStudent.submittedAt).toLocaleDateString("en-GB")}.`
                : "Help us build a complete picture of our network."}
            </div>
          </div>
          <Button asChild>
            <Link to="/student-info">{myStudent ? "View / Edit" : "Submit now"}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
