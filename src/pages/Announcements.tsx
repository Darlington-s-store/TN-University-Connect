import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(q.toLowerCase()),
      )
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [all, q, cat]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white min-h-screen">
      {/* MODERN HERO */}
      <section className="relative overflow-hidden bg-secondary text-white py-20 lg:py-28">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,107,45,0.15)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(215,25,32,0.1)_0%,transparent_50%)]" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 z-10 text-center flex flex-col items-center">
          <Badge className="bg-accent text-accent-foreground mb-6 px-4 py-1 uppercase tracking-widest font-bold">
            Press Center
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">Latest Updates</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Your source for official announcements, scholarship updates, and institutional news from
            across the Ghanaian academic landscape.
          </p>
        </div>
      </section>

      {/* FILTER & SEARCH - MODERN COMPACT */}
      <section className="py-12 -mt-10 relative z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-border flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search news, events, and updates..."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                className="pl-11 h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Select
                value={cat}
                onValueChange={(v) => {
                  setCat(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-12 w-full md:w-56 bg-muted/30 border-none rounded-xl focus:ring-1 focus:ring-primary">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS GRID */}
      <section className="pb-24 pt-8">
        <div className="container mx-auto px-4 sm:px-6">
          {items.length === 0 ? (
            <div className="text-center py-32">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search keywords.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((a) => (
                <Link key={a.id} to={`/announcements/${a.id}`} className="group">
                  <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden rounded-2xl flex flex-col">
                    <div className="h-1 bg-gradient-to-r from-primary/50 to-ghana-red/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          variant="secondary"
                          className="bg-primary/5 text-primary border-none hover:bg-primary/10 px-3 py-1"
                        >
                          {a.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(a.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-secondary mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {a.title}
                      </h3>

                      <p className="text-muted-foreground line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">
                        {a.excerpt}
                      </p>

                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <span>Read full article</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* MODERN PAGINATION */}
          {pageCount > 1 && (
            <div className="flex justify-center items-center gap-2 mt-20">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded-xl border-border hover:bg-muted"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
              </Button>

              <div className="flex items-center gap-1.5 px-4">
                {Array.from({ length: pageCount }, (_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "ghost"}
                    onClick={() => setPage(i + 1)}
                    className={`h-10 w-10 rounded-xl font-bold ${page === i + 1 ? "shadow-lg shadow-primary/20" : "text-muted-foreground"}`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                disabled={page === pageCount}
                onClick={() => setPage(page + 1)}
                className="rounded-xl border-border hover:bg-muted"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
