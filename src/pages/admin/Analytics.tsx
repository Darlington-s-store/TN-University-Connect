import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import {
  FileDown,
  FileSpreadsheet,
  FileText as FileIcon,
  Download,
  Trash2,
  BarChart2,
} from "lucide-react";
import { getStudents, UNIVERSITIES, DEPARTMENTS } from "@/lib/data";

const COLORS = ["#006B2D", "#D71920", "#F5C518", "#0B1F3A", "#888", "#5cbdb9", "#c44569"];

type HistItem = { id: string; type: string; format: string; date: string };

function AdminAnalytics() {
  const students = getStudents();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "visuals";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  // Reports state & logic
  const [type, setType] = useState("students");
  const [format, setFormat] = useState("csv");
  const [history, setHistory] = useState<HistItem[]>([
    {
      id: "h1",
      type: "students",
      format: "csv",
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "h2",
      type: "universities",
      format: "pdf",
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ]);

  const generate = () => {
    const data = getStudents();
    if (format === "csv") {
      const headers = [
        "fullName",
        "email",
        "phone",
        "gender",
        "university",
        "department",
        "program",
        "level",
        "indexNumber",
      ];
      const rows = [
        headers.join(","),
        ...data.map((s) =>
          headers
            .map(
              (h) =>
                `"${(s as unknown as Record<string, string | number | undefined | null>)[h] ?? ""}"`,
            )
            .join(","),
        ),
      ].join("\n");
      const blob = new Blob([rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${type}-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "json" || format === "excel") {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${type}-${Date.now()}.${format === "excel" ? "xlsx.json" : "json"}`;
      a.click();
    } else {
      window.print();
    }
    toast.success(`Generated ${type} report (${format.toUpperCase()})`);
    setHistory([
      { id: `h-${Date.now()}`, type, format, date: new Date().toISOString() },
      ...history,
    ]);
  };

  // Analytics charts logic
  const trend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
    month: m,
    registrations: Math.round(15 + i * 12 + Math.random() * 8),
    active: Math.round(40 + i * 18 + Math.random() * 10),
  }));

  const gender = ["male", "female", "other"].map((g) => ({
    name: g.charAt(0).toUpperCase() + g.slice(1),
    value:
      students.filter((s) => s.gender === g).length || (g === "male" ? 3 : g === "female" ? 2 : 0),
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
        <Badge variant="outline" className="border-accent text-accent-foreground mb-2">
          Analytics
        </Badge>
        <h1 className="text-3xl font-bold text-secondary">Analytics & Reports</h1>
        <p className="text-muted-foreground">
          Explore network growth graphics or export custom student database reports.
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-fit">
          <TabsTrigger value="visuals" className="rounded-lg font-bold gap-2">
            <BarChart2 className="h-4 w-4" /> Charts & Visuals
          </TabsTrigger>
          <TabsTrigger value="reports" className="rounded-lg font-bold gap-2">
            <FileIcon className="h-4 w-4" /> Export & Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visuals" className="space-y-6 outline-none">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-secondary mb-1">Registration & engagement trends</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Monthly student registrations vs active members
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="registrations"
                    stroke="#006B2D"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#D71920"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
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
                      {gender.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
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
        </TabsContent>

        <TabsContent value="reports" className="space-y-6 outline-none">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-bold text-secondary">Generate a new report</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Report type</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="students">Student registrations</SelectItem>
                        <SelectItem value="universities">University distribution</SelectItem>
                        <SelectItem value="departments">Department distribution</SelectItem>
                        <SelectItem value="activity">Activity summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { f: "pdf", label: "PDF", icon: FileIcon },
                    { f: "excel", label: "Excel", icon: FileSpreadsheet },
                    { f: "csv", label: "CSV", icon: FileDown },
                  ].map((o) => (
                    <button
                      key={o.f}
                      onClick={() => setFormat(o.f)}
                      className={`p-4 rounded-lg border-2 text-left transition-smooth cursor-pointer ${format === o.f ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    >
                      <o.icon
                        className={`h-6 w-6 mb-2 ${format === o.f ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <div className="font-medium text-secondary">{o.label}</div>
                    </button>
                  ))}
                </div>

                <Button size="lg" onClick={generate}>
                  <Download className="h-4 w-4" /> Generate & download
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-secondary mb-4">Download history</h3>
                <div className="space-y-2">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between p-3 rounded-md bg-muted/40"
                    >
                      <div>
                        <div className="font-medium text-secondary text-sm capitalize">
                          {h.type}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(h.date).toLocaleString("en-GB")} · {h.format.toUpperCase()}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setHistory(history.filter((x) => x.id !== h.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No downloads yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default AdminAnalytics;
