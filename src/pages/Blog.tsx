import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, BookOpen, ArrowRight, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogs, BlogPost } from "@/lib/data";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import blog5 from "@/assets/blog-5.jpg";
import blog6 from "@/assets/blog-6.jpg";
import blog7 from "@/assets/blog-7.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import heroBg from "@/assets/hero-bg.jpg";

function resolveBlogImage(imgStr?: string) {
  if (!imgStr) return undefined;
  if (imgStr.startsWith("http")) return imgStr;
  if (imgStr.includes("blog-1")) return blog1;
  if (imgStr.includes("blog-2")) return blog2;
  if (imgStr.includes("blog-3")) return blog3;
  if (imgStr.includes("blog-4")) return blog4;
  if (imgStr.includes("blog-5")) return blog5;
  if (imgStr.includes("blog-6")) return blog6;
  if (imgStr.includes("blog-7")) return blog7;
  return imgStr;
}

export default function Blog() {
  const [all, setAll] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await getBlogs();
        setAll(list.filter((b) => b.published));
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const featured = all.find((b) => b.featured);
  const categories = Array.from(new Set(all.map((b) => b.category)));
  const recent = [...all].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const filtered = useMemo(() => {
    return all
      .filter((b) => (cat === "all" ? true : b.category === cat))
      .filter(
        (b) =>
          b.title.toLowerCase().includes(q.toLowerCase()) ||
          b.excerpt.toLowerCase().includes(q.toLowerCase()),
      )
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [all, q, cat]);

  return (
    <div className="bg-white min-h-screen">
      {/* MODERN HERO */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-secondary text-white py-20 lg:py-28"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-slate-950" />
          <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 z-10 max-w-4xl text-center flex flex-col items-center justify-center space-y-6">
          <h1 className="text-4xl sm:text-6xl font-bold leading-[1.1]">The TNUC Blog</h1>
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
            Perspectives, research, and student voices from across Ghana's universities—shaping the
            future of African higher education.
          </p>
        </div>
      </motion.section>

      {/* FEATURED POST - MODERN DESIGN */}
      {featured && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-12 -mt-10 relative z-20"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <Card className="overflow-hidden border-none shadow-2xl bg-white rounded-3xl group">
              <div className="grid lg:grid-cols-2">
                <div className="aspect-[16/10] lg:aspect-auto relative overflow-hidden bg-muted">
                  {featured.image ? (
                    <img
                      src={resolveBlogImage(featured.image)}
                      alt={featured.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-ghana-red/20 group-hover:scale-105 transition-transform duration-700 grid place-items-center">
                      <BookOpen className="h-24 w-24 text-secondary opacity-30" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-accent text-accent-foreground shadow-lg px-4 py-1">
                      Featured Article
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8 lg:p-16 flex flex-col justify-center">
                  <Badge
                    variant="secondary"
                    className="w-fit mb-4 bg-primary/5 text-primary border-none"
                  >
                    {featured.category}
                  </Badge>
                  <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-6 group-hover:text-primary transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed line-clamp-3 italic">
                    "{featured.excerpt}"
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-secondary">
                        {featured.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="text-sm">
                        <div className="font-bold text-secondary">{featured.author}</div>
                        <div className="text-muted-foreground">
                          {new Date(featured.date).toLocaleDateString("en-GB", {
                            dateStyle: "long",
                          })}
                        </div>
                      </div>
                    </div>
                    <Button
                      asChild
                      className="rounded-xl shadow-lg shadow-primary/20 group-hover:translate-x-1 transition-transform"
                    >
                      <Link to={`/blog/${featured.id}`} className="gap-2">
                        Read More <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </motion.section>
      )}

      {/* MAIN BLOG SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="py-20"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* ARTICLES COLUMN */}
            <div className="flex-1">
              {/* SEARCH & FILTER - CLEAN */}
              <div className="flex flex-col md:flex-row gap-4 mb-12">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search articles, research and stories..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-11 h-12 bg-muted/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                  <Button
                    variant={cat === "all" ? "default" : "ghost"}
                    onClick={() => setCat("all")}
                    className="rounded-xl h-12 px-6 font-bold"
                  >
                    All
                  </Button>
                  {categories.map((c) => (
                    <Button
                      key={c}
                      variant={cat === c ? "default" : "ghost"}
                      onClick={() => setCat(c)}
                      className="rounded-xl h-12 px-6 font-bold"
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((b, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link key={b.id} to={`/blog/${b.id}`} className="group flex">
                      <Card className="group border border-slate-100 shadow-soft hover:shadow-elegant transition-all duration-300 overflow-hidden bg-white rounded-2xl flex flex-col w-full hover:-translate-y-1">
                        <div className="aspect-[16/10] relative overflow-hidden bg-muted">
                          {b.image ? (
                            <img
                              src={resolveBlogImage(b.image)}
                              alt={b.title}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 grid place-items-center">
                              <BookOpen className="h-10 w-10 text-primary/30" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-accent text-accent-foreground font-bold border-0 shadow-md px-2.5 py-0.5 text-[10px]">
                              {b.category}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                              By {b.author} · {new Date(b.date).toLocaleDateString("en-GB")}
                            </div>
                            <h3 className="font-extrabold text-base text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                              {b.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {b.excerpt}
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-primary group-hover:gap-2.5 transition-all w-fit">
                            Read article <ArrowRight className="h-3 w-3" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-24 bg-muted/20 rounded-3xl">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-secondary">No articles found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try a different search or category.
                  </p>
                </div>
              )}
            </div>

            {/* SIDEBAR - REFINED */}
            <aside className="w-full lg:w-[320px] space-y-8">
              <div className="sticky top-24">
                <h4 className="text-sm font-bold text-secondary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="h-1 w-6 bg-primary rounded-full" />
                  Recent Posts
                </h4>
                <div className="space-y-6">
                  {recent.map((r) => (
                    <Link key={r.id} to={`/blog/${r.id}`} className="group block">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        {new Date(r.date).toLocaleDateString("en-GB", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="font-bold text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {r.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
