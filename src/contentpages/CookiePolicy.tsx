import React from 'react';
import ContentPageLayout from './ContentPageLayout';
import { ContentSection } from './ContentComponents';

const CookiePolicy: React.FC = () => {
    return (
        <ContentPageLayout
            title="Cookie Policy"
            subtitle="Last Updated: [Date]"
            description="Learn about our cookie usage, including essential cookies for authentication, security, and preferences, plus analytics cookies."
            keywords="cookies, cookie policy, browser cookies, privacy preferences, essential cookies, analytics cookies, tracking, data privacy"
        >
            <ContentSection title="What Are Cookies?">
                <p className="text-muted-foreground leading-relaxed">
                    Cookies are small text files stored on your device. We use them to make the app work efficiently.
                </p>
            </ContentSection>

            <ContentSection title="Essential Cookies">
                <p className="mb-4 text-muted-foreground">We use these cookies to:</p>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li>
                        <strong className="text-foreground">Keep you logged in:</strong> Remembering your session information.
                    </li>
                    <li>
                        <strong className="text-foreground">Security:</strong> Preventing attacks and ensuring safe browsing.
                    </li>
                </ul>
            </ContentSection>

            <ContentSection title="Analytics Cookies">
                <p className="text-muted-foreground leading-relaxed">
                    We may use anonymous analytics to see which features are used most. This helps us improve the user experience.
                </p>
            </ContentSection>

            <ContentSection title="Managing Cookies">
                <p className="text-muted-foreground leading-relaxed">
                    You can control cookies through your browser settings. However, disabling essential cookies will break the login functionality.
                </p>
            </ContentSection>

            <div className="pt-8 mt-8 border-t border-border/30">
                <ContentSection title="Contact" variant="compact">
                    <p className="text-muted-foreground">
                        Questions? Email{' '}
                        <a href="mailto:privacy@example.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                            privacy@example.com
                        </a>
                        .
                    </p>
                </ContentSection>
            </div>
        </ContentPageLayout>
    );
};

export default CookiePolicy;
