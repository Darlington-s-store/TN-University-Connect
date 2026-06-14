import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Share2, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAnnouncements } from "@/lib/data";
import cardPattern from "@/assets/card-pattern.jpg";

export default function AnnouncementDetail() {
  const { id } = useParams();
  const item = getAnnouncements().find((a) => a.id === id);

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Announcement not found</h1>
        <Button asChild>
          <Link to="/announcements">Back to announcements</Link>
        </Button>
      </div>
    );
  }

  const related = getAnnouncements()
    .filter((a) => a.id !== item.id && a.published)
    .slice(0, 3);

  return (
    <article className="bg-white min-h-screen">
      {/* Hero header */}
      <section className="relative overflow-hidden bg-secondary text-white py-16 lg:py-20">
        <div className="absolute inset-0">
          <img
            src={cardPattern}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,107,45,0.18)_0%,transparent_55%)]" />
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-3xl">
          <Button asChild variant="ghost" className="mb-6 text-white/80 hover:text-white hover:bg-white/10">
            <Link to="/announcements">
              <ArrowLeft className="h-4 w-4" /> All announcements
            </Link>
          </Button>
          <Badge className="bg-ghana-red text-white mb-4">{item.category}</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
            {item.title}
          </h1>
          <div className="flex items-center gap-5 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(item.date).toLocaleDateString("en-GB", { dateStyle: "long" })}
            </span>
            <button className="flex items-center gap-1.5 hover:text-white">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <div className="aspect-[16/7] rounded-2xl overflow-hidden mb-10 shadow-soft">
            <div className="h-full w-full relative">
              <img src={cardPattern} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/70 via-primary/30 to-transparent" />
              <div className="absolute inset-0 grid place-items-center">
                <Megaphone className="h-14 w-14 text-white/80" />
              </div>
            </div>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {item.body}
            </p>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 bg-slate-50/60 border-t border-slate-100">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl font-extrabold text-secondary mb-8">More announcements</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/announcements/${r.id}`}
                  className="block bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-elegant hover:-translate-y-0.5 transition-all"
                >
                  <Badge className="bg-primary/10 text-primary border-0 mb-3 text-[10px] font-bold">
                    {r.category}
                  </Badge>
                  <div className="font-extrabold text-secondary line-clamp-2 leading-snug mb-2">
                    {r.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-semibold">
                    {new Date(r.date).toLocaleDateString("en-GB", { dateStyle: "long" })}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
