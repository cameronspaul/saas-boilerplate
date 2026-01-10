import React from 'react';
import ContentPageLayout from './ContentPageLayout';
import { Subsection } from './ContentComponents';

const Contact: React.FC = () => {
    return (
        <ContentPageLayout
            title="Contact Us"
            subtitle="We'd love to hear from you"
            description="Contact support for help with your account, billing questions, legal inquiries, security reports, or press inquiries."
            keywords="contact, support email, customer service, help desk, technical support, legal contact, security contact"
        >
            <p className="text-lg text-center text-muted-foreground mb-12">
                Whether you have a bug report, a feature request, or just want to say hi.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
                <Subsection title="Support">
                    <p className="mb-4">For account issues, billing questions, or technical support:</p>
                    <a href="mailto:support@example.com" className="text-primary hover:text-primary/80 font-semibold text-lg transition-colors">
                        support@example.com
                    </a>
                </Subsection>

                <Subsection title="Legal">
                    <p className="mb-4">For questions about our Terms of Service or Privacy Policy:</p>
                    <a href="mailto:legal@example.com" className="text-primary hover:text-primary/80 font-semibold text-lg transition-colors">
                        legal@example.com
                    </a>
                </Subsection>

                <Subsection title="Security">
                    <p className="mb-4">To report a vulnerability or security concern:</p>
                    <a href="mailto:security@example.com" className="text-primary hover:text-primary/80 font-semibold text-lg transition-colors">
                        security@example.com
                    </a>
                </Subsection>

                <Subsection title="Press">
                    <p className="mb-4">For media inquiries:</p>
                    <a href="mailto:press@example.com" className="text-primary hover:text-primary/80 font-semibold text-lg transition-colors">
                        press@example.com
                    </a>
                </Subsection>
            </div>
        </ContentPageLayout>
    );
};

export default Contact;

