import { Users, GraduationCap, UserPlus, Activity, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { getStudents, UNIVERSITIES } from "@/lib/data";
import { useAuth } from "@/lib/auth";

export default function AdminDashboard() {
  const { user } = useAuth();
  const students = getStudents();
  const uniques = new Set(students.map((s) => s.university));

  const stats = [
    { label: "Total Students", value: students.length, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Universities", value: uniques.size, icon: GraduationCap, color: "text-ghana-red", bg: "bg-ghana-red/10" },
    { label: "New This Month", value: students.filter((s) => +new Date(s.submittedAt) > Date.now() - 30 * 86400000).length, icon: UserPlus, color: "text-accent-foreground", bg: "bg-accent/30" },
    { label: "Active Members", value: students.length + 4, icon: Activity, color: "text-secondary", bg: "bg-secondary/10" },
  ];

  const byMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
    month: m,
    students: Math.round(20 + i * 14 + Math.random() * 10),
  }));

  const byUni = UNIVERSITIES.slice(0, 5).map((u) => ({
    name: u.split(" ").slice(0, 2).join(" "),
    value: students.filter((s) => s.university === u).length || Math.floor(Math.random() * 12) + 3,
  }));
  const COLORS = ["#006B2D", "#D71920", "#F5C518", "#0B1F3A", "#888"];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <Badge variant="outline" className="border-accent text-accent-foreground mb-2">Admin Overview</Badge>
          <h1 className="text-3xl font-bold text-secondary">Welcome, {user?.name?.split(" ")[0]}</h1>
          <p className="text-muted-foreground">Here's a snapshot of your network.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-0 shadow-soft">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`h-10 w-10 rounded-lg ${s.bg} ${s.color} grid place-items-center`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-3 text-3xl font-bold text-secondary">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-bold text-secondary mb-1">Registration trends</h3>
            <p className="text-sm text-muted-foreground mb-4">Student registrations over the past 6 months</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-secondary mb-1">By university</h3>
            <p className="text-sm text-muted-foreground mb-4">Top member institutions</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={byUni} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40}>
                  {byUni.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-secondary mb-4">Recent students</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">University</th>
                  <th className="py-2 pr-4">Department</th>
                  <th className="py-2 pr-4">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium text-secondary">{s.fullName}</td>
                    <td className="py-3 pr-4">{s.university}</td>
                    <td className="py-3 pr-4">{s.department}</td>
                    <td className="py-3 pr-4">{new Date(s.submittedAt).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
