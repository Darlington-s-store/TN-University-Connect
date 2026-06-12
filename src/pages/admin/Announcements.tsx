import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAnnouncements, saveAnnouncements, Announcement } from "@/lib/data";

const CATEGORIES = ["Events", "Programs", "Scholarships", "Governance", "Research", "General"];

export default function AdminAnnouncements() {
  const [list, setList] = useState(getAnnouncements());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);

  const persist = (next: Announcement[]) => {
    saveAnnouncements(next);
    setList(next);
  };

  const blank = (): Announcement => ({
    id: `a-${Date.now()}`,
    title: "",
    category: "General",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    body: "",
    published: true,
  });

  const openNew = () => { setEditing(blank()); setOpen(true); };
  const openEdit = (a: Announcement) => { setEditing({ ...a }); setOpen(true); };

  const save = () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.body.trim()) return toast.error("Title and body are required");
    const exists = list.find((a) => a.id === editing.id);
    persist(exists ? list.map((a) => (a.id === editing.id ? editing : a)) : [editing, ...list]);
    toast.success(exists ? "Announcement updated" : "Announcement created");
    setOpen(false);
  };

  const remove = (id: string) => {
    persist(list.filter((a) => a.id !== id));
    toast.success("Deleted");
  };

  const togglePublish = (id: string) => {
    persist(list.map((a) => (a.id === id ? { ...a, published: !a.published } : a)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Announcements</h1>
          <p className="text-muted-foreground">Create, edit and publish network announcements.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> New announcement</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-3 px-4 font-medium text-secondary max-w-md truncate">{a.title}</td>
                    <td className="py-3 px-4"><Badge variant="secondary">{a.category}</Badge></td>
                    <td className="py-3 px-4">{new Date(a.date).toLocaleDateString("en-GB")}</td>
                    <td className="py-3 px-4">
                      {a.published
                        ? <Badge className="bg-primary">Published</Badge>
                        : <Badge variant="outline">Draft</Badge>}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => togglePublish(a.id)}>
                        {a.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing && list.find((a) => a.id === editing.id) ? "Edit" : "New"} announcement</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Excerpt</Label>
                <Input value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
              </div>
              <div>
                <Label>Body</Label>
                <Textarea rows={6} value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
