import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Users, BookOpen, Award, Quote, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import logoAsset from "@/assets/TN LOGO.jpeg";
import { getAnnouncements, getBlogs, UNIVERSITIES } from "@/lib/data";

const stats = [
  { label: "Member Universities", value: "10+", icon: GraduationCap },
  { label: "Registered Students", value: "5,200+", icon: Users },
  { label: "Published Articles", value: "240", icon: BookOpen },
  { label: "Scholarships Awarded", value: "120", icon: Award },
];

const testimonials = [
  {
    quote: "TN Universities Connect helped me find the mentorship I needed during my third year. The community is incredible.",
    name: "Akosua Frimpong",
    role: "Mechanical Engineering · KNUST",
  },
  {
    quote: "From announcements to scholarships, this is now the first place I check every morning. Truly indispensable.",
    name: "Yaw Owusu",
    role: "Economics · UCC",
  },
  {
    quote: "The cross-university research network opened doors I didn't know existed. Highly recommended for every Ghanaian student.",
    name: "Dr. Ama Boateng",
    role: "Faculty · University of Ghana",
  },
];

export default function Home() {
  const announcements = getAnnouncements().slice(0, 3);
  const blogs = getBlogs().slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden hero-gradient text-white min-h-[40vh] lg:min-h-[50vh] flex items-center">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-transparent to-secondary/40" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-ghana-gold/15 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-ghana-red/15 blur-[100px]" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 py-8 lg:py-16 flex flex-col items-center text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center max-w-4xl"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight drop-shadow-sm">
              Connecting Ghana's <span className="text-accent underline decoration-ghana-red/30 underline-offset-4">Universities</span>,
              <br /> Empowering Every Student.
            </h1>
            <p className="mt-4 text-base sm:text-xl text-white/90 max-w-2xl font-medium leading-relaxed drop-shadow-sm">
              One unified platform for students, alumni, and institutions across Ghana — share opportunities,
              build networks, and shape the future of higher education.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold h-12 px-8 text-base font-bold">
                <Link to="/register">Join Now <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-12 px-8 text-base">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2 flag-stripe z-20" />
      </section>

      {/* STATS */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-0 shadow-soft bg-card">
                <CardContent className="p-6 text-center">
                  <s.icon className="h-8 w-8 mx-auto text-primary mb-3" />
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
            <Button asChild variant="ghost"><Link to="/announcements">View all <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {announcements.map((a) => (
              <Card key={a.id} className="group hover:shadow-elegant transition-smooth border-border overflow-hidden">
                <div className="h-1.5 bg-ghana-red" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Badge variant="secondary">{a.category}</Badge>
                    <span>·</span>
                    <span>{new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                  <h3 className="font-bold text-lg text-secondary mb-2 group-hover:text-primary transition-smooth">{a.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                  <Link to={`/announcements/${a.id}`} className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary">
                    Read more <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
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
            <Button asChild variant="ghost"><Link to="/blog">All posts <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <Card key={b.id} className="group hover:shadow-elegant transition-smooth overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 relative">
                  <div className="absolute inset-0 grid place-items-center">
                    <BookOpen className="h-10 w-10 text-primary/40" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-accent text-accent-foreground">{b.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="text-xs text-muted-foreground mb-2">
                    {b.author} · {new Date(b.date).toLocaleDateString("en-GB")}
                  </div>
                  <h3 className="font-bold text-lg text-secondary mb-2 group-hover:text-primary transition-smooth line-clamp-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
                  <Link to={`/blog/${b.id}`} className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary">
                    Read article <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
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
              <div key={u} className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-secondary border border-border hover:border-primary hover:text-primary transition-smooth">
                {u}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-accent text-accent-foreground mb-3">Success Stories</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Voices from our community</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="bg-white/5 border-white/10 backdrop-blur">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-accent mb-4" />
                  <p className="text-white/90 leading-relaxed">"{t.quote}"</p>
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-sm text-white/60">{t.role}</div>
                  </div>
                </CardContent>
              </Card>
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
