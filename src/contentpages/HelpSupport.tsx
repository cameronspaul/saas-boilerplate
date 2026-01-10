import React from 'react';
import ContentPageLayout from './ContentPageLayout';
import { ContentSection, Subsection } from './ContentComponents';

const HelpSupport: React.FC = () => {
    return (
        <ContentPageLayout
            title="Help & Support"
            subtitle="Need help?"
            description="Browse help topics including getting started, discovery, subscriptions, and safety features."
            keywords="help, support, questions, guide, troubleshooting"
        >
            <ContentSection title="Getting Started">
                <div className="grid gap-6 md:grid-cols-1">
                    <Subsection title="Creating an Account">
                        Sign up with your preferred social provider to get started and create your profile.
                    </Subsection>

                    <Subsection title="Profile Setup">
                        Add your details, skills, and projects to complete your profile. A complete profile helps you find better matches.
                    </Subsection>
                </div>
            </ContentSection>

            <ContentSection title="Discovery & Matching">
                <div className="grid gap-6 md:grid-cols-1">
                    <Subsection title="Browsing">
                        View other members in the feed. Interact with those who share your interests.
                    </Subsection>

                    <Subsection title="Connects">
                        Send requests to chat. Manage your connections in the messages tab.
                    </Subsection>
                </div>
            </ContentSection>

            <ContentSection title="Subscriptions & Billing">
                <div className="grid gap-6 md:grid-cols-1">
                    <Subsection title="Premium Plans">
                        Upgrade for enhanced features. Check the pricing page for details on available plans.
                    </Subsection>

                    <Subsection title="Billing Support">
                        Manage your subscription and payment methods through the customer portal.
                    </Subsection>
                </div>
            </ContentSection>

            <ContentSection title="Safety & Privacy">
                <div className="grid gap-6 md:grid-cols-1">
                    <Subsection title="Reporting Issues">
                        Help keep the community safe. Report any toxic behavior or spam using the report feature.
                    </Subsection>

                    <Subsection title="Blocking Users">
                        You can block any user to prevent them from contacting you.
                    </Subsection>

                    <Subsection title="Data Protection">
                        We value your privacy. We only use your data to provide the service.
                    </Subsection>
                </div>
            </ContentSection>
        </ContentPageLayout>
    );
};

export default HelpSupport;
