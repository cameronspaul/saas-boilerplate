// IF THIS IS YOUR FIRST TIME EDITING THIS FILE, SO IF YOU CAN READ THIS, make a new file without the "template" prefix

import { useState, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
    Crown,
    Sparkles,
    Zap,
    BarChart3,
    Users,
    Settings,
    Rocket,
    Shield,
    Palette,
    Globe,
    Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seoConfig";
import { motion } from "framer-motion";

// Feature component with tier-based access
interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    requiredTier: "free" | "plus" | "pro";
    currentTier: "free" | "plus" | "pro";
    children?: React.ReactNode;
}

function FeatureCard({
    title,
    description,
    icon: Icon,
    requiredTier,
    currentTier,
    children,
}: FeatureCardProps) {
    const tierHierarchy = { free: 0, plus: 1, pro: 2 };
    const hasAccess = tierHierarchy[currentTier] >= tierHierarchy[requiredTier];

    const tierLabels = {
        free: "Free",
        plus: "Plus",
        pro: "Pro",
    };

    if (!hasAccess) return null;

    const tierBadgeVariants: Record<string, "secondary" | "outline" | "default"> = {
        free: "secondary",
        plus: "outline",
        pro: "default"
    };

    const badgeVariant = tierBadgeVariants[requiredTier];
    const badgeClass = requiredTier === 'plus' ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20" : "";

    return (
        <motion.div variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}>
            <Card className="relative transition-all duration-300 hover:border-primary/50 h-full">
                <motion.div
                    className="h-full"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="p-3 rounded-lg w-fit bg-primary/10 text-primary mb-2">
                                <Icon className="w-6 h-6" />
                            </div>
                            {/* Tier Badge */}
                            <Badge variant={badgeVariant} className={badgeClass}>
                                {tierLabels[requiredTier]}
                            </Badge>
                        </div>

                        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {children}
                    </CardContent>
                </motion.div>
            </Card>
        </motion.div>
    );
}

// Stats Card Component


export default function Dashboard() {
    const [currentTier, setCurrentTier] = useState<"free" | "plus" | "pro">("free");
    const [isLoading, setIsLoading] = useState(true);


    const getBillingStatus = useAction(api.polar.getBillingStatus);

    useEffect(() => {
        async function fetchBillingStatus() {
            try {
                const status = await getBillingStatus();
                if (status) {
                    // Use the tier field directly from the backend (preferred method)
                    if (status.tier) {
                        const backendTier = status.tier.toLowerCase() as "free" | "plus" | "pro";
                        setCurrentTier(backendTier);
                    } else {
                        // Fallback: check product IDs (for backwards compatibility)
                        const productId = status.subscription?.product?.id || status.subscription?.productId;

                        if (
                            productId === import.meta.env.VITE_POLAR_PRODUCT_ID_MONTHLY_PRO ||
                            productId === import.meta.env.VITE_POLAR_PRODUCT_ID_LIFETIME_PRO
                        ) {
                            setCurrentTier("pro");
                        } else if (
                            productId === import.meta.env.VITE_POLAR_PRODUCT_ID_MONTHLY_PLUS ||
                            productId === import.meta.env.VITE_POLAR_PRODUCT_ID_LIFETIME_PLUS
                        ) {
                            setCurrentTier("plus");
                        } else if (status.isPremium) {
                            // Has premium but unknown product - default to plus
                            setCurrentTier("plus");
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch billing status:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBillingStatus();
    }, [getBillingStatus]);

    const tierConfig = {
        free: { variant: "secondary" as const, icon: Zap, className: "" },
        plus: { variant: "outline" as const, className: "bg-secondary text-secondary-foreground border-transparent", icon: Sparkles },
        pro: { variant: "default" as const, icon: Crown, className: "" },
    };

    const TierIcon = tierConfig[currentTier].icon;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <SEO
                title={PAGE_SEO.dashboard.title}
                description={PAGE_SEO.dashboard.description}
                path="/dashboard"
                keywords={PAGE_SEO.dashboard.keywords}
                noIndex={true}
            />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Welcome back! Here's an overview of your account.
                        </p>
                    </div>

                    {/* Current Tier Badge */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Badge
                            variant={tierConfig[currentTier].variant}
                            className={`px - 4 py - 2 text - sm gap - 2 ${tierConfig[currentTier].className || ''} `}
                        >
                            <TierIcon className="w-5 h-5" />
                            <span className="font-medium capitalize">{currentTier} Plan</span>
                        </Badge>
                    </motion.div>
                </motion.div>



                {/* Upgrade Banner for non-Pro users */}
                {currentTier !== "pro" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-muted/30 border-primary/20 mb-8 overflow-hidden">
                            <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                        <Crown className="w-5 h-5 text-primary" />
                                        Upgrade to {currentTier === "free" ? "Plus or " : ""}Pro
                                    </h3>
                                    <p className="text-muted-foreground mt-1">
                                        Unlock all features and get priority support.
                                    </p>
                                </div>
                                <Button asChild className="group">
                                    <Link
                                        to="/pricing"
                                        className="gap-2 shadow-md shadow-primary/20"
                                    >
                                        <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                                        View Plans
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-foreground mb-6">Features</h2>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Free Features */}
                    <FeatureCard
                        title="Basic Analytics"
                        description="Track your usage and performance with simple charts and metrics."
                        icon={BarChart3}
                        requiredTier="free"
                        currentTier={currentTier}
                    >
                        <div className="text-sm text-primary">✓ Available</div>
                    </FeatureCard>

                    <FeatureCard
                        title="Basic Settings"
                        description="Customize your profile and basic preferences."
                        icon={Settings}
                        requiredTier="free"
                        currentTier={currentTier}
                    >
                        <div className="text-sm text-primary">✓ Available</div>
                    </FeatureCard>

                    {/* Plus Features */}
                    <FeatureCard
                        title="Advanced Analytics"
                        description="Dive deeper with detailed reports, exports, and trend analysis."
                        icon={BarChart3}
                        requiredTier="plus"
                        currentTier={currentTier}
                    >
                        <div className="text-sm text-primary">✓ Available</div>
                    </FeatureCard>

                    <FeatureCard
                        title="Team Collaboration"
                        description="Invite team members and collaborate on projects together."
                        icon={Users}
                        requiredTier="plus"
                        currentTier={currentTier}
                    >
                        <div className="text-sm text-primary">✓ Available</div>
                    </FeatureCard>

                    <FeatureCard
                        title="Priority Queue"
                        description="Your requests are processed faster than free tier users."
                        icon={Rocket}
                        requiredTier="plus"
                        currentTier={currentTier}
                    >
                        <div className="text-sm text-primary">✓ Available</div>
                    </FeatureCard>

                    {/* Pro Features */}
                    <FeatureCard
                        title="White-Label Options"
                        description="Remove branding and customize the interface for your clients."
                        icon={Palette}
                        requiredTier="pro"
                        currentTier={currentTier}
                    >
                        <div className="text-sm text-primary">✓ Available</div>
                    </FeatureCard>

                    <FeatureCard
                        title="API Access"
                        description="Full programmatic access to all features via our REST API."
                        icon={Globe}
                        requiredTier="pro"
                        currentTier={currentTier}
                    >
                        <div className="text-sm text-primary">✓ Available</div>
                    </FeatureCard>

                    <FeatureCard
                        title="Priority Support"
                        description="Get direct access to our support team with faster response times."
                        icon={Shield}
                        requiredTier="pro"
                        currentTier={currentTier}
                    >
                        <div className="text-sm text-primary">✓ Available</div>
                    </FeatureCard>

                    <FeatureCard
                        title="Custom Integrations"
                        description="Connect with your existing tools and workflows seamlessly."
                        icon={Settings}
                        requiredTier="pro"
                        currentTier={currentTier}
                    >
                        <div className="text-sm text-primary">✓ Available</div>
                    </FeatureCard>
                </motion.div>
            </div>
        </div>
    );
}
