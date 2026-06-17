import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Calendar, ArrowRight, Megaphone, Sparkles, TrendingUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAnnouncements, Announcement } from "@/lib/data";
import cardPattern from "@/assets/card-pattern.jpg";
import annAgm from "@/assets/ann-agm.jpg";
import annDimes from "@/assets/ann-dimes.jpg";
import annHyundai from "@/assets/ann-hyundai-stem.png";
import annLegal from "@/assets/ann-legal.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import heroBg from "@/assets/hero-bg.jpg";

function resolveAnnouncementImage(imgStr?: string) {
  if (!imgStr) return undefined;
  if (imgStr.startsWith("http")) return imgStr;
  if (imgStr.includes("ann-agm") || imgStr.includes("agm")) return annAgm;
  if (imgStr.includes("ann-dimes") || imgStr.includes("dimes")) return annDimes;
  if (imgStr.includes("ann-hyundai") || imgStr.includes("hyundai") || imgStr.includes("stem"))
    return annHyundai;
  if (imgStr.includes("ann-legal") || imgStr.includes("legal")) return annLegal;
  return imgStr;
}

const PAGE_SIZE = 6;

export default function Announcements() {
  const [all, setAll] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await getAnnouncements();
        setAll(list.filter((a) => a.published));
      } catch (err) {
        console.error("Failed to load announcements:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = Array.from(new Set(all.map((a) => a.category)));
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [page, setPage] = useState(1);

  const sorted = useMemo(
    () => [...all].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [all],
  );

  const filtered = useMemo(() => {
    return sorted
      .filter((a) => (cat === "all" ? true : a.category === cat))
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(q.toLowerCase()),
      );
  }, [sorted, q, cat]);

  const featured = sorted[0];
  const isFiltering = q !== "" || cat !== "all";
  // Hide featured from grid only when there are no filters applied
  const gridList = isFiltering ? filtered : filtered.filter((a) => a.id !== featured?.id);

  const pageCount = Math.max(1, Math.ceil(gridList.length / PAGE_SIZE));
  const items = gridList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-background min-h-screen">
      {/* HERO — video background */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden text-white py-24 lg:py-32"
      >
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={heroBg}
            className="h-full w-full object-cover"
            aria-hidden="true"
          >
            <source src={heroVideo.url} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-secondary/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-transparent to-background" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,107,45,0.25)_0%,transparent_55%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(215,25,32,0.18)_0%,transparent_50%)]" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 backdrop-blur-md mb-6">
            <Megaphone className="h-3.5 w-3.5 text-accent" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              Press Center
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-5 tracking-tight leading-[1.05]">
            <span className="bg-gradient-to-r from-white via-white to-accent bg-clip-text text-transparent">
              Latest Updates
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
            Official announcements, scholarship updates, and institutional news from across the
            Ghanaian academic landscape.
          </p>

          {/* Live stats */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm">
            <div className="flex items-center gap-2 text-white/80">
              <span className="h-2 w-2 rounded-full bg-ghana-green animate-pulse" />
              <span className="font-bold text-white">{all.length}</span> live announcements
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="font-bold text-white">{categories.length}</span> categories
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <TrendingUp className="h-4 w-4 text-ghana-red" />
              Updated daily
            </div>
          </div>
        </div>
      </motion.section>

      {/* FEATURED — only when not filtering */}
      {!isFiltering && featured && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="container mx-auto px-4 sm:px-6 -mt-16 relative z-20"
        >
          <Link to={`/announcements/${featured.id}`} className="group block">
            <Card className="overflow-hidden border-none shadow-2xl rounded-3xl bg-card">
              <div className="grid lg:grid-cols-5">
                <div className="lg:col-span-3 aspect-[16/10] lg:aspect-auto relative overflow-hidden bg-muted">
                  <img
                    src={resolveAnnouncementImage(featured.image) || cardPattern}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      if (!e.currentTarget.src.includes(cardPattern))
                        e.currentTarget.src = cardPattern;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-transparent to-transparent lg:bg-gradient-to-r" />
                  <div className="absolute top-5 left-5">
                    <Badge className="bg-accent text-accent-foreground border-0 font-bold uppercase tracking-wider px-3 py-1 text-[11px] shadow-lg">
                      ★ Featured
                    </Badge>
                  </div>
                </div>
                <CardContent className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4 text-xs">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-none font-bold"
                    >
                      {featured.category}
                    </Badge>
                    <span className="text-muted-foreground inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(featured.date).toLocaleDateString("en-GB", { dateStyle: "long" })}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-secondary leading-tight mb-4 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                    {featured.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
                    Read full announcement <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        </motion.section>
      )}

      {/* FILTER BAR — sticky chip rail */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="sticky top-16 z-30 bg-background/85 backdrop-blur-xl border-b border-border mt-16"
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1 max-w-xl">
              <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                className="pl-11 pr-10 h-11 bg-muted/40 border-none rounded-full text-sm"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 grid place-items-center rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
              <button
                onClick={() => {
                  setCat("all");
                  setPage(1);
                }}
                className={`shrink-0 px-4 h-9 rounded-full text-xs font-bold transition-all ${
                  cat === "all"
                    ? "bg-secondary text-white shadow-md"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-secondary"
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCat(c);
                    setPage(1);
                  }}
                  className={`shrink-0 px-4 h-9 rounded-full text-xs font-bold transition-all ${
                    cat === c
                      ? "bg-secondary text-white shadow-md"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-secondary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* GRID */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="pb-24 pt-10"
      >
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-muted/40 rounded-2xl animate-pulse border border-border"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-32">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">No announcements found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search keywords.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {items.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <Link to={`/announcements/${a.id}`} className="group flex h-full">
                    <Card className="border border-border shadow-sm hover:shadow-xl transition-all duration-300 bg-card overflow-hidden rounded-2xl flex flex-col w-full hover:-translate-y-1.5 hover:border-primary/40">
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={resolveAnnouncementImage(a.image) || cardPattern}
                          alt=""
                          aria-hidden="true"
                          onError={(e) => {
                            if (!e.currentTarget.src.includes(cardPattern))
                              e.currentTarget.src = cardPattern;
                          }}
                          className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/20 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/95 text-secondary border-0 font-bold text-[10px] backdrop-blur shadow">
                            {a.category}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-90">
                            <Calendar className="h-3 w-3" />
                            {new Date(a.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-5 flex-1 flex flex-col">
                        <h3 className="font-extrabold text-base text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                          {a.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                          {a.excerpt}
                        </p>
                        <div className="inline-flex items-center gap-1.5 mt-4 pt-4 border-t border-border text-xs font-bold text-primary group-hover:gap-2.5 transition-all w-fit">
                          Read more <ArrowRight className="h-3 w-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {pageCount > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16">
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
                    className={`h-10 w-10 rounded-xl font-bold ${
                      page === i + 1 ? "shadow-lg shadow-primary/20" : "text-muted-foreground"
                    }`}
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
      </motion.section>
    </div>
  );
}
