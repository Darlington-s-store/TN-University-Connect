import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, User, BookOpen, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogs } from "@/lib/data";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";

function resolveBlogImage(imgStr?: string) {
  if (!imgStr) return undefined;
  if (imgStr.startsWith("http")) return imgStr;
  if (imgStr.includes("blog-1")) return blog1;
  if (imgStr.includes("blog-2")) return blog2;
  if (imgStr.includes("blog-3")) return blog3;
  if (imgStr.includes("blog-4")) return blog4;
  return imgStr;
}

export default function BlogDetail() {
  const { id } = useParams();
  const post = getBlogs().find((b) => b.id === id);

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
    <article className="py-16">
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
    </article>
  );
}
