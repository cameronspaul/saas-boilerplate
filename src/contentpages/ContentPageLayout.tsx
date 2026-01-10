import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';

interface ContentPageLayoutProps {
    title: string;
    subtitle?: string;
    description?: string;
    keywords?: string;
    children: React.ReactNode;
}

const ContentPageLayout: React.FC<ContentPageLayoutProps> = ({
    title,
    subtitle,
    description,
    keywords,
    children
}) => {
    const location = useLocation();

    // Scroll to top whenever this layout mounts (i.e., when navigating to any content page)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Convert comma-separated keywords string to array
    const keywordsArray = keywords
        ? keywords.split(',').map(k => k.trim())
        : [];

    return (
        <>
            <SEO
                title={title}
                description={description || subtitle || `${title} - Learn more about our policies and guidelines.`}
                path={location.pathname}
                keywords={keywordsArray}
            />
            <div className="min-h-screen">
                <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="space-y-6 text-center mb-12">
                        <div className="space-y-3">
                            <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {description && (
                            <p className="text-base text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Content Card */}
                    <Card className="border-border/50 shadow-2xl bg-card/50 backdrop-blur-sm">
                        <CardContent className="space-y-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default ContentPageLayout;
