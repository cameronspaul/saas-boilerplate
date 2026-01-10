import React from 'react';
import ContentPageLayout from './ContentPageLayout';
import { ContentSection, Subsection } from './ContentComponents';

const AboutUs: React.FC = () => {
    return (
        <ContentPageLayout
            title="About Us"
            subtitle="Building the future of connection"
            description="Learn about our mission to help people find collaborators, partners, and friends. Discover our story, values, and commitment to authenticity."
            keywords="about us, mission, values, story, connection, community"
        >
            <ContentSection title="Our Mission">
                <p className="text-lg text-muted-foreground leading-relaxed">
                    At <strong className="text-foreground font-semibold">Our Platform</strong>, our mission is to help you find your next great connection. We believe that relationships are the foundation of success. We're building a space where you can connect based on shared interests, goals, and values.
                </p>
            </ContentSection>

            <ContentSection title="Our Story">
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                        This platform was born from a simple observation: traditional networks are often too sterile or disconnected. We wanted to create a space that combines the ease of modern discovery with the depth of real professional and personal connection.
                    </p>
                    <p>
                        We focus on what matters: your <strong className="text-foreground">Work</strong>, your <strong className="text-foreground">Interests</strong>, and your <strong className="text-foreground">Personality</strong>. Whether you're looking for a partner, a mentor, or just someone to chat with, this is the place to be.
                    </p>
                </div>
            </ContentSection>

            <ContentSection title="Our Values">
                <div className="grid gap-6 md:grid-cols-1">
                    <Subsection title="Transparency">
                        We encourage our users to be open and honest. Your profile is a showcase of who you truly are.
                    </Subsection>

                    <Subsection title="Authentic Connection">
                        We prioritize genuine interactions over transactional networking. No spam, just real people.
                    </Subsection>

                    <Subsection title="Safety & Respect">
                        We are committed to maintaining a safe, inclusive environment where everyone feels welcome and respected.
                    </Subsection>
                </div>
            </ContentSection>

            <ContentSection title="The Team">
                <p className="text-muted-foreground leading-relaxed">
                    Created and maintained by <a href="https://github.com/cameronspaul" target="_blank" rel="noreferrer" className="text-foreground font-semibold hover:text-primary underline transition-colors">Cameron Paul</a>. We are dedicated to building tools we believe in, using modern technology to create seamless experiences.
                </p>
            </ContentSection>
        </ContentPageLayout>
    );
};

export default AboutUs;

