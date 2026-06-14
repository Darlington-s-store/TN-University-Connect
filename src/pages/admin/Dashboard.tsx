import { Users, GraduationCap, UserPlus, Activity, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getStudents, UNIVERSITIES } from "@/lib/data";
import { useAuth } from "@/lib/auth";

export default function AdminDashboard() {
  const { user } = useAuth();
  const students = getStudents();
  const uniques = new Set(students.map((s) => s.university));

  const stats = [
    {
      label: "Total Students",
      value: students.length,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Universities",
      value: uniques.size,
      icon: GraduationCap,
      color: "text-ghana-red",
      bg: "bg-ghana-red/10",
    },
    {
      label: "New This Month",
      value: students.filter((s) => +new Date(s.submittedAt) > Date.now() - 30 * 86400000).length,
      icon: UserPlus,
      color: "text-accent-foreground",
      bg: "bg-accent/30",
    },
    {
      label: "Active Members",
      value: students.length + 4,
      icon: Activity,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
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
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-secondary">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm">
          Welcome back, {user?.name}. Here's what's happening today.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`h-12 w-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}
                >
                  <s.icon className="h-6 w-6" />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-medium"
                >
                  +12%
                </Badge>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{s.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-secondary text-lg">Registration Trends</h3>
                <p className="text-sm text-muted-foreground">
                  Student registrations over the past 6 months
                </p>
              </div>
              <Button variant="outline" size="sm">
                Download Report
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="students" fill="#006B2D" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-bold text-secondary text-lg mb-1">By University</h3>
            <p className="text-sm text-muted-foreground mb-6">Top member institutions</p>
            <div className="relative h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byUni}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    innerRadius={60}
                    paddingAngle={5}
                  >
                    {byUni.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{students.length}</div>
                  <div className="text-[10px] uppercase text-muted-foreground font-semibold">
                    Total
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {byUni.slice(0, 3).map((u, i) => (
                <div key={u.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: COLORS[i] }}
                    ></div>
                    <span className="text-muted-foreground truncate max-w-[120px]">{u.name}</span>
                  </div>
                  <span className="font-semibold text-secondary">{u.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b flex items-center justify-between bg-white">
            <h3 className="font-bold text-secondary text-lg">Recent Students</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/5"
            >
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground bg-muted/30">
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">University</th>
                  <th className="px-6 py-3 font-semibold">Department</th>
                  <th className="px-6 py-3 font-semibold">Submitted</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-secondary">{s.fullName}</td>
                    <td className="px-6 py-4 text-muted-foreground">{s.university}</td>
                    <td className="px-6 py-4 text-muted-foreground">{s.department}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(s.submittedAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Verified
                      </Badge>
                    </td>
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
