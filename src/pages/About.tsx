import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, CheckCircle2, Users } from "lucide-react";
import { UNIVERSITIES } from "@/lib/data";

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
    <div>
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <Badge className="bg-accent text-accent-foreground mb-4">About Us</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold max-w-3xl">
            Building bridges between every Ghanaian student and every Ghanaian university.
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-2xl">
            TN Universities Connect is a national platform uniting institutions, students, and alumni
            under one roof — sharing knowledge, opportunities, and progress.
          </p>
        </div>
        <div className="h-2 flag-stripe mt-12" />
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-soft">
            <CardContent className="p-8">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h2 className="text-2xl font-bold text-secondary mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To create a unified, accessible platform that empowers every Ghanaian university student
                with the connections, information, and opportunities they need to thrive — academically,
                professionally, and personally.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft">
            <CardContent className="p-8">
              <Eye className="h-10 w-10 text-ghana-red mb-4" />
              <h2 className="text-2xl font-bold text-secondary mb-3">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A Ghana where every university student is one click away from a continent of opportunities,
                where institutions collaborate rather than compete, and where higher education is the engine
                of national progress.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <Badge variant="outline" className="border-primary text-primary mb-3">Objectives</Badge>
          <h2 className="text-3xl font-bold text-secondary mb-8">What we set out to achieve</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {objectives.map((o) => (
              <div key={o} className="flex items-start gap-3 p-4 bg-card rounded-lg shadow-soft">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-secondary">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <Badge variant="outline" className="border-ghana-red text-ghana-red mb-3">Leadership</Badge>
          <h2 className="text-3xl font-bold text-secondary mb-10">Meet the team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <Card key={m.name} className="text-center hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <div className="h-20 w-20 rounded-full mx-auto bg-gradient-to-br from-primary to-secondary text-white grid place-items-center text-2xl font-bold shadow-elegant">
                    {m.initials}
                  </div>
                  <h3 className="mt-4 font-bold text-secondary">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-6 w-6 text-accent" />
            <Badge className="bg-accent text-accent-foreground">Partner Universities</Badge>
          </div>
          <h2 className="text-3xl font-bold mb-8">Our growing family</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {UNIVERSITIES.map((u) => (
              <div key={u} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-smooth">
                {u}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
