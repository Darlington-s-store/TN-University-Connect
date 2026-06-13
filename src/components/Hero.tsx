import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroBg from "@/assets/hero-bg.jpg";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden text-white min-h-[88vh] flex items-center"
      aria-label="TN Universities Connect — Hero"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          className="h-full w-full object-cover object-center scale-105 animate-[heroZoom_18s_ease-out_forwards]"
        />
        {/* Color washes for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/70 to-secondary/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-ghana-gold/20 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-ghana-red/25 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-8"
          >
            <Badge className="bg-white/10 border border-white/25 backdrop-blur text-white px-3.5 py-1.5 uppercase tracking-[0.18em] text-[11px] font-bold mb-6">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Proudly Ghanaian
            </Badge>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-bold leading-[1.02] tracking-tight">
              Connecting Ghana's
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-ghana-gold via-accent to-ghana-red bg-clip-text text-transparent">
                  Universities
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 flag-stripe rounded-full" />
              </span>
              ,
              <br />
              Empowering Every Student.
            </h1>

            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/85 leading-relaxed">
              One unified platform for students, alumni, and institutions across Ghana —
              share opportunities, build networks, and shape the future of higher education.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold h-14 px-9 text-base font-bold rounded-xl transition-smooth hover:translate-y-[-2px]"
              >
                <Link to="/register">
                  Join Now <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white backdrop-blur h-14 px-9 text-base font-bold rounded-xl"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>

            {/* Mini stats strip */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl border-t border-white/15 pt-6">
              {[
                { v: "40+", l: "Institutions" },
                { v: "5,200+", l: "Students" },
                { v: "120", l: "Scholarships" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{s.v}</div>
                  <div className="text-xs uppercase tracking-widest text-white/60 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating card on large screens */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-4 hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-ghana-gold/40 via-ghana-red/30 to-ghana-green/40 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-7 shadow-2xl">
                <div className="text-xs uppercase tracking-[0.2em] text-white/70 mb-3 font-bold">Featured</div>
                <h3 className="text-2xl font-bold leading-tight">
                  National University Symposium 2026
                </h3>
                <p className="mt-3 text-sm text-white/75 leading-relaxed">
                  Join us in Accra, 12–14 August for three days of research, mentorship, and cross-campus collaboration.
                </p>
                <Button
                  asChild
                  variant="link"
                  className="px-0 mt-4 text-accent font-bold hover:text-accent/80"
                >
                  <Link to="/announcements">Explore the agenda <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom flag stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 flag-stripe z-20" />
    </section>
  );
}
