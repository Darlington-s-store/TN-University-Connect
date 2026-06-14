import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAnnouncements } from "@/lib/data";

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

  return (
    <article className="py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/announcements">
            <ArrowLeft className="h-4 w-4" /> All announcements
          </Link>
        </Button>
        <Badge className="bg-ghana-red text-white mb-4">{item.category}</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">{item.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />{" "}
            {new Date(item.date).toLocaleDateString("en-GB", { dateStyle: "long" })}
          </span>
          <button className="flex items-center gap-1 hover:text-primary">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {item.body}
          </p>
        </div>
      </div>
    </article>
  );
}
