import { useState, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Subscription tier types
export type SubscriptionTier = "free" | "plus" | "pro";

export interface SubscriptionStatus {
    tier: SubscriptionTier;
    isPremium: boolean;
    isPlus: boolean;
    isPro: boolean;
    isLifetime: boolean;
    hasSubscription: boolean;
    credits: number;
    isLoading: boolean;
}

// Hook to get the user's subscription status
export function useSubscription(): SubscriptionStatus {
    const [billingStatus, setBillingStatus] = useState<any>(null);
    const [isLoadingBilling, setIsLoadingBilling] = useState(true);

    const getBillingStatus = useAction(api.polar.getBillingStatus);
    const credits = useQuery(api.credits.getBalance);

    useEffect(() => {
        async function fetchBillingStatus() {
            try {
                const status = await getBillingStatus();
                setBillingStatus(status);
            } catch (error) {
                console.error("Failed to fetch billing status:", error);
            } finally {
                setIsLoadingBilling(false);
            }
        }

        fetchBillingStatus();
    }, [getBillingStatus]);

    // Default loading state
    const defaultStatus: SubscriptionStatus = {
        tier: "free",
        isPremium: false,
        isPlus: false,
        isPro: false,
        isLifetime: false,
        hasSubscription: false,
        credits: 0,
        isLoading: true,
    };

    // If still loading
    if (isLoadingBilling || credits === undefined) {
        return defaultStatus;
    }

    // Determine tier based on subscription product
    let tier: SubscriptionTier = "free";
    let isPlus = false;
    let isPro = false;

    if (billingStatus) {
        // First, check if the backend returned a tier directly (preferred method)
        if (billingStatus.tier) {
            const backendTier = billingStatus.tier.toLowerCase() as SubscriptionTier;
            if (backendTier === "pro") {
                tier = "pro";
                isPro = true;
            } else if (backendTier === "plus") {
                tier = "plus";
                isPlus = true;
            }
            // If tier is "free", keep defaults
        } else {
            // Fallback: Determine tier based on product ID (for backwards compatibility)
            const productId = billingStatus.subscription?.product?.id ||
                billingStatus.subscription?.productId;

            // Check for Pro tier
            if (
                productId === import.meta.env.VITE_POLAR_PRODUCT_ID_MONTHLY_PRO ||
                productId === import.meta.env.VITE_POLAR_PRODUCT_ID_LIFETIME_PRO
            ) {
                tier = "pro";
                isPro = true;
            }
            // Check for Plus tier (including lifetime plus if it exists)
            else if (
                productId === import.meta.env.VITE_POLAR_PRODUCT_ID_MONTHLY_PLUS ||
                productId === import.meta.env.VITE_POLAR_PRODUCT_ID_LIFETIME_PLUS
            ) {
                tier = "plus";
                isPlus = true;
            }
            // Has some premium entitlement but unknown product
            else if (billingStatus.isPremium) {
                tier = "free"; // Default to plus if premium but unknown product
                isPlus = false;
            }
        }
    }

    return {
        tier,
        isPremium: billingStatus?.isPremium ?? false,
        isPlus,
        isPro,
        isLifetime: billingStatus?.isLifetime ?? false,
        hasSubscription: billingStatus?.hasSubscription ?? false,
        credits: credits ?? 0,
        isLoading: false,
    };
}

// Helper function to check if user has access to a feature
export function hasFeatureAccess(
    currentTier: SubscriptionTier,
    requiredTier: SubscriptionTier
): boolean {
    const tierHierarchy: Record<SubscriptionTier, number> = {
        free: 0,
        plus: 1,
        pro: 2,
    };

    return tierHierarchy[currentTier] >= tierHierarchy[requiredTier];
}
