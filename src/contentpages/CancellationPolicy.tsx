import React from 'react';
import ContentPageLayout from './ContentPageLayout';
import { ContentSection, Subsection } from './ContentComponents';

const CancellationPolicy: React.FC = () => {
    return (
        <ContentPageLayout
            title="Cancellation Policy"
            subtitle="Last Updated: [Date]"
            description="Learn how to cancel your subscription. Understand the cancellation process, billing cycle effects, and how to manage your subscription."
            keywords="cancellation, cancel subscription, billing policy, cancel premium, refund policy"
        >
            <ContentSection title="How to Cancel">
                <p className="mb-6 text-muted-foreground leading-relaxed">
                    You can cancel your subscription at any time.
                </p>

                <div className="grid gap-6 md:grid-cols-1">
                    <Subsection title="Via the App">
                        <ol className="list-decimal pl-6 space-y-2">
                            <li>Go to <strong className="text-foreground">Settings</strong>.</li>
                            <li>Tap <strong className="text-foreground">Manage Subscription</strong>.</li>
                            <li>You will be redirected to the customer portal.</li>
                            <li>Select your active subscription and click <strong className="text-foreground">Cancel</strong>.</li>
                        </ol>
                    </Subsection>

                    <Subsection title="Via Email">
                        <p>
                            If you cannot access the app, you can contact us at{' '}
                            <a href="mailto:support@example.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                                support@example.com
                            </a>{' '}
                            with your account email.
                        </p>
                    </Subsection>
                </div>
            </ContentSection>

            <ContentSection title="Effect of Cancellation">
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li>
                        <strong className="text-foreground">Access Continues:</strong> You will retain access to Premium features until the end of your current billing cycle.
                    </li>
                    <li>
                        <strong className="text-foreground">No Future Charges:</strong> You will not be charged again unless you restart your subscription.
                    </li>
                    <li>
                        <strong className="text-foreground">Downgrade:</strong> After the period ends, your account will revert to the free plan.
                    </li>
                </ul>
            </ContentSection>

            <ContentSection title="Lifetime Access">
                <p className="text-muted-foreground leading-relaxed">
                    Lifetime purchases are one-time payments and do not need to be canceled.
                </p>
            </ContentSection>
        </ContentPageLayout>
    );
};

export default CancellationPolicy;
