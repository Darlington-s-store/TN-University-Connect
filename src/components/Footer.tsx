import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-secondary text-secondary-foreground relative border-t border-white/5"
    >
      {/* Top accent line representing the national colors */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green opacity-75" />

      <div className="container mx-auto px-4 sm:px-6 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-6">
          <Logo variant="light" />
          <p className="text-sm text-white/70 leading-relaxed max-w-xs">
            Uniting Ghana's universities, students, and alumni through one connected platform. Guide
            • Work • Inspire.
          </p>
          <div className="flex gap-2.5">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Twitter, label: "Twitter" },
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Instagram, label: "Instagram" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-accent text-white/80 hover:text-accent-foreground hover:bg-accent hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] text-white/90 mb-6 uppercase">
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            {[
              ["/about", "About Us"],
              ["/announcements", "Announcements"],
              ["/blog", "Blog"],
              ["/contact", "Contact"],
              ["/register", "Join Now"],
            ].map(([to, label]) => (
              <li key={to} className="overflow-hidden">
                <Link
                  to={to}
                  className="hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] text-white/90 mb-6 uppercase">
            For Members
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            {[
              ["/login", "Member Login"],
              ["/register", "Register"],
              ["/dashboard", "Dashboard"],
              ["/student-info", "Student Info Form"],
            ].map(([to, label]) => (
              <li key={to} className="overflow-hidden">
                <Link
                  to={to}
                  className="hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] text-white/90 mb-6 uppercase">
            Contact
          </h4>
          <ul className="space-y-4 text-sm text-white/70">
            <li className="flex items-start gap-2.5 hover:text-white transition-colors duration-300">
              <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
              <span>Accra, Greater Accra Region, Ghana</span>
            </li>
            <li className="flex items-center gap-2.5 hover:text-white transition-colors duration-300">
              <Phone className="h-4 w-4 text-accent shrink-0" />
              <a href="tel:+233302500000" className="hover:underline">
                +233 30 250 0000
              </a>
            </li>
            <li className="flex items-center gap-2.5 hover:text-white transition-colors duration-300">
              <Mail className="h-4 w-4 text-accent shrink-0" />
              <a href="mailto:info@tnuc.gh" className="hover:underline">
                info@tnuc.gh
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <span>© {new Date().getFullYear()} TN Universities Connect. All rights reserved.</span>
          <div className="flex items-center gap-1.5 opacity-65">
            <span className="h-1.5 w-1.5 rounded-full bg-ghana-red" />
            <span className="h-1.5 w-1.5 rounded-full bg-ghana-gold" />
            <span className="h-1.5 w-1.5 rounded-full bg-ghana-green" />
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
