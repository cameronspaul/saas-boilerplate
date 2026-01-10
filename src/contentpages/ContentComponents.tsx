import React from 'react';
import { Separator } from '@/components/ui/separator';

interface ContentSectionProps {
    title: string;
    children: React.ReactNode;
    variant?: 'default' | 'compact';
}

export const ContentSection: React.FC<ContentSectionProps> = ({
    title,
    children,
    variant = 'default'
}) => {
    return (
        <section className={variant === 'compact' ? 'space-y-4' : 'space-y-6'}>
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    {title}
                </h2>
                <Separator className="h-1 bg-gradient-to-r from-primary/50 via-primary/20 to-transparent rounded-full" />
            </div>
            <div className={variant === 'compact' ? 'space-y-4' : 'space-y-6'}>
                {children}
            </div>
        </section>
    );
};

interface SubsectionProps {
    title: string;
    children: React.ReactNode;
}

export const Subsection: React.FC<SubsectionProps> = ({ title, children }) => {
    return (
        <div className="space-y-3 p-6 rounded-lg bg-muted/30 border border-border/50 hover:border-border transition-colors">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                {title}
            </h3>
            <div className="text-muted-foreground leading-relaxed pl-5">
                {children}
            </div>
        </div>
    );
};
