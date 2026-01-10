// IF THIS IS YOUR FIRST TIME EDITING THIS FILE, SO IF YOU CAN READ THIS, make a new file without the "template" prefix

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

import { PageSEO } from "@/components/SEO";
import { PricingCards, CreditBundleCards } from "@/components/PricingCards";
import { PaymentProcessing } from "@/components/PaymentProcessing";

export default function Pricing() {
    const [searchParams, setSearchParams] = useSearchParams();
    const billingStatus = useQuery(api.users.getCurrentUser);
    const credits = useQuery(api.credits.getBalance);

    // Check for checkout_id in URL (returned from Polar after payment)
    const checkoutId = searchParams.get("checkout_id");
    const [showProcessing, setShowProcessing] = useState(!!checkoutId);

    useEffect(() => {
        if (checkoutId) {
            setShowProcessing(true);
        }
    }, [checkoutId]);

    const handleCloseProcessing = () => {
        setShowProcessing(false);
        // Clear the checkout_id from URL
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <PageSEO.Pricing />

            {/* Payment Processing Dialog */}
            {showProcessing && checkoutId && (
                <PaymentProcessing
                    checkoutId={checkoutId}
                    onClose={handleCloseProcessing}
                />
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Unlock powerful features and take your experience to the next level.
                        All plans include our core features.
                    </p>

                    {/* Current Status */}
                    {billingStatus && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Badge variant="secondary" className="mt-6 px-4 py-2 text-sm gap-2 font-normal">
                                <span className="text-muted-foreground">Current balance:</span>
                                <span className="font-semibold text-foreground">{credits ?? 0} credits</span>
                            </Badge>
                        </motion.div>
                    )}
                </motion.div>

                {/* Pricing Cards */}
                <PricingCards />

                {/* Credit Bundles Section */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Need More Credits?
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Purchase additional credits for your account. Credits never expire and can be used across all features.
                        </p>
                    </div>

                    <CreditBundleCards />
                </div>
            </div>
        </div>
    );
}
