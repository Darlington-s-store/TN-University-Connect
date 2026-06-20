import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Eye, CheckCircle2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import heroBg from "@/assets/hero-bg.jpg";
import {
  Reveal,
  fadeUp,
  slideLeft,
  slideRight,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

const team = [
  {
    name: "Dr. Kofi Owusu",
    role: "Executive Director",
    initials: "KO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop",
  },
  {
    name: "Ama Boateng",
    role: "Director of Programs",
    initials: "AB",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
  },
  {
    name: "Yaw Mensah",
    role: "Head of Partnerships",
    initials: "YM",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=500&fit=crop",
  },
  {
    name: "Akosua Asante",
    role: "Communications Lead",
    initials: "AA",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop",
  },
];

const objectives = [
  "Foster collaboration between Ghana's universities",
  "Provide students with access to opportunities nationwide",
  "Champion research, mentorship, and career development",
  "Promote inclusion across regions, programs, and backgrounds",
  "Celebrate Ghanaian academic excellence",
];

export default function About() {
  return (
    <div className="bg-white">
      {/* MODERN HERO */}
      <section className="relative overflow-hidden bg-secondary text-white py-20 lg:py-28">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-slate-950" />
          <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 z-10 max-w-4xl text-center flex flex-col items-center justify-center space-y-6">
          <h1 className="text-4xl sm:text-6xl font-bold leading-[1.1]">
            Building the digital infrastructure for{" "}
            <span className="bg-gradient-to-r from-accent via-ghana-gold to-white bg-clip-text text-transparent font-black">
              Ghanaian excellence.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
            TN Universities Connect is more than a platform—it's a movement. We are dedicated to
            bridging the gap between talent and opportunity across every campus in Ghana.
          </p>
        </div>
      </section>

      {/* MISSION & VISION - MODERN GRID */}
      <Reveal as="section" className="py-24 -mt-12 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8">
            <Reveal variants={slideLeft}>
              <Card className="group border border-slate-100 shadow-soft hover:shadow-elegant transition-all duration-300 bg-white overflow-hidden rounded-2xl flex flex-col w-full hover:-translate-y-1">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=300&fit=crop"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-8 flex-1">
                  <h2 className="text-2xl font-extrabold text-secondary mb-3">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    To create a unified, accessible ecosystem that empowers every Ghanaian student
                    with the connections, resources, and networks required to excel in a globalized
                    economy.
                  </p>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal variants={slideRight}>
              <Card className="group border border-slate-100 shadow-soft hover:shadow-elegant transition-all duration-300 bg-white overflow-hidden rounded-2xl flex flex-col w-full hover:-translate-y-1">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=300&fit=crop"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <div className="h-12 w-12 rounded-xl bg-ghana-red/20 backdrop-blur-md flex items-center justify-center border border-ghana-red/30">
                      <Eye className="h-6 w-6 text-ghana-red" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-8 flex-1">
                  <h2 className="text-2xl font-extrabold text-secondary mb-3">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    A future where institutional boundaries disappear, allowing knowledge to flow
                    freely and ensuring higher education remains the primary driver of national
                    innovation and prosperity.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </Reveal>

      {/* CORE OBJECTIVES - CLEAN DESIGN */}
      <Reveal as="section" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <Reveal variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="border-primary text-primary mb-4 px-4">
              Strategic Goals
            </Badge>
            <h2 className="text-4xl font-bold text-secondary mb-4">What we set out to achieve</h2>
            <p className="text-muted-foreground">
              Our objectives are rooted in the belief that collective growth is the only way forward
              for our academic institutions.
            </p>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {objectives.map((o) => (
              <motion.div
                key={o}
                variants={staggerItem}
                className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow flex gap-4"
              >
                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <span className="text-secondary font-medium leading-snug pt-1">{o}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Reveal>

      {/* LEADERSHIP - SOPHISTICATED GRID */}
      <Reveal as="section" className="py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <Reveal
            variants={fadeUp}
            className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6"
          >
            <div className="max-w-xl">
              <Badge variant="outline" className="border-ghana-red text-ghana-red mb-4">
                Leadership
              </Badge>
              <h2 className="text-4xl font-bold text-secondary mb-4">
                The minds behind the platform
              </h2>
              <p className="text-muted-foreground text-lg">
                Our diverse leadership team brings together decades of experience in education,
                technology, and community building.
              </p>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((m) => (
              <motion.div key={m.name} variants={staggerItem} className="group">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-muted">
                  <img
                    src={m.image}
                    alt={m.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">
                  {m.name}
                </h3>
                <p className="text-muted-foreground font-medium">{m.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Reveal>

      {/* FINAL CTA - MODERN COMPACT */}
      <Reveal as="section" className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Ready to join the network?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-10"
            >
              <Link to="/register">Get Started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-10"
            >
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
