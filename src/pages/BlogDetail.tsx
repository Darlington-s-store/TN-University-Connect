import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Calendar, User, BookOpen, Share2, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogs, getBlogById, BlogPost } from "@/lib/data";
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

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    async function load() {
      try {
        if (!id) return;
        const [targetPost, all] = await Promise.all([getBlogById(id), getBlogs()]);
        setPost(targetPost);
        if (targetPost) {
          setRelated(
            all
              .filter((b) => b.published && b.id !== targetPost.id)
              .filter((b) => b.category === targetPost.category)
              .slice(0, 3),
          );
        }
      } catch (err) {
        console.error("Failed to load blog post details:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0 });
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="h-10 w-10 mx-auto rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="mt-4 text-sm text-muted-foreground">Loading article…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <Button asChild>
          <Link to="/blog">Back to blog</Link>
        </Button>
      </div>
    );
  }

  const minutes = readingTime(post.body);
  const heroImg = resolveBlogImage(post.image);

  return (
    <>
      {/* Reading progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left bg-gradient-to-r from-ghana-red via-ghana-gold to-ghana-green"
        style={{ scaleX: progress }}
      />

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-background"
      >
        {/* Hero header */}
        <header className="relative bg-secondary text-white overflow-hidden">
          {heroImg && (
            <div className="absolute inset-0">
              <img
                src={heroImg}
                alt=""
                className="h-full w-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/85 to-secondary/60" />
            </div>
          )}
          <div className="relative container mx-auto px-4 sm:px-6 max-w-4xl py-20 lg:py-28">
            <Button asChild variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 -ml-3 mb-6">
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4" /> All articles
              </Link>
            </Button>
            <Badge className="bg-accent text-accent-foreground mb-5 px-3 py-1 font-bold uppercase tracking-wider text-[11px]">
              {post.category}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              {post.title}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-3xl leading-relaxed mb-8">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-full bg-white/15 grid place-items-center font-bold">
                  {post.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="font-semibold text-white">{post.author}</span>
                  <span className="text-xs text-white/60 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString("en-GB", { dateStyle: "long" })}
                  </span>
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-white/70">
                <Clock className="h-4 w-4" /> {minutes} min read
              </span>
              <button className="ml-auto flex items-center gap-1.5 text-white/70 hover:text-accent transition-colors">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
        </header>

        {/* Featured image */}
        {heroImg && (
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl -mt-12 relative z-10">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-slate-100">
              <img src={heroImg} alt={post.title} className="h-full w-full object-cover" />
            </div>
          </div>
        )}
        {!heroImg && (
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl -mt-12 relative z-10">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 grid place-items-center">
              <BookOpen className="h-16 w-16 text-primary/40" />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-16">
          <div className="prose-content text-lg leading-[1.85] text-foreground/90 whitespace-pre-wrap font-sans">
            {post.body}
          </div>

          {/* Author card */}
          <div className="mt-16 p-6 rounded-2xl bg-muted/40 border border-border flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-secondary text-white grid place-items-center font-bold text-lg">
              {post.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Written by</div>
              <div className="text-lg font-bold text-secondary">{post.author}</div>
            </div>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/blog">More articles</Link>
            </Button>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="bg-muted/30 border-t border-border py-16">
            <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-secondary">Continue reading</h2>
                <Link to="/blog" className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1">
                  All articles <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/blog/${r.id}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      {r.image ? (
                        <img
                          src={resolveBlogImage(r.image)}
                          alt={r.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center bg-gradient-to-br from-primary/10 to-secondary/10">
                          <BookOpen className="h-8 w-8 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <Badge variant="secondary" className="mb-2 bg-primary/5 text-primary border-none text-[10px] font-bold">
                        {r.category}
                      </Badge>
                      <h3 className="font-bold text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {r.title}
                      </h3>
                      <div className="mt-3 text-[11px] text-muted-foreground uppercase tracking-wider font-bold">
                        {new Date(r.date).toLocaleDateString("en-GB", { dateStyle: "medium" })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </motion.article>
    </>
  );
}
