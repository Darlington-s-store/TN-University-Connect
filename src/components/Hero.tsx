import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export default function Hero() {
  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden"
      aria-label="TN Universities Connect — Hero"
    >
      {/* Background image & gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Ghanaian University Campus"
          className="h-full w-full object-cover object-center scale-100"
        />
        {/* Layered gradients for a clean professional lookup */}
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Bridging Ghana's{" "}
            <span className="bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green bg-clip-text text-transparent font-black">
              Institutions
            </span>
            ,<br />
            Uniting Every Student.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed font-sans font-medium">
            A unified national network connecting students, alumni, and academic institutions across
            all regions of Ghana. Access scholarships, share research, and discover opportunities.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md h-14 px-8 text-base font-bold rounded-xl transition-all duration-300 hover:translate-y-[-2px]"
            >
              <Link to="/register">
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm h-14 px-8 text-base font-bold rounded-xl transition-all duration-300 hover:translate-y-[-2px]"
            >
              <Link to="/about">Explore Network</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Flag accent stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 flag-stripe z-20" />
    </section>
  );
}
