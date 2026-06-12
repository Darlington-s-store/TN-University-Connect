import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAnnouncements } from "@/lib/data";

const PAGE_SIZE = 6;

export default function Announcements() {
  const all = getAnnouncements().filter((a) => a.published);
  const categories = Array.from(new Set(all.map((a) => a.category)));
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return all
      .filter((a) => (cat === "all" ? true : a.category === cat))
      .filter((a) => a.title.toLowerCase().includes(q.toLowerCase()) || a.excerpt.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [all, q, cat]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <Badge className="bg-accent text-accent-foreground mb-3">News & Updates</Badge>
          <h1 className="text-4xl font-bold">Announcements</h1>
          <p className="mt-3 text-white/80 max-w-2xl">Stay informed about events, programs, scholarships, and governance updates across our network.</p>
        </div>
        <div className="h-2 flag-stripe mt-10" />
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search announcements..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="pl-9" />
            </div>
            <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
              <SelectTrigger className="md:w-56"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No announcements match your filters.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((a) => (
                <Card key={a.id} className="hover:shadow-elegant transition-smooth overflow-hidden">
                  <div className="h-1.5 bg-ghana-red" />
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">{a.category}</Badge>
                    <h3 className="font-bold text-lg text-secondary mb-2">{a.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3" />
                      {new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                    <Link to={`/announcements/${a.id}`} className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary">
                      Read more <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              {Array.from({ length: pageCount }, (_, i) => (
                <Button key={i} variant={page === i + 1 ? "default" : "outline"} onClick={() => setPage(i + 1)}>{i + 1}</Button>
              ))}
              <Button variant="outline" disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
