import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentProcessingProps {
    checkoutId: string;
    onClose: () => void;
}

export function PaymentProcessing({ checkoutId, onClose }: PaymentProcessingProps) {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const expectedTier = sessionStorage.getItem("checkout_expected_tier") || "your plan";

    // Poll the checkout status
    const checkoutStatus = useQuery(api.checkouts.getCheckoutStatus, { checkoutId });

    useEffect(() => {
        if (checkoutStatus?.status === "paid") {
            // Show success state briefly before redirecting
            setShowSuccess(true);
            sessionStorage.removeItem("checkout_expected_tier");

            const timer = setTimeout(() => {
                navigate("/dashboard?success=true");
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [checkoutStatus, navigate]);

    const isPending = !checkoutStatus || checkoutStatus.status === "pending";
    const isPaid = checkoutStatus?.status === "paid" || showSuccess;
    const isFailed = checkoutStatus?.status === "failed";

    return (
        <Dialog open={true} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {isPaid ? "Payment Successful!" : isFailed ? "Payment Failed" : "Processing Payment"}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {isPaid
                            ? `Welcome to ${expectedTier}! Redirecting to your dashboard...`
                            : isFailed
                                ? "There was an issue processing your payment."
                                : `Please wait while we confirm your ${expectedTier} purchase...`}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-8 gap-4">
                    {isPending && (
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    )}
                    {isPaid && (
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    )}
                    {isFailed && (
                        <>
                            <XCircle className="h-12 w-12 text-destructive" />
                            <Button onClick={onClose} variant="outline">
                                Try Again
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
