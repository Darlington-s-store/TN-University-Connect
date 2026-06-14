import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Quote, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Hero from "@/components/Hero";
import { getAnnouncements, getBlogs } from "@/lib/data";
import cardPattern from "@/assets/card-pattern.jpg";

const PARTNER_UNIVERSITIES = [
  {
    name: "University of Ghana",
    logo: "https://www.ug.edu.gh/sites/default/files/ug_standard_new_sl_1.png",
  },
  {
    name: "Kwame Nkrumah University of Science and Technology",
    logo: "https://www.knust.edu.gh/themes/custom/adepts/images/knustlogo.png",
  },
  {
    name: "University of Cape Coast",
    logo: "https://www.ucc.edu.gh/sites/default/files/ucc_logo_new.png",
  },
  {
    name: "University of Education, Winneba",
    logo: "https://www.uew.edu.gh/sites/default/files/uew_logo_web.png",
  },
  {
    name: "University for Development Studies",
    logo: "https://uds.edu.gh/images/uds_emblem.png",
  },
  {
    name: "Ghana Institute of Management and Public Administration",
    logo: "https://www.gimpa.edu.gh/wp-content/themes/GIMPS/images/logo_g.png",
  },
  {
    name: "Ashesi University",
    logo: "https://www.ashesi.edu.gh/images/logo-mobile_colored.png",
  },
  {
    name: "Central University",
    logo: "https://www.central.edu.gh/virgin/images/Central-Uni-logo.png",
  },
  {
    name: "University of Professional Studies",
    logo: "https://upsa.edu.gh/wp-content/uploads/2020/11/upsa-logoacbsp.png",
  },
  {
    name: "Ho Technical University",
    logo: "https://htu.edu.gh/images/logo.jpg",
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

      {/* FEATURED ANNOUNCEMENTS */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-ghana-red text-xs font-bold uppercase tracking-wider mb-3">
                Announcements
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary tracking-tight">
                Latest updates across the network
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-xl">
                Deadlines, symposia, and funding updates from public and private institutions.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-secondary/15 hover:bg-slate-50"
            >
              <Link to="/announcements" className="font-bold">
                View All <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={cardPattern}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <Badge className="bg-ghana-red text-white border-0 font-bold text-[10px]">
                        {a.category}
                      </Badge>
                      <span className="text-[11px] font-semibold flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(a.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-base text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {a.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {a.excerpt}
                      </p>
                    </div>
                    <Link
                      to={`/announcements/${a.id}`}
                      className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-primary group-hover:gap-2.5 transition-all w-fit"
                    >
                      Read more <ArrowRight className="h-3 w-3" />
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
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-primary text-xs font-bold uppercase tracking-wider mb-3">
                Insights & Research
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary tracking-tight">
                Academic stories and insights
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-xl">
                Essays, research, and profiles from faculty, alumni, and student leaders.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-secondary/15 hover:bg-slate-100"
            >
              <Link to="/blog" className="font-bold">
                Read All <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-accent text-accent-foreground font-bold border-0 shadow-md px-2.5 py-0.5 text-[10px]">
                        {b.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        By {b.author} · {new Date(b.date).toLocaleDateString("en-GB")}
                      </div>
                      <h3 className="font-extrabold text-base text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {b.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {b.excerpt}
                      </p>
                    </div>
                    <Link
                      to={`/blog/${b.id}`}
                      className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-primary w-fit"
                    >
                      Read article <ArrowRight className="h-3 w-3" />
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
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center">
          <div className="text-ghana-green text-xs font-bold uppercase tracking-wider mb-3">
            Institutional Directory
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary tracking-tight mb-3">
            A growing nationwide network
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-sm sm:text-base leading-relaxed">
            From regional technical universities to leading private colleges and public research
            institutions across Ghana.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {PARTNER_UNIVERSITIES.map((u) => (
              <div
                key={u.name}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 rounded-xl text-xs sm:text-sm font-bold text-secondary border border-slate-100 hover:border-primary hover:text-primary hover:bg-slate-50/50 hover:-translate-y-0.5 transition-all duration-200 cursor-default shadow-sm"
              >
                <div className="h-7 w-7 flex items-center justify-center bg-white rounded-lg p-0.5 border border-slate-100 shrink-0">
                  <img
                    src={u.logo}
                    alt={`${u.name} logo`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span>{u.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <img
          src={cardPattern}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-5 mix-blend-overlay"
        />
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="text-accent text-xs font-bold uppercase tracking-wider mb-4">
              Community Voices
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Testimonials from our members
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/5 border border-white/10 backdrop-blur-md h-full text-white">
                  <CardContent className="p-7 flex flex-col justify-between h-full">
                    <div>
                      <Quote className="h-8 w-8 text-accent mb-4" />
                      <p className="text-white/80 leading-relaxed italic text-sm">"{t.quote}"</p>
                    </div>
                    <div className="mt-6 pt-5 border-t border-white/10">
                      <div className="font-extrabold text-white text-sm">{t.name}</div>
                      <div className="text-[11px] text-white/50 font-semibold mt-0.5">{t.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
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
              <div className="flex flex-wrap justify-center gap-4 pt-2">
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
