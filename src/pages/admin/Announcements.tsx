import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Megaphone, Plus, Pencil, Eye, EyeOff } from "lucide-react";
import {
  getAnnouncementsAdmin,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  Announcement,
} from "@/lib/data";
import annAgm from "@/assets/ann-agm.jpg";
import annDimes from "@/assets/ann-dimes.jpg";
import annHyundai from "@/assets/ann-hyundai-stem.png";
import annLegal from "@/assets/ann-legal.jpg";

function resolveAnnouncementImage(imgStr?: string) {
  if (!imgStr) return undefined;
  if (imgStr.startsWith("http")) return imgStr;
  if (imgStr.includes("ann-agm") || imgStr.includes("agm")) return annAgm;
  if (imgStr.includes("ann-dimes") || imgStr.includes("dimes")) return annDimes;
  if (imgStr.includes("ann-hyundai") || imgStr.includes("hyundai") || imgStr.includes("stem")) return annHyundai;
  if (imgStr.includes("ann-legal") || imgStr.includes("legal")) return annLegal;
  return imgStr;
}
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminAnnouncements() {
  const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);
  const [annOpen, setAnnOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  const CATEGORIES = ["Events", "Programs", "Scholarships", "Governance", "Research", "General"];

  useEffect(() => {
    async function load() {
      try {
        const list = await getAnnouncementsAdmin();
        setAnnouncementList(list);
      } catch (err: any) {
        toast.error(err.message || "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const blankAnn = (): Announcement => ({
    id: `a-${Date.now()}`,
    title: "",
    category: "General",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    body: "",
    published: true,
  });

  const openNewAnn = () => {
    setEditingAnn(blankAnn());
    setAnnOpen(true);
  };

  const openEditAnn = (a: Announcement) => {
    setEditingAnn({ ...a });
    setAnnOpen(true);
  };

  const saveAnn = async () => {
    if (!editingAnn) return;
    if (!editingAnn.title.trim() || !editingAnn.body.trim()) {
      toast.error("Title and body are required");
      return;
    }
    const exists = announcementList.some((a) => a.id === editingAnn.id);
    try {
      if (exists) {
        const updated = await updateAnnouncement(editingAnn.id, editingAnn);
        setAnnouncementList((prev) => prev.map((a) => (a.id === editingAnn.id ? updated : a)));
        toast.success("Announcement updated");
      } else {
        const created = await createAnnouncement(editingAnn);
        setAnnouncementList((prev) => [created, ...prev]);
        toast.success("Announcement created");
      }
      setAnnOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save announcement");
    }
  };

  const removeAnn = async (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteAnnouncement(id);
        setAnnouncementList((prev) => prev.filter((a) => a.id !== id));
        toast.success("Deleted");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete");
      }
    }
  };

  const togglePublishAnn = async (id: string) => {
    const found = announcementList.find((a) => a.id === id);
    if (!found) return;
    try {
      const updated = await updateAnnouncement(id, { published: !found.published });
      setAnnouncementList((prev) => prev.map((a) => (a.id === id ? updated : a)));
      toast.success(updated.published ? "Published" : "Unpublished");
    } catch (err: any) {
      toast.error(err.message || "Failed to update publish state");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="outline" className="border-accent text-accent-foreground mb-2">
          System Broadcast
        </Badge>
        <h1 className="text-3xl font-bold text-secondary">System Announcements</h1>
        <p className="text-muted-foreground">
          Create, edit and publish network announcements broadcasted to students.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 max-w-6xl">
        {announcementList.map((a) => (
          <Card key={a.id} className="hover:shadow-soft transition-smooth">
            {a.image && (
              <div className="aspect-[16/9] overflow-hidden bg-slate-100 rounded-t-xl">
                <img
                  src={resolveAnnouncementImage(a.image)}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <CardContent className="p-5">
              <div className="flex justify-between items-start gap-2 mb-2">
                <Badge variant="secondary">{a.category}</Badge>
                {a.published ? (
                  <Badge className="bg-primary">Live</Badge>
                ) : (
                  <Badge variant="outline">Draft</Badge>
                )}
              </div>
              <h3 className="font-bold text-secondary mb-1 line-clamp-2">{a.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
              <div className="text-xs text-muted-foreground mt-2">
                {new Date(a.date).toLocaleDateString("en-GB")}
              </div>
              <div className="flex gap-1 mt-4 pt-3 border-t">
                <Button size="sm" variant="ghost" onClick={() => togglePublishAnn(a.id)}>
                  {a.published ? (
                    <>
                      <EyeOff className="h-4 w-4" /> Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" /> Publish
                    </>
                  )}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openEditAnn(a)}>
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => removeAnn(a.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {announcementList.length === 0 && (
        <Card className="border-none shadow-soft max-w-6xl">
          <CardContent className="p-6 text-center text-muted-foreground">
            No announcements created yet.
          </CardContent>
        </Card>
      )}

      <Dialog open={annOpen} onOpenChange={setAnnOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAnn && announcementList.find((a) => a.id === editingAnn.id) ? "Edit" : "New"}{" "}
              announcement
            </DialogTitle>
          </DialogHeader>
          {editingAnn && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editingAnn.title}
                  onChange={(e) => setEditingAnn({ ...editingAnn, title: e.target.value })}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={editingAnn.category}
                    onValueChange={(v) => setEditingAnn({ ...editingAnn, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={editingAnn.date}
                    onChange={(e) => setEditingAnn({ ...editingAnn, date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Excerpt</Label>
                <Input
                  value={editingAnn.excerpt}
                  onChange={(e) => setEditingAnn({ ...editingAnn, excerpt: e.target.value })}
                />
              </div>
              <div>
                <Label>Body</Label>
                <Textarea
                  rows={6}
                  value={editingAnn.body}
                  onChange={(e) => setEditingAnn({ ...editingAnn, body: e.target.value })}
                />
              </div>
              <div>
                <Label>Cover Image</Label>
                <div className="flex gap-2">
                  <Input
                    value={editingAnn.image || ""}
                    onChange={(e) => setEditingAnn({ ...editingAnn, image: e.target.value })}
                    placeholder="Paste image URL…"
                    className="flex-1"
                  />
                  <Label className="flex cursor-pointer items-center gap-1.5 px-3 py-2 rounded-lg border bg-muted text-xs font-medium hover:bg-slate-200 transition-colors shrink-0">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () =>
                            setEditingAnn({ ...editingAnn, image: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Label>
                  {editingAnn.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-destructive"
                      onClick={() => setEditingAnn({ ...editingAnn, image: undefined })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {editingAnn.image && editingAnn.image.startsWith("data:") && (
                  <div className="mt-2 rounded-xl overflow-hidden border">
                    <img
                      src={editingAnn.image}
                      alt="preview"
                      className="h-32 w-full object-contain bg-slate-100"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 border rounded-xl">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="published-switch"
                    className="font-bold text-secondary cursor-pointer"
                  >
                    Publish Immediately
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    If enabled, this announcement will appear on the homepage and student
                    dashboards.
                  </p>
                </div>
                <Switch
                  id="published-switch"
                  checked={editingAnn.published}
                  onCheckedChange={(checked) =>
                    setEditingAnn({ ...editingAnn, published: checked })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveAnn}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
