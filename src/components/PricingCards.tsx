import { useState, useEffect } from "react";
import { useAction, useConvexAuth, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { plans, creditBundles } from "@/data/pricing-data";

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

export function PricingCards() {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [currentTier, setCurrentTier] = useState<"free" | "plus" | "pro" | "lifetime">("free");
    const [isLifetime, setIsLifetime] = useState(false);
    const [isBillingLoading, setIsBillingLoading] = useState(true);

    const createCheckout = useAction(api.polar.createCheckoutSession);
    const createPendingCheckout = useMutation(api.checkouts.createPendingCheckout);
    const getBillingStatus = useAction(api.polar.getBillingStatus);
    const generatePortalUrl = useAction(api.polar.generateCustomerPortalUrl);
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const { signIn } = useAuthActions();

    const [isManaging, setIsManaging] = useState(false);

    // Combined loading state: still determining what button to show
    const isStatusLoading = isAuthLoading || (isAuthenticated && isBillingLoading);

    useEffect(() => {
        async function fetchBillingStatus() {
            // Don't do anything while auth is still loading
            if (isAuthLoading) {
                return;
            }

            // User is not authenticated - no billing status to fetch
            if (!isAuthenticated) {
                setIsBillingLoading(false);
                return;
            }

            try {
                const status = await getBillingStatus();
                if (status) {
                    // Use the tier field directly from the backend (preferred method)
                    if (status.tier) {
                        const backendTier = status.tier.toLowerCase() as "free" | "plus" | "pro";
                        if (status.isLifetime) {
                            setCurrentTier("lifetime");
                            setIsLifetime(true);
                        } else {
                            setCurrentTier(backendTier);
                        }
                    } else {
                        // Fallback: check product IDs (for backwards compatibility)
                        const productId = status.subscription?.product?.id || status.subscription?.productId;
                        if (status.isLifetime) {
                            setCurrentTier("lifetime");
                            setIsLifetime(true);
                        } else if (
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
                            setCurrentTier("plus");
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch billing status:", error);
            } finally {
                setIsBillingLoading(false);
            }
        }
        fetchBillingStatus();
    }, [getBillingStatus, isAuthenticated, isAuthLoading]);

    const handleSubscribe = async (productId: string, planName: string) => {
        setLoadingPlan(planName);
        try {
            if (!productId) {
                console.error(`Product ID not found for ${planName}`);
                return;
            }

            const result = await createCheckout({
                productId,
                successUrl: `${window.location.origin}/pricing?checkout_id={CHECKOUT_ID}`,
            });

            if ("url" in result && "checkoutId" in result) {
                // Create a pending checkout record in our database
                await createPendingCheckout({
                    checkoutId: result.checkoutId,
                    expectedTier: planName,
                    productId: productId,
                });

                // Store expected tier in session for the processing page
                sessionStorage.setItem("checkout_expected_tier", planName);
                window.location.href = result.url;
            } else if ("error" in result) {
                console.error("Checkout error:", result.error);
            }
        } catch (error) {
            console.error("Failed to create checkout:", error);
        } finally {
            setLoadingPlan(null);
        }
    };

    const handleLoginAndSubscribe = (productId: string, planName: string) => {
        sessionStorage.setItem("pending_checkout", JSON.stringify({
            type: "plan",
            data: { productId, planName }
        }));
        void signIn("github", { redirectTo: "/pricing" });
    };

    const handleManageSubscription = async () => {
        setIsManaging(true);
        try {
            const result = await generatePortalUrl();
            if (result?.url) {
                window.location.href = result.url;
            }
        } catch (error) {
            console.error("Failed to generate portal URL:", error);
        } finally {
            setIsManaging(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            const pending = sessionStorage.getItem("pending_checkout");
            if (pending) {
                try {
                    const { type, data } = JSON.parse(pending);
                    if (type === "plan") {
                        sessionStorage.removeItem("pending_checkout");
                        handleSubscribe(data.productId, data.planName);
                    }
                } catch (e) {
                    console.error("Failed to parse pending checkout", e);
                }
            }
        }
    }, [isAuthenticated]);

    return (
        <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {plans.map((plan) => {
                const Icon = plan.icon;
                const isCurrentPlan = plan.tier === currentTier;
                const isLoading = loadingPlan === plan.name;

                return (
                    <motion.div key={plan.name} variants={itemVariants}>
                        <Card
                            className={`relative transition-all duration-300 flex flex-col h-full ${plan.highlighted
                                ? "border-primary shadow-xl shadow-primary/10"
                                : "hover:border-primary/50"
                                }`}
                        >
                            {/* Popular Badge - outside animation wrapper so it stays fixed */}
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                    <Badge className="px-4 py-1 text-sm shadow-lg">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <motion.div
                                className="flex flex-col h-full"
                                whileHover={{ y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <CardHeader>
                                    {/* Plan Icon & Name */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className={`p-2 rounded-lg ${plan.highlighted
                                                ? "bg-primary/10 text-primary"
                                                : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                        <span className="text-muted-foreground">{plan.period}</span>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-4">
                                        <CardDescription>{plan.description}</CardDescription>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-grow">
                                    {/* Features */}
                                    <div className="space-y-3 mb-4">
                                        {plan.features.map((feature) => (
                                            <div key={feature} className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                                <span className="text-sm text-foreground">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.excluded.map((feature) => (
                                            <div key={feature} className="flex items-center gap-3 opacity-50">
                                                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                                    <div className="w-1.5 h-0.5 bg-muted-foreground rounded-full" />
                                                </div>
                                                <span className="text-sm text-muted-foreground line-through">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    {/* CTA Button */}
                                    {isStatusLoading ? (
                                        <Button
                                            disabled
                                            variant="secondary"
                                            className="w-full"
                                        >
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Loading...
                                        </Button>
                                    ) : !isAuthenticated ? (
                                        <Button
                                            onClick={() => plan.productId && handleLoginAndSubscribe(plan.productId, plan.name)}
                                            className="w-full"
                                        >
                                            Log In to Subscribe
                                        </Button>
                                    ) : isCurrentPlan ||
                                        ((currentTier === "plus" || currentTier === "pro") && (plan.tier === "plus" || plan.tier === "pro")) ||
                                        (isLifetime && plan.tier !== "lifetime" && plan.tier !== "free") ? (
                                        <Button
                                            onClick={handleManageSubscription}
                                            disabled={isManaging}
                                            variant="secondary"
                                            className="w-full"
                                        >
                                            {isManaging ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    Redirecting...
                                                </>
                                            ) : (
                                                "Manage Subscription"
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => plan.productId && handleSubscribe(plan.productId, plan.name)}
                                            disabled={isLoading || plan.tier === "free"}
                                            variant={plan.highlighted ? "default" : "secondary"}
                                            className={`w-full gap-2 ${plan.highlighted ? "shadow-md shadow-primary/20" : ""}`}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : plan.tier === "free" ? (
                                                "Included"
                                            ) : (
                                                `Get ${plan.name}`
                                            )}
                                        </Button>
                                    )}
                                </CardFooter>
                            </motion.div>
                        </Card>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

export function CreditBundleCards() {
    const [loadingCredits, setLoadingCredits] = useState<number | null>(null);
    const createCheckout = useAction(api.polar.createCheckoutSession);
    const createPendingCheckout = useMutation(api.checkouts.createPendingCheckout);
    const { isAuthenticated } = useConvexAuth();
    const { signIn } = useAuthActions();

    const handleBuyCredits = async (bundle: { credits: number; price: number; productId?: string }) => {
        setLoadingCredits(bundle.credits);
        try {
            const productId = bundle.productId || import.meta.env.VITE_POLAR_PRODUCT_ID_CREDITS;
            if (!productId) {
                console.error("Credits product ID not found");
                return;
            }

            const checkoutOptions: any = {
                productId,
                successUrl: `${window.location.origin}/pricing?checkout_id={CHECKOUT_ID}`,
                metadata: {
                    credits: bundle.credits,
                    bundle_name: `${bundle.credits} Credits`,
                },
            };

            // Only send amount if we're using the generic variable-price product
            if (!bundle.productId) {
                checkoutOptions.amount = bundle.price * 100; // Convert to cents
            }

            const result = await createCheckout(checkoutOptions);

            if ("url" in result && "checkoutId" in result) {
                // Create a pending checkout record in our database
                await createPendingCheckout({
                    checkoutId: result.checkoutId,
                    expectedTier: `${bundle.credits} Credits`,
                    productId: productId,
                });

                // Store expected purchase type in session for the processing page
                sessionStorage.setItem("checkout_expected_tier", `${bundle.credits} Credits`);
                window.location.href = result.url;
            } else if ("error" in result) {
                console.error("Checkout error:", result.error);
            }
        } catch (error) {
            console.error("Failed to create checkout:", error);
        } finally {
            setLoadingCredits(null);
        }
    };

    const handleLoginAndBuyCredits = (bundle: any) => {
        sessionStorage.setItem("pending_checkout", JSON.stringify({
            type: "credits",
            data: bundle
        }));
        void signIn("github", { redirectTo: "/pricing" });
    };

    useEffect(() => {
        if (isAuthenticated) {
            const pending = sessionStorage.getItem("pending_checkout");
            if (pending) {
                try {
                    const { type, data } = JSON.parse(pending);
                    if (type === "credits") {
                        sessionStorage.removeItem("pending_checkout");
                        handleBuyCredits(data);
                    }
                } catch (e) {
                    console.error("Failed to parse pending checkout", e);
                }
            }
        }
    }, [isAuthenticated]);

    return (
        <motion.div
            className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {creditBundles.map((bundle) => {
                const isLoading = loadingCredits === bundle.credits;
                const pricePerCredit = (bundle.price / bundle.credits).toFixed(3);

                return (
                    <motion.div key={bundle.credits} variants={itemVariants} className="w-full max-w-sm">
                        <Card
                            className={`relative transition-all duration-300 flex flex-col h-full ${bundle.popular
                                ? "border-primary shadow-md"
                                : "hover:border-primary/50"
                                }`}
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <CardHeader>
                                    {bundle.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <Badge className="px-3 py-0.5 text-xs">
                                                Best Value
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 mb-3">
                                        <CreditCard className={`w-5 h-5 ${bundle.popular ? "text-primary" : "text-muted-foreground"}`} />
                                        <CardTitle className="text-2xl">{bundle.credits}</CardTitle>
                                        <span className="text-muted-foreground font-normal">credits</span>
                                    </div>

                                    <div className="mb-4">
                                        <span className="text-3xl font-bold text-foreground">${bundle.price}</span>
                                        <CardDescription className="text-xs">
                                            ${pricePerCredit} per credit
                                        </CardDescription>
                                    </div>
                                </CardHeader>

                                <CardFooter className="mt-auto">
                                    {!isAuthenticated ? (
                                        <Button
                                            onClick={() => handleLoginAndBuyCredits(bundle)}
                                            className="w-full"
                                        >
                                            Log In to Buy
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleBuyCredits(bundle)}
                                            disabled={isLoading}
                                            variant={bundle.popular ? "default" : "secondary"}
                                            className="w-full gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                "Buy Credits"
                                            )}
                                        </Button>
                                    )}
                                </CardFooter>
                            </motion.div>
                        </Card>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
