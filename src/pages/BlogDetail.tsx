import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, BookOpen, Share2 } from "lucide-react";
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

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (!id) return;
        const targetPost = await getBlogById(id);
        setPost(targetPost);
      } catch (err) {
        console.error("Failed to load blog post details:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading article...</h1>
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
        </Button>
        <Badge className="bg-primary mb-4">{post.category}</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" /> {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />{" "}
            {new Date(post.date).toLocaleDateString("en-GB", { dateStyle: "long" })}
          </span>
          <button className="flex items-center gap-1 hover:text-primary">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
        <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-slate-100">
          {post.image ? (
            <img
              src={resolveBlogImage(post.image)}
              alt={post.title}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 grid place-items-center">
              <BookOpen className="h-16 w-16 text-primary/40" />
            </div>
          )}
        </div>
        <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {post.body}
        </p>
      </div>
    </motion.article>
  );
}
