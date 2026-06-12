import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Send, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMessages, saveMessages } from "@/lib/data";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(3, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const messages = getMessages();
    messages.unshift({
      id: `msg-${Date.now()}`,
      ...result.data,
      date: new Date().toISOString(),
      resolved: false,
    });
    saveMessages(messages);
    setTimeout(() => {
      toast.success("Message sent — we'll reply within 48 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setSubmitting(false);
    }, 600);
  };

  return (
    <div>
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <Badge className="bg-accent text-accent-foreground mb-3">Get in touch</Badge>
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-3 text-white/80 max-w-2xl">We'd love to hear from you. Send us a message and we'll respond promptly.</p>
        </div>
        <div className="h-2 flag-stripe mt-10" />
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_360px] gap-10">
          <Card className="shadow-elegant border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-secondary mb-6">Send us a message</h2>
              <form onSubmit={submit} className="space-y-4" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} maxLength={200} />
                  {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1000} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{errors.message}</span>
                    <span>{form.message.length}/1000</span>
                  </div>
                </div>
                <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto">
                  <Send className="h-4 w-4" /> {submitting ? "Sending..." : "Send message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-secondary">Reach us</h3>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0"><MapPin className="h-5 w-5" /></div>
                  <div className="text-sm"><div className="font-medium text-secondary">Office</div><div className="text-muted-foreground">Accra, Greater Accra Region, Ghana</div></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-ghana-red/10 text-ghana-red grid place-items-center shrink-0"><Phone className="h-5 w-5" /></div>
                  <div className="text-sm"><div className="font-medium text-secondary">Phone</div><div className="text-muted-foreground">+233 30 250 0000</div></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/30 text-secondary grid place-items-center shrink-0"><Mail className="h-5 w-5" /></div>
                  <div className="text-sm"><div className="font-medium text-secondary">Email</div><div className="text-muted-foreground">hello@tnuc.gh</div></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-secondary mb-4">Follow us</h3>
                <div className="flex gap-3">
                  {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                    <a key={i} href="#" className="h-10 w-10 rounded-full bg-muted grid place-items-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <iframe
                title="Accra, Ghana map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-0.30%2C5.50%2C-0.10%2C5.65&layer=mapnik&marker=5.5600%2C-0.2057"
                className="w-full h-56 border-0"
                loading="lazy"
              />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
