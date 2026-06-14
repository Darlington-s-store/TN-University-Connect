import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Users, BookOpen, Award, Quote, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Hero from "@/components/Hero";
import { getAnnouncements, getBlogs, UNIVERSITIES } from "@/lib/data";
import cardPattern from "@/assets/card-pattern.jpg";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const stats = [
  {
    label: "Member Universities",
    value: "60+",
    icon: GraduationCap,
    color: "text-ghana-green",
    bg: "bg-ghana-green/10",
  },
  {
    label: "Registered Students",
    value: "8,500+",
    icon: Users,
    color: "text-accent-foreground",
    bg: "bg-accent/30",
  },
  {
    label: "Published Articles",
    value: "320",
    icon: BookOpen,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    label: "Scholarships Awarded",
    value: "180",
    icon: Award,
    color: "text-ghana-red",
    bg: "bg-ghana-red/10",
  },
];

const testimonials = [
  {
    quote:
      "TN Universities Connect helped me find the mentorship I needed during my third year. The community is incredible.",
    name: "Akosua Frimpong",
    role: "Mechanical Engineering · KNUST",
  },
  {
    quote:
      "From announcements to scholarships, this is now the first place I check every morning. Truly indispensable.",
    name: "Yaw Owusu",
    role: "Economics · UCC",
  },
  {
    quote:
      "The cross-university research network opened doors I didn't know existed. Highly recommended for every Ghanaian student.",
    name: "Dr. Ama Boateng",
    role: "Faculty · University of Ghana",
  },
];

export default function Home() {
  const announcements = getAnnouncements().slice(0, 3);
  const blogs = getBlogs().slice(0, 3);

  return (
    <div className="page-fade-enter bg-[#f8fafc]">
      <Hero />

      {/* STATS SECTION */}
      <section className="py-16 -mt-16 relative z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Card className="border border-slate-100 shadow-elegant bg-white hover:-translate-y-1.5 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`inline-grid place-items-center h-14 w-14 rounded-2xl ${s.bg} ${s.color} mb-4`}
                    >
                      <s.icon className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-black text-secondary tracking-tight">
                      {s.value}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-bold">
                      {s.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ANNOUNCEMENTS */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-ghana-red text-xs font-bold uppercase tracking-wider mb-3">
                Announcements
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary tracking-tight">
                Latest updates across the network
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-xl">
                Stay informed with deadlines, symposia, and funding updates from public and private
                institutions.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-secondary/15 hover:bg-slate-50"
            >
              <Link to="/announcements" className="font-bold">
                View All Announcements <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {announcements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex"
              >
                <Card className="group border border-slate-100 shadow-soft hover:shadow-elegant transition-all duration-300 bg-white overflow-hidden rounded-2xl flex flex-col w-full hover:-translate-y-1">
                  <div className="relative h-44 overflow-hidden">
                    {/* Background card image pattern */}
                    <img
                      src={cardPattern}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white">
                      <Badge className="bg-ghana-red text-white border-0 py-1 font-bold">
                        {a.category}
                      </Badge>
                      <span className="text-xs font-semibold flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(a.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <h3 className="font-extrabold text-lg text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {a.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {a.excerpt}
                      </p>
                    </div>
                    <Link
                      to={`/announcements/${a.id}`}
                      className="inline-flex items-center gap-1.5 mt-6 text-sm font-bold text-primary group-hover:gap-2.5 transition-all w-fit"
                    >
                      Read Announcement <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-primary text-xs font-bold uppercase tracking-wider mb-3">
                Insights & Research
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary tracking-tight">
                Academic stories and insights
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-xl">
                Read essays, research findings, and profiles written by faculty, alumni, and student
                leaders.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-secondary/15 hover:bg-slate-100"
            >
              <Link to="/blog" className="font-bold">
                Read All Articles <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogs.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex"
              >
                <Card className="group border border-slate-100 shadow-soft hover:shadow-elegant transition-all duration-300 overflow-hidden bg-white rounded-2xl flex flex-col w-full hover:-translate-y-1">
                  <div className="aspect-[16/10] relative overflow-hidden bg-muted">
                    {b.image ? (
                      <img
                        src={b.image}
                        alt={b.title}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 grid place-items-center">
                        <BookOpen className="h-10 w-10 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground font-bold border-0 shadow-md px-3 py-1">
                        {b.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                        By {b.author} · {new Date(b.date).toLocaleDateString("en-GB")}
                      </div>
                      <h3 className="font-extrabold text-lg text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {b.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {b.excerpt}
                      </p>
                    </div>
                    <Link
                      to={`/blog/${b.id}`}
                      className="inline-flex items-center gap-1.5 mt-6 text-sm font-bold text-primary w-fit"
                    >
                      Read Full Article <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER UNIVERSITIES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="text-ghana-green text-xs font-bold uppercase tracking-wider mb-3">
            Institutional Directory
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary tracking-tight mb-3">
            A growing nationwide network
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12 text-sm sm:text-base leading-relaxed">
            From regional technical universities to leading private colleges and public research
            institutions across Ghana.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5 max-w-4xl mx-auto">
            {UNIVERSITIES.map((u) => (
              <div
                key={u}
                className="px-5 py-2.5 bg-slate-50 rounded-xl text-xs sm:text-sm font-bold text-secondary border border-slate-100 hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all duration-200 cursor-default"
              >
                {u}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        {/* Background image pattern layered with low opacity */}
        <img
          src={cardPattern}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-5 mix-blend-overlay"
        />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="text-accent text-xs font-bold uppercase tracking-wider mb-4">
              Community Voices
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Testimonials from our members
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/5 border border-white/10 backdrop-blur-md h-full text-white">
                  <CardContent className="p-8 flex flex-col justify-between h-full">
                    <div>
                      <Quote className="h-10 w-10 text-accent mb-6" />
                      <p className="text-white/80 leading-relaxed italic text-base">"{t.quote}"</p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <div className="font-extrabold text-white">{t.name}</div>
                      <div className="text-xs text-white/50 font-semibold mt-1">{t.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4 sm:px-6">
          <Card className="border border-slate-100 shadow-elegant overflow-hidden rounded-3xl bg-white relative">
            <div className="flag-stripe h-2" />
            <CardContent className="p-10 lg:p-16 text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary tracking-tight">
                Ready to be part of something bigger?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                Register today and connect with peers, alumni, and opportunities spanning every
                tertiary institution in Ghana.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button asChild size="lg" className="rounded-xl h-12 px-8 font-bold">
                  <Link to="/register">Create Your Account</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl h-12 px-8 font-bold border-secondary/15 hover:bg-slate-50"
                >
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
