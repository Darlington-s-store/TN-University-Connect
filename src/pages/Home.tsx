import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Users, BookOpen, Award, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Hero from "@/components/Hero";
import { getAnnouncements, getBlogs, UNIVERSITIES } from "@/lib/data";
import cardPattern from "@/assets/card-pattern.jpg";

const stats = [
  { label: "Member Universities", value: "40+", icon: GraduationCap },
  { label: "Registered Students", value: "5,200+", icon: Users },
  { label: "Published Articles", value: "240", icon: BookOpen },
  { label: "Scholarships Awarded", value: "120", icon: Award },
];

const testimonials = [
  { quote: "TN Universities Connect helped me find the mentorship I needed during my third year. The community is incredible.", name: "Akosua Frimpong", role: "Mechanical Engineering · KNUST" },
  { quote: "From announcements to scholarships, this is now the first place I check every morning. Truly indispensable.", name: "Yaw Owusu", role: "Economics · UCC" },
  { quote: "The cross-university research network opened doors I didn't know existed. Highly recommended for every Ghanaian student.", name: "Dr. Ama Boateng", role: "Faculty · University of Ghana" },
];

export default function Home() {
  const announcements = getAnnouncements().slice(0, 3);
  const blogs = getBlogs().slice(0, 3);

  return (
    <div className="page-fade-enter">
      <Hero />

      {/* STATS */}
      <section className="py-16 -mt-10 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Card className="border-0 shadow-elegant bg-card hover:-translate-y-1 transition-smooth">
                <CardContent className="p-6 text-center">
                  <div className="inline-grid place-items-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-3">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-secondary">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED ANNOUNCEMENTS */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="outline" className="border-ghana-red text-ghana-red mb-3">Featured Announcements</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary">What's happening across our network</h2>
            </div>
            <Button asChild variant="ghost"><Link to="/announcements">View all <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {announcements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group hover:shadow-elegant transition-smooth border-border overflow-hidden h-full hover:-translate-y-1">
                  <div className="relative h-32 overflow-hidden">
                    <img src={cardPattern} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-90 group-hover:scale-105 transition-smooth" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/30 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <Badge className="bg-ghana-red text-white border-0">{a.category}</Badge>
                      <span className="text-xs font-medium">{new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-secondary mb-2 group-hover:text-primary transition-smooth line-clamp-2">{a.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                    <Link to={`/announcements/${a.id}`} className="inline-flex items-center gap-1 mt-4 text-sm font-bold text-primary group-hover:gap-2 transition-all">
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="outline" className="border-primary text-primary mb-3">Latest from the Blog</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary">Stories, insights, and ideas</h2>
            </div>
            <Button asChild variant="ghost"><Link to="/blog">All posts <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogs.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group hover:shadow-elegant transition-smooth overflow-hidden h-full hover:-translate-y-1">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {b.image ? (
                      <img src={b.image} alt={b.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-smooth duration-700" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 grid place-items-center">
                        <BookOpen className="h-10 w-10 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-accent text-accent-foreground shadow-sm">{b.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="text-xs text-muted-foreground mb-2">{b.author} · {new Date(b.date).toLocaleDateString("en-GB")}</div>
                    <h3 className="font-bold text-lg text-secondary mb-2 group-hover:text-primary transition-smooth line-clamp-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
                    <Link to={`/blog/${b.id}`} className="inline-flex items-center gap-1 mt-4 text-sm font-bold text-primary">
                      Read article <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* UNIVERSITIES */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <Badge variant="outline" className="border-ghana-green text-ghana-green mb-3">Partner Universities</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-3">A growing nationwide network</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            From the coast to the savannah, our members include public and private institutions of every size.
          </p>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {UNIVERSITIES.map((u) => (
              <div key={u} className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-secondary border border-border hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-smooth">
                {u}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
        <img src={cardPattern} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12">
            <Badge className="bg-accent text-accent-foreground mb-3">Success Stories</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Voices from our community</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="bg-white/5 border-white/10 backdrop-blur h-full">
                  <CardContent className="p-6">
                    <Quote className="h-8 w-8 text-accent mb-4" />
                    <p className="text-white/90 leading-relaxed">"{t.quote}"</p>
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="font-semibold text-white">{t.name}</div>
                      <div className="text-sm text-white/60">{t.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <Card className="border-0 shadow-elegant overflow-hidden">
            <div className="flag-stripe h-2" />
            <CardContent className="p-10 lg:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">Ready to be part of something bigger?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Register today and unlock mentorship, scholarships, events and a network spanning every region of Ghana.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild size="lg"><Link to="/register">Create your account</Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/contact">Talk to us</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
