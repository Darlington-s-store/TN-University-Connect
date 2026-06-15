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
import { submitMessage } from "@/lib/data";
import {
  Reveal,
  slideLeft,
  slideRight,
  staggerContainer,
  staggerItem,
  fadeUp,
  fadeIn,
} from "@/lib/animations";
import { motion } from "framer-motion";

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

  const submit = async (e: React.FormEvent) => {
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
    try {
      await submitMessage(result.data);
      toast.success("Message sent — we'll reply within 48 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* MODERN HERO */}
      <section className="relative overflow-hidden bg-secondary text-white py-20 lg:py-28">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(0,107,45,0.1)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(215,25,32,0.1)_0%,transparent_50%)]" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 z-10 text-center flex flex-col items-center">
          <Badge className="bg-accent text-accent-foreground mb-6 px-4 py-1 uppercase tracking-widest font-bold">
            Contact Us
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">Let's Connect</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Have a question, partnership proposal, or just want to say hello? Our team is here to
            help you navigate the TNUC ecosystem.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION - MODERN SPLIT */}
      <Reveal as="section" variants={fadeUp} className="py-24 -mt-10 relative z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* CONTACT INFO - MODERN CARDS */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="lg:col-span-4 space-y-6"
            >
              <motion.div variants={staggerItem}>
                <Card className="border-none shadow-xl bg-white rounded-3xl p-8 group hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary mb-1">Email Us</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Direct support for general inquiries
                      </p>
                      <a
                        href="mailto:hello@tnuc.gh"
                        className="text-primary font-bold hover:underline"
                      >
                        hello@tnuc.gh
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Card className="border-none shadow-xl bg-white rounded-3xl p-8 group hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-ghana-gold/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="h-6 w-6 text-ghana-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary mb-1">Call Us</h3>
                      <p className="text-sm text-muted-foreground mb-3">Mon-Fri from 8am to 5pm</p>
                      <a
                        href="tel:+233302500000"
                        className="text-secondary font-bold hover:underline"
                      >
                        +233 30 250 0000
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Card className="border-none shadow-xl bg-white rounded-3xl p-8 group hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-ghana-red/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="h-6 w-6 text-ghana-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary mb-1">Visit Us</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Our headquarters in the capital
                      </p>
                      <p className="text-secondary font-bold">Accra, Greater Accra Region</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* SOCIAL LINKS - CLEAN */}
              <Reveal variants={fadeUp}>
                <div className="p-8 bg-muted/30 rounded-3xl">
                  <h4 className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">
                    Follow our journey
                  </h4>
                  <div className="flex gap-4">
                    {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            </motion.div>

            {/* CONTACT FORM - SOPHISTICATED */}
            <Reveal variants={slideRight} className="lg:col-span-8">
              <Card className="border-none shadow-2xl bg-white rounded-[2rem] overflow-hidden">
                <div className="p-8 lg:p-12">
                  <h2 className="text-3xl font-bold text-secondary mb-2">Send a message</h2>
                  <p className="text-muted-foreground mb-10">
                    Fill out the form below and we'll get back to you within 24-48 hours.
                  </p>

                  <form onSubmit={submit} className="space-y-8" noValidate>
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-bold text-secondary uppercase tracking-tighter"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="h-14 bg-muted/30 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-lg px-6"
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="text-xs text-ghana-red font-medium">{errors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-bold text-secondary uppercase tracking-tighter"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="h-14 bg-muted/30 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-lg px-6"
                          placeholder="john@university.edu"
                        />
                        {errors.email && (
                          <p className="text-xs text-ghana-red font-medium">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="subject"
                        className="text-sm font-bold text-secondary uppercase tracking-tighter"
                      >
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="h-14 bg-muted/30 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-lg px-6"
                        placeholder="How can we help you?"
                      />
                      {errors.subject && (
                        <p className="text-xs text-ghana-red font-medium">{errors.subject}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <Label
                          htmlFor="message"
                          className="text-sm font-bold text-secondary uppercase tracking-tighter"
                        >
                          Your Message
                        </Label>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {form.message.length}/1000
                        </span>
                      </div>
                      <Textarea
                        id="message"
                        rows={6}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="bg-muted/30 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 text-lg p-8 resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                      {errors.message && (
                        <p className="text-xs text-ghana-red font-medium">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      size="lg"
                      className="h-16 px-12 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group w-full sm:w-auto"
                    >
                      {submitting ? "Sending..." : "Send Message"}
                      <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </form>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </Reveal>

      {/* MAP PLACEHOLDER - MODERN */}
      <Reveal as="section" variants={fadeIn} className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="aspect-[21/9] rounded-[3rem] bg-secondary/5 border border-border flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,107,45,0.05)_0%,transparent_70%)]" />
            <div className="text-center relative z-10">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4 opacity-50 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-secondary">Find us in Accra</h3>
              <p className="text-muted-foreground">Serving all 16 regions across the nation</p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
