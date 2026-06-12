import { useMemo, useState } from "react";
import { Search, Eye, ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getStudents, UNIVERSITIES, Student } from "@/lib/data";

export default function AdminStudents() {
  const all = getStudents();
  const [q, setQ] = useState("");
  const [uni, setUni] = useState("all");
  const [sort, setSort] = useState<"date" | "name">("date");
  const [open, setOpen] = useState<Student | null>(null);

  const list = useMemo(() => {
    return all
      .filter((s) => (uni === "all" ? true : s.university === uni))
      .filter((s) => `${s.fullName} ${s.email} ${s.indexNumber}`.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => sort === "name" ? a.fullName.localeCompare(b.fullName) : +new Date(b.submittedAt) - +new Date(a.submittedAt));
  }, [all, q, uni, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary">Students</h1>
        <p className="text-muted-foreground">Browse, search, and review all submitted student information.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, email, or index number..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
            <Select value={uni} onValueChange={setUni}>
              <SelectTrigger className="md:w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All universities</SelectItem>
                {UNIVERSITIES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSort(sort === "date" ? "name" : "date")}>
              <ArrowUpDown className="h-4 w-4" /> Sort: {sort}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-3 pr-4">Student</th>
                  <th className="py-3 pr-4">University</th>
                  <th className="py-3 pr-4">Department</th>
                  <th className="py-3 pr-4">Level</th>
                  <th className="py-3 pr-4">Submitted</th>
                  <th className="py-3 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-secondary">{s.fullName}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </td>
                    <td className="py-3 pr-4">{s.university}</td>
                    <td className="py-3 pr-4">{s.department}</td>
                    <td className="py-3 pr-4"><Badge variant="secondary">L{s.level}</Badge></td>
                    <td className="py-3 pr-4">{new Date(s.submittedAt).toLocaleDateString("en-GB")}</td>
                    <td className="py-3 pr-4">
                      <Button size="sm" variant="outline" onClick={() => setOpen(s)}><Eye className="h-4 w-4" /> View</Button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No students match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{open?.fullName}</DialogTitle></DialogHeader>
          {open && (
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[
                ["Email", open.email], ["Phone", open.phone], ["Gender", open.gender], ["Date of birth", open.dob],
                ["University", open.university], ["Department", open.department], ["Program", open.program], ["Level", open.level],
                ["Index number", open.indexNumber], ["Address", open.address],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
                  <div className="font-medium text-secondary">{v}</div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
