import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllPosts, type BlogPost } from "@/lib/blog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { PAGE_SEO } from "@/lib/seoConfig";
import SEO from "@/components/SEO";

export default function BlogIndex() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAllPosts().then((data) => {
            setPosts(data);
            setIsLoading(false);
        });
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="relative min-h-screen selection:bg-primary/20 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[5%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-accent/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-premium/5 blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
            </div>

            <div className="relative z-10 container mx-auto py-12 px-4 max-w-6xl">
                <SEO
                    title={PAGE_SEO.blog.title}
                    description={PAGE_SEO.blog.description}
                    path="/blog"
                    keywords={PAGE_SEO.blog.keywords}
                />

                <div className="flex flex-col gap-8">
                    <motion.div
                        className="text-left space-y-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
                            Our Blog
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            Insights, tutorials, and updates from the team.
                        </p>
                    </motion.div>

                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardHeader className="h-32 bg-muted/50" />
                                    <CardContent className="h-24 bg-muted/30 mt-4" />
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {posts?.map((post) => (
                                <motion.div key={post.slug} variants={itemVariants}>
                                    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30">
                                        <motion.div
                                            className="flex flex-col h-full"
                                            whileHover={{ y: -5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <CardHeader>
                                                <CardTitle className="line-clamp-2 leading-tight">
                                                    <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                                                        {post.title}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription className="line-clamp-3 mt-2">
                                                    {post.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex-grow">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    {new Date(post.date).toLocaleDateString(undefined, {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button asChild variant="secondary" className="w-full group">
                                                    <Link to={`/blog/${post.slug}`}>
                                                        Read Article
                                                    </Link>
                                                </Button>
                                            </CardFooter>
                                        </motion.div>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
