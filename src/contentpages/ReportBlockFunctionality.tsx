import React from 'react';
import ContentPageLayout from './ContentPageLayout';
import { ContentSection, Subsection } from './ContentComponents';
import { Badge } from '@/components/ui/badge';

const ReportBlockFunctionality: React.FC = () => {
    return (
        <ContentPageLayout
            title="Report & Block Functionality"
            subtitle="Keeping the platform safe"
            description="Learn how to report spam, harassment, or toxic behavior. Understand the reporting process, blocking users, and how we review violations."
            keywords="report, block user, report harassment, spam reporting, user safety, moderation, report abuse, safety tools"
        >
            <p className="text-lg text-center text-muted-foreground mb-12">
                We want this to be a safe space. If you encounter spam, harassment, or toxic behavior, please use our reporting tools.
            </p>

            <ContentSection title="How to Report a User">
                <div className="grid gap-6 md:grid-cols-1">
                    <Subsection title="From a Profile">
                        <ol className="list-decimal pl-6 space-y-2">
                            <li>Navigate to the user's profile.</li>
                            <li>Tap the <Badge variant="outline" className="inline-flex mx-1">Report Icon</Badge> (usually in the top corner).</li>
                            <li>Select <strong className="text-foreground">Report</strong>.</li>
                            <li>Choose the reason (e.g., Spam, Harassment).</li>
                            <li>Add any details that will help our moderators.</li>
                            <li>Tap <strong className="text-foreground">Submit</strong>.</li>
                        </ol>
                    </Subsection>

                    <Subsection title="From a Chat">
                        <ol className="list-decimal pl-6 space-y-2">
                            <li>Open the conversation.</li>
                            <li>Tap the options menu.</li>
                            <li>Select <strong className="text-foreground">Report</strong>.</li>
                        </ol>
                    </Subsection>
                </div>
            </ContentSection>

            <ContentSection title="How to Block a User">
                <p className="mb-6 text-muted-foreground leading-relaxed">
                    Blocking prevents a user from seeing your profile or messaging you.
                </p>
                <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
                    <li>Tap the menu icon on their profile.</li>
                    <li>Select <strong className="text-foreground">Block</strong>.</li>
                    <li>Confirm your choice.</li>
                </ol>
            </ContentSection>
        </ContentPageLayout>
    );
};

export default ReportBlockFunctionality;
