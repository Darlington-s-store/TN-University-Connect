import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail, CheckCircle2, Trash2, Reply, Search, Send, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getMessages,
  resolveMessage,
  deleteMessage,
  getStudents,
  sendMessageAdmin,
  ContactMessage,
} from "@/lib/data";

export default function AdminMessages() {
  // ── Inbox state ──
  const [list, setList] = useState<ContactMessage[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<ContactMessage | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  // ── Send to Students state ──
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [recipientFilter, setRecipientFilter] = useState("all");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgChannel, setMsgChannel] = useState<"email" | "sms" | "both">("email");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function loadInbox() {
      try {
        const data = await getMessages();
        setList(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    }
    loadInbox();
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setStudentsLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
    } catch {
      // silently fail — students may not be loaded yet
    } finally {
      setStudentsLoading(false);
    }
  };

  // Unique universities from loaded students
  const studentUnis = Array.from(
    new Set(students.map((s: any) => s.university).filter(Boolean)),
  ) as string[];

  // Filter students based on recipient filter
  const filteredStudents =
    recipientFilter === "all"
      ? students
      : students.filter((s: any) => s.university === recipientFilter);

  const filtered = list.filter((m) =>
    `${m.name} ${m.email} ${m.subject}`.toLowerCase().includes(q.toLowerCase()),
  );

  const markResolved = async (id: string) => {
    try {
      const updated = await resolveMessage(id);
      setList((prev) => prev.map((x) => (x.id === id ? updated : x)));
      toast.success("Marked as resolved");
    } catch (err: any) {
      toast.error(err.message || "Failed to resolve");
    }
  };

  const removeMsg = async (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(id);
        setList((prev) => prev.filter((x) => x.id !== id));
        toast.success("Deleted");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete");
      }
    }
  };

  const handleSendToStudents = async () => {
    if (!msgBody.trim()) {
      toast.error("Message content is required");
      return;
    }
    if (filteredStudents.length === 0) {
      toast.error("No students match the selected filter");
      return;
    }
    setSending(true);
    let sent = 0;
    let failed = 0;
    for (const student of filteredStudents) {
      try {
        await sendMessageAdmin({
          email: student.email,
          phone: student.phone,
          subject: msgSubject.trim(),
          message: msgBody.trim(),
          channel: msgChannel,
        });
        sent++;
      } catch {
        failed++;
      }
    }
    setSending(false);
    toast.success(
      `Message sent to ${sent} student${sent !== 1 ? "s" : ""}${failed > 0 ? `. ${failed} failed.` : ""}`,
    );
    if (failed === 0) {
      setMsgSubject("");
      setMsgBody("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary">Messages</h1>
        <p className="text-muted-foreground">
          Review contact form submissions and send messages to students.
        </p>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="w-fit h-11 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger
            value="inbox"
            className="rounded-lg font-bold text-xs uppercase tracking-wider"
          >
            <Mail className="h-4 w-4 mr-1.5" /> Inbox
          </TabsTrigger>
          <TabsTrigger
            value="send"
            className="rounded-lg font-bold text-xs uppercase tracking-wider"
          >
            <Send className="h-4 w-4 mr-1.5" /> Send to Students
          </TabsTrigger>
        </TabsList>

        {/* ────────────── TAB 1: INBOX ────────────── */}
        <TabsContent value="inbox" className="space-y-4 pt-4">
          <div className="relative max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <Card>
                <CardContent className="p-10 text-center text-muted-foreground">
                  <Mail className="h-10 w-10 mx-auto mb-3 opacity-40" /> No messages yet.
                </CardContent>
              </Card>
            )}
            {filtered.map((m) => (
              <Card key={m.id} className={m.resolved ? "opacity-70" : ""}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-secondary">{m.name}</span>
                        <span className="text-xs text-muted-foreground">· {m.email}</span>
                        {m.resolved && (
                          <Badge className="bg-primary">
                            <CheckCircle2 className="h-3 w-3" /> Resolved
                          </Badge>
                        )}
                      </div>
                      <div className="font-medium text-secondary mb-1">{m.subject}</div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{m.message}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(m.date).toLocaleString("en-GB")}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setOpen(m);
                          setReply("");
                        }}
                      >
                        <Reply className="h-4 w-4" /> Reply
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => markResolved(m.id)}>
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeMsg(m.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ────────────── TAB 2: SEND TO STUDENTS ────────────── */}
        <TabsContent value="send" className="space-y-4 pt-4">
          <Card className="border-none shadow-soft">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-bold text-secondary">
                  Compose Broadcast
                  {studentsLoading
                    ? " (loading students…)"
                    : ` — ${filteredStudents.length} recipient${filteredStudents.length !== 1 ? "s" : ""}`}
                </span>
              </div>

              {/* Recipient filter */}
              <div className="space-y-1.5">
                <Label>Send to</Label>
                <Select value={recipientFilter} onValueChange={setRecipientFilter}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    {studentUnis.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Channel */}
              <div className="space-y-1.5">
                <Label>Delivery Method</Label>
                <Select
                  value={msgChannel}
                  onValueChange={(v: "email" | "sms" | "both") => setMsgChannel(v)}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Both Email and SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject (shown for email/both) */}
              {(msgChannel === "email" || msgChannel === "both") && (
                <div className="space-y-1.5">
                  <Label>Subject</Label>
                  <Input
                    value={msgSubject}
                    onChange={(e) => setMsgSubject(e.target.value)}
                    placeholder="Email subject line"
                  />
                </div>
              )}

              {/* Message body */}
              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea
                  rows={6}
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  placeholder="Type your message to students…"
                />
              </div>

              <Button
                onClick={handleSendToStudents}
                disabled={sending || filteredStudents.length === 0}
                className="gap-1.5 font-bold"
              >
                <Send className="h-4 w-4" />
                {sending
                  ? "Sending..."
                  : `Send to ${filteredStudents.length} student${filteredStudents.length !== 1 ? "s" : ""}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Reply Dialog ── */}
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {open?.name}</DialogTitle>
          </DialogHeader>
          {open && (
            <div className="space-y-4">
              <div className="p-3 rounded-md bg-muted text-sm">
                <div className="font-medium text-secondary">{open.subject}</div>
                <p className="text-muted-foreground mt-1">{open.message}</p>
              </div>
              <Textarea
                rows={6}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!reply.trim()) return toast.error("Reply cannot be empty");
                if (open) {
                  try {
                    const updated = await resolveMessage(open.id);
                    setList((prev) => prev.map((x) => (x.id === open.id ? updated : x)));
                    toast.success("Reply sent and marked resolved");
                    setOpen(null);
                  } catch (err: any) {
                    toast.error(err.message || "Failed to resolve");
                  }
                }
              }}
            >
              Send reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
