import React from 'react';
import ContentPageLayout from './ContentPageLayout';
import { ContentSection } from './ContentComponents';

const RefundPolicy: React.FC = () => {
    return (
        <ContentPageLayout
            title="Refund Policy"
            subtitle="Last Updated: [Date]"
            description="Understand our refund policy for purchases. Learn about refund eligibility, exceptions, and how to request a refund."
            keywords="refund, refund policy, money back, premium refund, chargeback policy, subscription refund"
        >
            <ContentSection title="General Policy">
                <p className="text-muted-foreground leading-relaxed">
                    Since our service offers immediate access to digital features,{' '}
                    <strong className="text-foreground">all purchases are final and non-refundable</strong>.
                </p>
            </ContentSection>

            <ContentSection title="Exceptions">
                <p className="mb-4 text-muted-foreground">We may offer a refund in limited cases:</p>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li>
                        <strong className="text-foreground">Technical Error:</strong> You were charged due to a technical glitch.
                    </li>
                    <li>
                        <strong className="text-foreground">Fraud:</strong> The purchase was made without your authorization.
                    </li>
                </ul>
            </ContentSection>

            <ContentSection title="How to Request a Refund">
                <p className="mb-4 text-muted-foreground">All billing is handled by our payment provider.</p>
                <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
                    <li>
                        Contact{' '}
                        <a href="mailto:support@example.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                            support@example.com
                        </a>{' '}
                        with your Order ID.
                    </li>
                    <li>Explain the reason for your request.</li>
                    <li>We will review it promptly.</li>
                </ol>
            </ContentSection>

            <ContentSection title="Chargebacks">
                <p className="text-muted-foreground leading-relaxed">
                    Please contact us before filing a chargeback. We are happy to resolve legitimate issues.
                </p>
            </ContentSection>
        </ContentPageLayout>
    );
};

export default RefundPolicy;
