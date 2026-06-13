import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Eye, CheckCircle2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { UNIVERSITIES } from "@/lib/data";
import Logo from "@/components/Logo";

const team = [
  { name: "Dr. Kofi Owusu", role: "Executive Director", initials: "KO" },
  { name: "Ama Boateng", role: "Director of Programs", initials: "AB" },
  { name: "Yaw Mensah", role: "Head of Partnerships", initials: "YM" },
  { name: "Akosua Asante", role: "Communications Lead", initials: "AA" },
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
      <section className="relative overflow-hidden bg-secondary text-white py-24 lg:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
        </div>
        
        <div className="container relative mx-auto px-4 sm:px-6 z-10 text-center flex flex-col items-center">
          <div className="max-w-3xl">
            <Badge className="bg-accent text-accent-foreground mb-6 px-4 py-1 text-xs uppercase tracking-widest font-bold">Our Story</Badge>
            <h1 className="text-4xl sm:text-6xl font-bold leading-[1.1] mb-8">
              Building the digital infrastructure for <span className="text-accent">Ghanaian excellence.</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              TN Universities Connect is more than a platform—it's a movement. We are dedicated to bridging the gap between talent and opportunity across every campus in Ghana.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION & VISION - MODERN GRID */}
      <section className="py-24 -mt-12 relative z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl bg-white overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="h-2 bg-primary" />
              <CardContent className="p-10">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-secondary mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To create a unified, accessible ecosystem that empowers every Ghanaian student with the connections, resources, and networks required to excel in a globalized economy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="h-2 bg-ghana-red" />
              <CardContent className="p-10">
                <div className="h-14 w-14 rounded-2xl bg-ghana-red/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Eye className="h-7 w-7 text-ghana-red" />
                </div>
                <h2 className="text-3xl font-bold text-secondary mb-4">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A future where institutional boundaries disappear, allowing knowledge to flow freely and ensuring higher education remains the primary driver of national innovation and prosperity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CORE OBJECTIVES - CLEAN DESIGN */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="border-primary text-primary mb-4 px-4">Strategic Goals</Badge>
            <h2 className="text-4xl font-bold text-secondary mb-4">What we set out to achieve</h2>
            <p className="text-muted-foreground">Our objectives are rooted in the belief that collective growth is the only way forward for our academic institutions.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((o, i) => (
              <div key={o} className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <span className="text-secondary font-medium leading-snug pt-1">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP - SOPHISTICATED GRID */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <Badge variant="outline" className="border-ghana-red text-ghana-red mb-4">Leadership</Badge>
              <h2 className="text-4xl font-bold text-secondary mb-4">The minds behind the platform</h2>
              <p className="text-muted-foreground text-lg">Our diverse leadership team brings together decades of experience in education, technology, and community building.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((m) => (
              <div key={m.name} className="group">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-4xl font-bold text-secondary/30">{m.initials}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">{m.name}</h3>
                <p className="text-muted-foreground font-medium">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - MODERN COMPACT */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green" />
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">Ready to join the network?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-10">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-10">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
