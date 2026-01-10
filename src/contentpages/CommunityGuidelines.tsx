import React from 'react';
import ContentPageLayout from './ContentPageLayout';
import { ContentSection, Subsection } from './ContentComponents';

const CommunityGuidelines: React.FC = () => {
    return (
        <ContentPageLayout
            title="Community Guidelines"
            subtitle="Keeping our community safe and respectful."
            description="Read our community guidelines to understand expected behavior, code of conduct, prohibited content, reporting procedures, and consequences for violations."
            keywords="community guidelines, code of conduct, community rules, acceptable behavior, reporting violations, prohibited content, community standards, safe space"
        >
            <p className="text-lg text-center text-muted-foreground mb-12">
                This platform is a community for professionals to connect. To keep this space healthy, we ask you to follow these guidelines.
            </p>

            <ContentSection title="Respect and Kindness">
                <p className="text-muted-foreground leading-relaxed">
                    Treat others with respect. Be kind, constructive, and empathetic in all your interactions.
                </p>
            </ContentSection>

            <ContentSection title="Authentic Representation">
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li>
                        <strong className="text-foreground">Be Real:</strong> Use your real name or established handle.
                    </li>
                    <li>
                        <strong className="text-foreground">Honest Skills:</strong> Accurately represent your skills and experience.
                    </li>
                    <li>
                        <strong className="text-foreground">Real Projects:</strong> Only showcase projects you have legitimately worked on.
                    </li>
                </ul>
            </ContentSection>

            <ContentSection title="Respect Boundaries">
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li>
                        <strong className="text-foreground">No Solicitation:</strong> Do not use the platform to spam users with unwanted offers.
                    </li>
                    <li>
                        <strong className="text-foreground">Unmatching:</strong> If someone disconnects, respect their decision and move on.
                    </li>
                </ul>
            </ContentSection>

            <ContentSection title="Prohibited Content">
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li>
                        <strong className="text-foreground">Malware:</strong> Posting malicious links or software is strictly prohibited.
                    </li>
                    <li>
                        <strong className="text-foreground">Hate Speech:</strong> Any discrimination based on race, gender, sexual orientation, religion, or background is not allowed.
                    </li>
                    <li>
                        <strong className="text-foreground">NSFW:</strong> Keep content appropriate for a general audience.
                    </li>
                </ul>
            </ContentSection>

            <ContentSection title="Reporting">
                <p className="text-muted-foreground leading-relaxed">
                    If you see a violation, please report it. Our team reviews reports regularly.
                </p>
            </ContentSection>

            <ContentSection title="Consequences">
                <p className="mb-4 text-muted-foreground">Violating these guidelines may result in:</p>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li>Content removal.</li>
                    <li>Temporary suspension.</li>
                    <li>Permanent ban from the platform.</li>
                </ul>
            </ContentSection>
        </ContentPageLayout>
    );
};

export default CommunityGuidelines;
