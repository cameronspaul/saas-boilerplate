import React from 'react';
import ContentPageLayout from './ContentPageLayout';
import { ContentSection, Subsection } from './ContentComponents';

const SafetyAndSecurity: React.FC = () => {
    return (
        <ContentPageLayout
            title="Safety & Security"
            subtitle="Protecting you and your data"
            description="Learn about our security measures including authentication, encryption, and reporting tools."
            keywords="security, platform safety, authentication, encryption, data protection, safe platform"
        >
            <p className="text-lg text-center text-muted-foreground mb-12">
                Your data should be secure. Here is how we protect you.
            </p>

            <ContentSection title="Authentication Security">
                <Subsection title="Secure Login">
                    We use secure authentication providers. We do not store your passwords.
                </Subsection>
            </ContentSection>

            <ContentSection title="Data Protection">
                <div className="grid gap-6 md:grid-cols-1">
                    <Subsection title="Encryption">
                        All data is encrypted in transit using TLS/SSL.
                    </Subsection>

                    <Subsection title="Payment Security">
                        We do not store your credit card details. All billing is handled by a dedicated payment provider.
                    </Subsection>
                </div>
            </ContentSection>

            <ContentSection title="Community Safety">
                <Subsection title="Reporting Tools">
                    You can report any user directly from their profile. Our moderation team reviews these reports.
                </Subsection>
            </ContentSection>

            <div className="pt-8 mt-8 border-t border-border/30">
                <ContentSection title="Responsible Disclosure" variant="compact">
                    <p className="mb-4 text-muted-foreground leading-relaxed">
                        If you find a bug, please let us know.
                    </p>
                    <p className="text-muted-foreground">
                        <strong className="text-foreground">Contact:</strong>{' '}
                        <a href="mailto:security@example.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                            security@example.com
                        </a>
                    </p>
                </ContentSection>
            </div>
        </ContentPageLayout>
    );
};

export default SafetyAndSecurity;
