import React from 'react';
import ContentPageLayout from './ContentPageLayout';
import { ContentSection } from './ContentComponents';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ: React.FC = () => {
    return (
        <ContentPageLayout
            title="Frequently Asked Questions"
            subtitle="Common questions"
            description="Find answers to common questions about the platform. Learn how to sign up, use features, and manage subscriptions."
            keywords="FAQ, help, support, questions, guide"
        >
            <ContentSection title="Account & Profile">
                <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="item-1" className="border border-border/50 rounded-lg px-6 bg-muted/20">
                        <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                            How do I sign up?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            You can sign up using your social accounts. This helps us verify that you are a real person.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border border-border/50 rounded-lg px-6 bg-muted/20">
                        <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                            Can I change my profile details?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            Yes! Go to your profile to edit your information, interests, and showcase your skills.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ContentSection>

            <ContentSection title="Matching & Discovery">
                <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="item-1" className="border border-border/50 rounded-lg px-6 bg-muted/20">
                        <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                            How does discovery work?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            Our feed shows you active members in the community based on your preferences.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border border-border/50 rounded-lg px-6 bg-muted/20">
                        <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                            What are "Connects"?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            A "Connect" is a request to chat. Free users may have limits on daily requests, while Premium users typically enjoy more or unlimited access.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ContentSection>

            <ContentSection title="Subscriptions & Billing">
                <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="item-1" className="border border-border/50 rounded-lg px-6 bg-muted/20">
                        <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                            How do I upgrade to Premium?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            Go to the Subscription or Premium tab in the app to view available plans.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border border-border/50 rounded-lg px-6 bg-muted/20">
                        <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                            Who handles the billing?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            We use a secure third-party payment provider. All payments are managed securely.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border border-border/50 rounded-lg px-6 bg-muted/20">
                        <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                            Can I get a refund?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            Generally, purchases are non-refundable. However, if you have a technical issue, please contact support.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ContentSection>

            <ContentSection title="Safety">
                <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="item-1" className="border border-border/50 rounded-lg px-6 bg-muted/20">
                        <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                            How do I report a bad actor?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            If someone is spamming or harassing, use the report button on their profile.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ContentSection>
        </ContentPageLayout>
    );
};

export default FAQ;

