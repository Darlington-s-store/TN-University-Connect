import { useState } from "react";
import { toast } from "sonner";
import { FileDown, FileSpreadsheet, FileText as FileIcon, Download, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getStudents } from "@/lib/data";

type HistItem = { id: string; type: string; format: string; date: string };

export default function AdminReports() {
  const [type, setType] = useState("students");
  const [format, setFormat] = useState("csv");
  const [history, setHistory] = useState<HistItem[]>([
    { id: "h1", type: "students", format: "csv", date: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "h2", type: "universities", format: "pdf", date: new Date(Date.now() - 86400000 * 5).toISOString() },
  ]);

  const generate = () => {
    const data = getStudents();
    if (format === "csv") {
      const headers = ["fullName", "email", "phone", "gender", "university", "department", "program", "level", "indexNumber"];
      const rows = [
        headers.join(","),
        ...data.map((s) => headers.map((h) => `"${(s as any)[h] ?? ""}"`).join(",")),
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
      // pdf: print
      window.print();
    }
    toast.success(`Generated ${type} report (${format.toUpperCase()})`);
    setHistory([{ id: `h-${Date.now()}`, type, format, date: new Date().toISOString() }, ...history]);
  };

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="outline" className="border-accent text-accent-foreground mb-2">Reports</Badge>
        <h1 className="text-3xl font-bold text-secondary">Reports</h1>
        <p className="text-muted-foreground">Generate and download reports across the platform.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            <h3 className="font-bold text-secondary">Generate a new report</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Report type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                  className={`p-4 rounded-lg border-2 text-left transition-smooth ${format === o.f ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                >
                  <o.icon className={`h-6 w-6 mb-2 ${format === o.f ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="font-medium text-secondary">{o.label}</div>
                </button>
              ))}
            </div>

            <Button size="lg" onClick={generate}><Download className="h-4 w-4" /> Generate & download</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-secondary mb-4">Download history</h3>
            <div className="space-y-2">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-3 rounded-md bg-muted/40">
                  <div>
                    <div className="font-medium text-secondary text-sm capitalize">{h.type}</div>
                    <div className="text-xs text-muted-foreground">{new Date(h.date).toLocaleString("en-GB")} · {h.format.toUpperCase()}</div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setHistory(history.filter((x) => x.id !== h.id))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              {history.length === 0 && <div className="text-sm text-muted-foreground text-center py-4">No downloads yet.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
