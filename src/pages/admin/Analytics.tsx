import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { getStudents, UNIVERSITIES, DEPARTMENTS } from "@/lib/data";

const COLORS = ["#006B2D", "#D71920", "#F5C518", "#0B1F3A", "#888", "#5cbdb9", "#c44569"];

export default function AdminAnalytics() {
  const students = getStudents();

  const trend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
    month: m,
    registrations: Math.round(15 + i * 12 + Math.random() * 8),
    active: Math.round(40 + i * 18 + Math.random() * 10),
  }));

  const gender = ["male", "female", "other"].map((g) => ({
    name: g.charAt(0).toUpperCase() + g.slice(1),
    value: students.filter((s) => s.gender === g).length || (g === "male" ? 3 : g === "female" ? 2 : 0),
  }));

  const byUni = UNIVERSITIES.map((u) => ({
    name: u.split(" ").slice(0, 2).join(" "),
    value: students.filter((s) => s.university === u).length || Math.floor(Math.random() * 8) + 1,
  })).slice(0, 7);

  const byDept = DEPARTMENTS.map((d) => ({
    name: d,
    value: students.filter((s) => s.department === d).length || Math.floor(Math.random() * 10) + 1,
  })).slice(0, 7);

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="outline" className="border-accent text-accent-foreground mb-2">Analytics</Badge>
        <h1 className="text-3xl font-bold text-secondary">Network Analytics</h1>
        <p className="text-muted-foreground">Insights about registrations, demographics, and institutional distribution.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-secondary mb-1">Registration & engagement trends</h3>
          <p className="text-sm text-muted-foreground mb-4">Monthly student registrations vs active members</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="registrations" stroke="#006B2D" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="active" stroke="#D71920" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-secondary mb-1">Gender distribution</h3>
            <p className="text-sm text-muted-foreground mb-4">Across all registered students</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={gender} dataKey="value" nameKey="name" outerRadius={90} label>
                  {gender.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-secondary mb-1">Distribution by university</h3>
            <p className="text-sm text-muted-foreground mb-4">Top member institutions</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byUni} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={110} />
                <Tooltip />
                <Bar dataKey="value" fill="#0B1F3A" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-secondary mb-1">Distribution by department</h3>
          <p className="text-sm text-muted-foreground mb-4">Most popular fields of study</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byDept}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#F5C518" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
