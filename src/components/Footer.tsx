import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo variant="light" />
          <p className="text-sm text-white/70 leading-relaxed">
            Uniting Ghana's universities, students and alumni through one connected platform. Guide
            • Work • Inspire
          </p>
          <div className="flex gap-3">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground transition-smooth"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              ["/about", "About Us"],
              ["/announcements", "Announcements"],
              ["/blog", "Blog"],
              ["/contact", "Contact"],
              ["/register", "Join Now"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-accent transition-smooth">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">For Members</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link to="/login" className="hover:text-accent">
                Member Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-accent">
                Register
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-accent">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/student-info" className="hover:text-accent">
                Student Info Form
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">Contact</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" /> Accra, Greater Accra
              Region, Ghana
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent shrink-0" /> +233 30 250 0000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent shrink-0" /> info@tnuc.gh
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <span>© {new Date().getFullYear()} TN Universities Connect. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-ghana-red" />
            <span className="inline-block w-2 h-2 rounded-full bg-ghana-gold" />
            <span className="inline-block w-2 h-2 rounded-full bg-ghana-green" />
            <span></span>
          </span>
        </div>
      </div>
    </footer>
  );
}
