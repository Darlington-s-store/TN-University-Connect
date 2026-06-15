import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { getBlogsAdmin, createBlog, updateBlog, deleteBlog, BlogPost } from "@/lib/data";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import blog5 from "@/assets/blog-5.jpg";
import blog6 from "@/assets/blog-6.jpg";
import blog7 from "@/assets/blog-7.jpg";

function resolveBlogImage(imgStr?: string) {
  if (!imgStr) return undefined;
  if (imgStr.startsWith("http")) return imgStr;
  if (imgStr.includes("blog-1")) return blog1;
  if (imgStr.includes("blog-2")) return blog2;
  if (imgStr.includes("blog-3")) return blog3;
  if (imgStr.includes("blog-4")) return blog4;
  if (imgStr.includes("blog-5")) return blog5;
  if (imgStr.includes("blog-6")) return blog6;
  if (imgStr.includes("blog-7")) return blog7;
  return imgStr;
}

export default function AdminBlog() {
  const [list, setList] = useState<BlogPost[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBlogsAdmin();
        setList(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const blank = (): BlogPost => ({
    id: `b-${Date.now()}`,
    title: "",
    category: "General",
    author: "",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    body: "",
    published: true,
    featured: false,
  });

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.body.trim())
      return toast.error("Title and body are required");
    const exists = list.some((b) => b.id === editing.id);
    try {
      if (exists) {
        const updated = await updateBlog(editing.id, editing);
        setList((prev) => prev.map((b) => (b.id === editing.id ? updated : b)));
        toast.success("Blog post updated");
      } else {
        const created = await createBlog(editing);
        setList((prev) => [created, ...prev]);
        toast.success("Blog post created");
      }
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save blog post");
    }
  };

  const remove = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlog(id);
        setList((prev) => prev.filter((b) => b.id !== id));
        toast.success("Deleted");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete");
      }
    }
  };

  const togglePublish = async (id: string) => {
    const found = list.find((b) => b.id === id);
    if (!found) return;
    try {
      const updated = await updateBlog(id, { published: !found.published });
      setList((prev) => prev.map((b) => (b.id === id ? updated : b)));
      toast.success(updated.published ? "Published" : "Unpublished");
    } catch (err: any) {
      toast.error(err.message || "Failed to update publish state");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Blog posts</h1>
          <p className="text-muted-foreground">
            Write, edit and publish stories for the TNUC blog.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(blank());
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> New post
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 max-w-6xl">
        {list.map((b) => (
          <Card key={b.id} className="hover:shadow-soft transition-smooth">
            {b.image && (
              <div className="aspect-[16/9] overflow-hidden bg-slate-100 rounded-t-xl">
                <img
                  src={resolveBlogImage(b.image)}
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
                <Badge variant="secondary">{b.category}</Badge>
                <div className="flex gap-1">
                  {b.featured && (
                    <Badge className="bg-accent text-accent-foreground">
                      <Star className="h-3 w-3" />
                    </Badge>
                  )}
                  {b.published ? (
                    <Badge className="bg-primary">Live</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-secondary mb-1 line-clamp-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
              <div className="text-xs text-muted-foreground mt-2">
                {b.author} · {new Date(b.date).toLocaleDateString("en-GB")}
              </div>
              <div className="flex gap-1 mt-4 pt-3 border-t">
                <Button size="sm" variant="ghost" onClick={() => togglePublish(b.id)}>
                  {b.published ? (
                    <>
                      <EyeOff className="h-4 w-4" /> Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" /> Publish
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditing({ ...b });
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(b.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Blog post</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Author</Label>
                  <Input
                    value={editing.author}
                    onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={editing.date}
                    onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Excerpt</Label>
                <Input
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                />
              </div>
              <div>
                <Label>Body</Label>
                <Textarea
                  rows={8}
                  value={editing.body}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                />
              </div>
              <div>
                <Label>Cover Image</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={editing.image || ""}
                    onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    placeholder="Paste image URL or asset path…"
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
                            setEditing({ ...editing, image: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Label>
                  {editing.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-destructive"
                      onClick={() => setEditing({ ...editing, image: undefined })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    "blog-1.jpg",
                    "blog-2.jpg",
                    "blog-3.jpg",
                    "blog-4.jpg",
                    "blog-5.jpg",
                    "blog-6.jpg",
                    "blog-7.jpg",
                  ].map((img) => (
                    <button
                      type="button"
                      key={img}
                      onClick={() => setEditing({ ...editing, image: `/src/assets/${img}` })}
                      className={`px-2 py-1 text-xs rounded border transition-colors ${editing.image === `/src/assets/${img}` ? "bg-primary text-white border-primary font-bold" : "bg-muted text-slate-600 hover:bg-slate-200"}`}
                    >
                      {img}
                    </button>
                  ))}
                </div>
                {editing.image && editing.image.startsWith("data:") && (
                  <div className="mt-2 rounded-xl overflow-hidden border">
                    <img
                      src={editing.image}
                      alt="preview"
                      className="h-32 w-full object-contain bg-slate-100"
                    />
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={!!editing.featured}
                  onCheckedChange={(v) => setEditing({ ...editing, featured: !!v })}
                />
                <span className="text-sm">Mark as featured</span>
              </label>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
