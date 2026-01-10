import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { getPostBySlug, type BlogPost } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon, UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

export default function BlogPost() {
  const { slug } = useParams();

  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getPostBySlug(slug).then((data) => {
        setPost(data);
        setIsLoading(false);
      });
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-3xl space-y-8 animate-pulse">
        <div className="h-8 bg-muted w-2/3 rounded" />
        <div className="h-4 bg-muted w-1/3 rounded" />
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-24 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-primary/20 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-accent/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-premium/5 blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 container mx-auto py-12 px-4 max-w-3xl">
        <SEO
          title={post.title}
          description={post.description}
          path={`/blog/${post.slug}`}
          type="article"
          publishedTime={post.date}
          author={post.author}
        />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button asChild variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all group">
            <Link to="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          </Button>
        </motion.div>

        <article className="prose prose-lg dark:prose-invert max-w-none prose-p:my-4 prose-p:text-foreground prose-headings:mb-4 prose-headings:mt-10 prose-headings:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-code:bg-muted prose-li:my-1 prose-li:text-foreground prose-img:my-8 prose-img:rounded-lg prose-img:shadow-md prose-table:my-6 prose-hr:my-8 prose-a:text-primary hover:prose-a:underline">
          <motion.div
            className="mb-10 not-prose border-b pb-8 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-foreground leading-tight">
              {post.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-3xl text-left leading-relaxed">
              {post.description}
            </p>
            <div className="flex items-center justify-start gap-6 text-muted-foreground">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4 opacity-70" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              {post.author && (
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="w-4 h-4 opacity-70" />
                  <span>{post.author}</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {post.content}
            </ReactMarkdown>
          </motion.div>
        </article>
      </div>
    </div>
  );
}
