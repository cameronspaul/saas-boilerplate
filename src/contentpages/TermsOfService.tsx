import React from 'react';
import { Link } from 'react-router-dom';
import ContentPageLayout from './ContentPageLayout';
import { ContentSection, Subsection } from './ContentComponents';

const TermsOfService: React.FC = () => {
    return (
        <ContentPageLayout
            title="Terms of Service"
            subtitle="Last Updated: [Date]"
            description="Read our Terms of Service covering eligibility, account security, community rules, content ownership, subscriptions, billing, and user responsibilities."
            keywords="terms of service, user agreement, legal terms, community rules, account terms, subscription terms, platform rules"
        >
            <ContentSection title="Introduction">
                <p className="text-muted-foreground leading-relaxed">
                    Welcome to <strong className="text-foreground font-semibold">The Platform</strong> ("we," "us," "our"). This is a platform designed for connection and collaboration. By accessing our website or using our services, you agree to be bound by these Terms of Service ("Terms").
                </p>
            </ContentSection>

            <ContentSection title="Eligibility">
                <p className="text-muted-foreground leading-relaxed">
                    You must be at least 18 years old to use our services. By creating an account, you represent that you are capable of forming a binding contract and are not barred from using the Service under applicable laws.
                </p>
            </ContentSection>

            <ContentSection title="Account & Security">
                <p className="mb-4 text-muted-foreground leading-relaxed">
                    You can sign up using your preferred authentication provider. You are responsible for maintaining the security of your account credentials.
                </p>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li>
                        <strong className="text-foreground">Profile Content:</strong> You are responsible for the accuracy of your profile information.
                    </li>
                </ul>
            </ContentSection>

            <ContentSection title="Community Rules">
                <p className="mb-6 text-muted-foreground">We expect all users to adhere to these standards:</p>

                <div className="grid gap-6 md:grid-cols-1">
                    <Subsection title="Dos">
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong className="text-foreground">Be Authentic:</strong> Share real information about yourself.</li>
                            <li><strong className="text-foreground">Be Constructive:</strong> Engage positively with others.</li>
                            <li><strong className="text-foreground">Respect Boundaries:</strong> Respect the decisions and privacy of others.</li>
                        </ul>
                    </Subsection>

                    <Subsection title="Don'ts">
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong className="text-foreground">No Harassment:</strong> We have a zero-tolerance policy for harassment or bullying.</li>
                            <li><strong className="text-foreground">No Spam:</strong> Automated messages or mass solicitation is prohibited.</li>
                            <li><strong className="text-foreground">No Hate Speech:</strong> We do not tolerate any form of hate speech.</li>
                        </ul>
                    </Subsection>
                </div>
            </ContentSection>

            <ContentSection title="Content & Intellectual Property">
                <Subsection title="Your Content">
                    You retain ownership of the content you post. By posting, you grant us a license to display, distribute, and promote your content within the Service.
                </Subsection>
            </ContentSection>

            <ContentSection title="Subscriptions & Billing">
                <Subsection title="Payments">
                    <p className="mb-4">We may offer paid features or subscriptions.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong className="text-foreground">Billing:</strong> Payments are processed securely via our payment provider.</li>
                        <li><strong className="text-foreground">Cancellation:</strong> You can manage your subscription settings in your account portal.</li>
                        <li>
                            <strong className="text-foreground">Refunds:</strong> Please refer to our{' '}
                            <Link to="/refund-policy" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                                Refund Policy
                            </Link>{' '}
                            for details.
                        </li>
                    </ul>
                </Subsection>
            </ContentSection>

            <ContentSection title="Termination">
                <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to suspend or terminate your account if you violate these Terms.
                </p>
            </ContentSection>

            <ContentSection title="Disclaimers">
                <p className="text-muted-foreground leading-relaxed">
                    The service is provided "AS IS." We do not guarantee specific results from using our platform.
                </p>
            </ContentSection>

            <div className="pt-8 mt-8 border-t border-border/30">
                <ContentSection title="Contact" variant="compact">
                    <p className="text-muted-foreground">
                        For legal inquiries, please contact us at:{' '}
                        <a href="mailto:legal@example.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                            legal@example.com
                        </a>
                    </p>
                </ContentSection>
            </div>
        </ContentPageLayout>
    );
};

export default TermsOfService;
