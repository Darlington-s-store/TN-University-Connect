import { useState } from "react";
import { toast } from "sonner";
import { Mail, CheckCircle2, Trash2, Reply, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getMessages, saveMessages, ContactMessage } from "@/lib/data";

export default function AdminMessages() {
  const [list, setList] = useState(getMessages());
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<ContactMessage | null>(null);
  const [reply, setReply] = useState("");

  const filtered = list.filter((m) => `${m.name} ${m.email} ${m.subject}`.toLowerCase().includes(q.toLowerCase()));
  const persist = (next: ContactMessage[]) => { saveMessages(next); setList(next); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary">Contact Messages</h1>
        <p className="text-muted-foreground">Review and respond to incoming messages.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search messages..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card><CardContent className="p-10 text-center text-muted-foreground">
            <Mail className="h-10 w-10 mx-auto mb-3 opacity-40" /> No messages yet.
          </CardContent></Card>
        )}
        {filtered.map((m) => (
          <Card key={m.id} className={m.resolved ? "opacity-70" : ""}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-secondary">{m.name}</span>
                    <span className="text-xs text-muted-foreground">· {m.email}</span>
                    {m.resolved && <Badge className="bg-primary"><CheckCircle2 className="h-3 w-3" /> Resolved</Badge>}
                  </div>
                  <div className="font-medium text-secondary mb-1">{m.subject}</div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{m.message}</p>
                  <div className="text-xs text-muted-foreground mt-2">{new Date(m.date).toLocaleString("en-GB")}</div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => { setOpen(m); setReply(""); }}><Reply className="h-4 w-4" /> Reply</Button>
                  <Button size="sm" variant="ghost" onClick={() => persist(list.map((x) => x.id === m.id ? { ...x, resolved: !x.resolved } : x))}>
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { persist(list.filter((x) => x.id !== m.id)); toast.success("Deleted"); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reply to {open?.name}</DialogTitle></DialogHeader>
          {open && (
            <div className="space-y-4">
              <div className="p-3 rounded-md bg-muted text-sm">
                <div className="font-medium text-secondary">{open.subject}</div>
                <p className="text-muted-foreground mt-1">{open.message}</p>
              </div>
              <Textarea rows={6} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply..." />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>Cancel</Button>
            <Button onClick={() => {
              if (!reply.trim()) return toast.error("Reply cannot be empty");
              if (open) persist(list.map((x) => x.id === open.id ? { ...x, resolved: true } : x));
              toast.success("Reply sent and marked resolved");
              setOpen(null);
            }}>Send reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
