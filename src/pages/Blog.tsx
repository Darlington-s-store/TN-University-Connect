import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, ArrowRight, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogs } from "@/lib/data";

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
      .filter((b) => b.title.toLowerCase().includes(q.toLowerCase()) || b.excerpt.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [all, q, cat]);

  return (
    <div>
      <section className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <Badge className="bg-accent text-accent-foreground mb-3">Insights & Stories</Badge>
          <h1 className="text-4xl font-bold">The TNUC Blog</h1>
          <p className="mt-3 text-white/80 max-w-2xl">Perspectives, research, and student voices from across Ghana's universities.</p>
        </div>
        <div className="h-2 flag-stripe mt-10" />
      </section>

      {featured && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <Badge className="bg-accent text-accent-foreground mb-3"><Star className="h-3 w-3 mr-1" /> Featured</Badge>
            <Card className="overflow-hidden border-0 shadow-elegant">
              <div className="grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto bg-gradient-to-br from-primary via-secondary to-ghana-red grid place-items-center">
                  <BookOpen className="h-20 w-20 text-white/40" />
                </div>
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-3">{featured.category}</Badge>
                  <h2 className="text-2xl lg:text-3xl font-bold text-secondary mb-3">{featured.title}</h2>
                  <p className="text-muted-foreground mb-4">{featured.excerpt}</p>
                  <div className="text-sm text-muted-foreground mb-6">{featured.author} · {new Date(featured.date).toLocaleDateString("en-GB", { dateStyle: "long" })}</div>
                  <Button asChild className="w-fit"><Link to={`/blog/${featured.id}`}>Read article <ArrowRight className="h-4 w-4" /></Link></Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_280px] gap-10">
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search articles..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={cat === "all" ? "default" : "outline"} onClick={() => setCat("all")}>All</Button>
                {categories.map((c) => (
                  <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)}>{c}</Button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {filtered.map((b) => (
                <Card key={b.id} className="hover:shadow-elegant transition-smooth overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 grid place-items-center">
                    <BookOpen className="h-10 w-10 text-primary/40" />
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-2">{b.category}</Badge>
                    <h3 className="font-bold text-secondary mb-2 line-clamp-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{b.excerpt}</p>
                    <div className="text-xs text-muted-foreground">{b.author} · {new Date(b.date).toLocaleDateString("en-GB")}</div>
                    <Link to={`/blog/${b.id}`} className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary">
                      Read <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filtered.length === 0 && <div className="text-center py-16 text-muted-foreground">No articles match your filters.</div>}
          </div>

          <aside className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-bold text-secondary mb-4">Recent Posts</h4>
                <div className="space-y-3">
                  {recent.map((r) => (
                    <Link key={r.id} to={`/blog/${r.id}`} className="block group">
                      <div className="font-medium text-sm text-secondary group-hover:text-primary transition-smooth line-clamp-2">{r.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{new Date(r.date).toLocaleDateString("en-GB")}</div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h4 className="font-bold text-secondary mb-4">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button key={c} onClick={() => setCat(c)} className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-smooth">{c}</button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}
