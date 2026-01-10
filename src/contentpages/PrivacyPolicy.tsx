import React from 'react';
import ContentPageLayout from './ContentPageLayout';
import { ContentSection, Subsection } from './ContentComponents';

const PrivacyPolicy: React.FC = () => {
    return (
        <ContentPageLayout
            title="Privacy Policy"
            subtitle="Last Updated: [Date]"
            description="Our privacy policy explains how we collect, use, and protect your data. Learn about data sharing, user rights, cookies, and privacy practices."
            keywords="privacy policy, data protection, user data, data collection, user rights, information security"
        >
            <ContentSection title="Introduction">
                <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground font-semibold">Our Platform</strong> respects your privacy. This policy explains how we handle your data when you use our social network.
                </p>
            </ContentSection>

            <ContentSection title="Information We Collect">
                <div className="grid gap-6 md:grid-cols-1">
                    <Subsection title="Account Data">
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong className="text-foreground">Identity:</strong> Name, email, and profile photo (from your login provider).</li>
                            <li><strong className="text-foreground">Profile Data:</strong> Information you provide in your profile.</li>
                            <li><strong className="text-foreground">Content:</strong> Content you create or post on the platform.</li>
                        </ul>
                    </Subsection>

                    <Subsection title="Usage Data">
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong className="text-foreground">Interactions:</strong> Likes, messages, and other interactions on the platform.</li>
                        </ul>
                    </Subsection>
                </div>
            </ContentSection>

            <ContentSection title="How We Use Your Data">
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li>
                        <strong className="text-foreground">Service Delivery:</strong> To display your profile to others and facilitate messaging.
                    </li>
                    <li>
                        <strong className="text-foreground">Security:</strong> To detect bot activity and ensure platform safety.
                    </li>
                    <li>
                        <strong className="text-foreground">Billing:</strong> To process payments via our payment provider.
                    </li>
                </ul>
            </ContentSection>

            <ContentSection title="Data Sharing">
                <p className="mb-4 text-muted-foreground">We do not sell your personal data. We share data only in these limited circumstances:</p>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li>
                        <strong className="text-foreground">Service Providers:</strong> With hosting, analytics, and payment processors.
                    </li>
                    <li>
                        <strong className="text-foreground">Public Profile:</strong> Your profile information (excluding email/phone) is visible to other users on the platform.
                    </li>
                    <li>
                        <strong className="text-foreground">Legal:</strong> If required by law.
                    </li>
                </ul>
            </ContentSection>

            <ContentSection title="Your Rights">
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li>
                        <strong className="text-foreground">Access & Edit:</strong> You can edit your profile directly in the app.
                    </li>
                    <li>
                        <strong className="text-foreground">Delete:</strong> You can delete your account from the Settings menu.
                    </li>
                    <li>
                        <strong className="text-foreground">Export:</strong> You can request a copy of your data by contacting support.
                    </li>
                </ul>
            </ContentSection>

            <ContentSection title="Cookies">
                <p className="text-muted-foreground leading-relaxed">
                    We use cookies for authentication and to remember your preferences (like theme settings).
                </p>
            </ContentSection>

            <div className="pt-8 mt-8 border-t border-border/30">
                <ContentSection title="Contact Us" variant="compact">
                    <p className="text-muted-foreground">
                        For privacy concerns, email:{' '}
                        <a href="mailto:privacy@example.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                            privacy@example.com
                        </a>
                    </p>
                </ContentSection>
            </div>
        </ContentPageLayout>
    );
};

export default PrivacyPolicy;
