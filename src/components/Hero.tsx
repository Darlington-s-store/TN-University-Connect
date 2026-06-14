import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, GraduationCap, CheckCircle2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroBg from "@/assets/hero-bg.jpg";

export default function Hero() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center text-white overflow-hidden"
      aria-label="TN Universities Connect — Hero"
    >
      {/* Background image & gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Ghanaian University Campus"
          className="h-full w-full object-cover object-center scale-100 animate-[heroZoom_20s_ease-out_forwards]"
        />
        {/* Layered gradients for a high-end cinematic lookup */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-black/30" />

        {/* Ambient background glows */}
        <div className="absolute top-1/4 right-1/4 h-80 w-80 rounded-full bg-ghana-gold/15 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 left-10 h-96 w-96 rounded-full bg-ghana-red/10 blur-[130px] animate-bounce duration-[10000ms]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 py-20 lg:py-24 text-center lg:text-left">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="flex justify-center lg:justify-start">
              <Badge className="bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md text-white px-4 py-2 uppercase tracking-[0.2em] text-[11px] font-bold rounded-full">
                <Sparkles className="h-3.5 w-3.5 mr-2 text-accent" /> Empowering Ghanaian Higher
                Education
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
              Bridging Ghana's
              <br />
              <span className="relative inline-block mt-2">
                <span className="bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green bg-clip-text text-transparent drop-shadow-sm font-black">
                  Institutions
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 flag-stripe rounded-full" />
              </span>
              <br />
              Uniting Every Student.
            </h1>

            <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg md:text-xl text-white/80 leading-relaxed font-sans font-medium">
              A single unified network connecting students, esteemed alumni, and academic
              institutions across all regions of Ghana. Access scholarships, share research, and
              discover opportunities.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold h-14 px-8 text-base font-bold rounded-xl transition-all duration-300 hover:translate-y-[-3px]"
              >
                <Link to="/register">
                  Get Started <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white backdrop-blur-sm h-14 px-8 text-base font-bold rounded-xl transition-all duration-300 hover:translate-y-[-3px]"
              >
                <Link to="/about">Explore Network</Link>
              </Button>
            </div>

            {/* Quick stats counter strip */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 border-t border-white/10 pt-8 mt-8">
              {[
                { v: "60+", l: "Institutions", desc: "Across Ghana" },
                { v: "8,500+", l: "Members", desc: "Students & Alumni" },
                { v: "180+", l: "Mentors", desc: "Expert Guides" },
              ].map((s) => (
                <div key={s.l} className="space-y-1">
                  <div className="text-xl sm:text-2xl font-black text-white">{s.v}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest text-accent font-bold">
                    {s.l}
                  </div>
                  <div className="text-[9px] text-white/50 hidden sm:block">{s.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Premium Ambient Feature Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="relative group">
              {/* Outer light glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green rounded-3xl blur-2xl opacity-30 group-hover:opacity-45 transition duration-1000" />

              <div className="relative rounded-3xl border border-white/10 bg-secondary/80 backdrop-blur-2xl p-8 shadow-2xl flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-accent" />
                    <span className="text-xs uppercase tracking-widest text-white/70 font-black">
                      Featured Opportunity
                    </span>
                  </div>
                  <Badge className="bg-ghana-red text-white border-0 text-[10px] font-bold">
                    New
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold leading-tight group-hover:text-accent transition-colors">
                    2026 STEM Excellence Fellowships
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed font-medium">
                    Fully funded postgraduate pathways and mentorship packages supported by the
                    Ministry of Education & partners. Open to all technical and public university
                    alumni.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <CheckCircle2 className="h-4 w-4 text-ghana-green shrink-0" />
                    <span>Free study materials & resource libraries</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Trophy className="h-4 w-4 text-ghana-gold shrink-0" />
                    <span>Direct linkages to industry partners</span>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-xl mt-2 py-5 font-bold gap-2 text-xs uppercase tracking-wider"
                >
                  <Link to="/announcements">
                    Apply Online <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Flag accent stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 flag-stripe z-20" />
    </section>
  );
}
