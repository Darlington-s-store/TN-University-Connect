import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, ArrowRight, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogs } from "@/lib/data";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import blog5 from "@/assets/blog-5.jpg";
import blog6 from "@/assets/blog-6.jpg";
import blog7 from "@/assets/blog-7.jpg";

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
  const all = getBlogs().filter((b) => b.published);
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
      <section className="relative overflow-hidden bg-secondary text-white py-20 lg:py-28">
        <div className="absolute inset-0 z-0">
          <img
            src="https://www.ug.edu.gh/sites/default/files/inline-images/IMG_7281.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/70" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(245,197,24,0.15)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(0,107,45,0.2)_0%,transparent_50%)]" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 z-10 text-center flex flex-col items-center">
          <Badge className="bg-accent text-accent-foreground mb-6 px-4 py-1 uppercase tracking-widest font-bold">
            Insights & Stories
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">The TNUC Blog</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Perspectives, research, and student voices from across Ghana's universities—shaping the
            future of African higher education.
          </p>
        </div>
      </section>

      {/* FEATURED POST - MODERN DESIGN */}
      {featured && (
        <section className="py-12 -mt-10 relative z-20">
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
        </section>
      )}

      {/* MAIN BLOG SECTION */}
      <section className="py-20">
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

              <div className="grid sm:grid-cols-2 gap-8">
                {filtered.map((b) => (
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

                <div className="mt-12 p-8 bg-secondary rounded-3xl text-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-3 leading-tight">
                      Subscribe to our newsletter
                    </h4>
                    <p className="text-sm text-white/70 mb-6 leading-relaxed">
                      Get the latest insights delivered straight to your inbox.
                    </p>
                    <div className="space-y-3">
                      <Input
                        placeholder="Your email address"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-11 rounded-xl"
                      />
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-11 font-bold">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
