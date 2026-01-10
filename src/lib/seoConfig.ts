/**
 * SEO Configuration
 * 
 * Update these values for your site. This configuration is used by the SEO component
 * and should be updated before deploying to production.
 */

export const SEO_CONFIG = {
    // Site Information
    siteName: 'YourSaaS',
    siteUrl: 'https://yoursaas.com', // Change this to your production URL

    // Default Meta Tags
    defaultTitle: 'YourSaaS | The Ultimate SaaS Boilerplate',
    defaultDescription: 'Launch your next big idea in days, not months. A modern, production-ready SaaS boilerplate with React, Vite, Tailwind CSS, and Shadcn UI.',
    defaultKeywords: [
        'saas',
        'boilerplate',
        'react',
        'vite',
        'tailwind',
        'shadcn',
        'typescript',
        'starter kit',
        'fullstack',
    ],

    // Open Graph / Social
    defaultImage: '/icon.png',
    twitterHandle: '@yoursaas',

    // Organization/Author Info
    author: 'YourSaaS Team',
    organizationName: 'YourSaaS Inc.',

    // Theme
    themeColor: '#000000',

    // Feature Flags
    enableJsonLd: true, // Enable structured data
    enableOpenGraph: true,
    enableTwitterCards: true,
};

/**
 * Page-specific SEO configurations
 */
export const PAGE_SEO = {
    home: {
        title: 'Home',
        description: 'Launch your SaaS in record time with our comprehensive boilerplate.',
        keywords: ['saas', 'home', 'app', 'starter'],
    },
    pricing: {
        title: 'Pricing',
        description: 'Simple and transparent pricing plans for every stage of your growth.',
        keywords: ['pricing', 'subscription', 'plans', 'cost'],
    },
    faq: {
        title: 'Frequently Asked Questions',
        description: 'Find answers to common questions about our platform and services.',
        keywords: ['FAQ', 'help', 'questions', 'support', 'guide'],
    },
    about: {
        title: 'About Us',
        description: 'Learn more about our mission, our values, and the team behind YourSaaS.',
        keywords: ['about', 'team', 'company', 'mission'],
    },
    contact: {
        title: 'Contact Us',
        description: 'Have questions? We are here to help. Get in touch with our team.',
        keywords: ['contact', 'support', 'help', 'email', 'form'],
    },
    blog: {
        title: 'Blog',
        description: 'Latest news, tips, and insights from our team.',
        keywords: ['blog', 'news', 'articles', 'insights'],
    },
    helpSupport: {
        title: 'Help & Support',
        description: 'Browse help topics including getting started, discovery, subscriptions, and safety features.',
        keywords: ['help', 'support', 'questions', 'guide', 'troubleshooting'],
    },
    privacyPolicy: {
        title: 'Privacy Policy',
        description: 'Our privacy policy explains how we collect, use, and protect your data.',
        keywords: ['privacy policy', 'data protection', 'user data', 'information security'],
    },
    termsOfService: {
        title: 'Terms of Service',
        description: 'Read our Terms of Service covering eligibility, account security, community rules, and user responsibilities.',
        keywords: ['terms of service', 'user agreement', 'legal terms', 'community rules'],
    },
    cookiePolicy: {
        title: 'Cookie Policy',
        description: 'Learn about our cookie usage, including essential cookies for authentication, security, and preferences.',
        keywords: ['cookies', 'cookie policy', 'privacy preferences', 'data privacy'],
    },
    communityGuidelines: {
        title: 'Community Guidelines',
        description: 'Read our community guidelines to understand expected behavior, code of conduct, and prohibited content.',
        keywords: ['community guidelines', 'code of conduct', 'community rules', 'safe space'],
    },
    refundPolicy: {
        title: 'Refund Policy',
        description: 'Understand our refund policy for purchases, including eligibility, exceptions, and how to request a refund.',
        keywords: ['refund', 'refund policy', 'money back', 'subscription refund'],
    },
    cancellationPolicy: {
        title: 'Cancellation Policy',
        description: 'Learn how to cancel your subscription and understand the cancellation process and billing cycle effects.',
        keywords: ['cancellation', 'cancel subscription', 'billing policy'],
    },
    safetyAndSecurity: {
        title: 'Safety & Security',
        description: 'Learn about our security measures including authentication, encryption, and reporting tools.',
        keywords: ['security', 'platform safety', 'authentication', 'data protection'],
    },
    reportBlockFunctionality: {
        title: 'Report & Block Functionality',
        description: 'Learn how to report spam, harassment, or toxic behavior and how to block users.',
        keywords: ['report', 'block user', 'user safety', 'moderation', 'report abuse'],
    },
    notFound: {
        title: '404 - Page Not Found',
        description: 'The page you are looking for does not exist.',
        keywords: ['404', 'not found', 'error'],
    },
    dashboard: {
        title: 'Dashboard',
        description: 'Manage your projects and view your analytics.',
        keywords: ['dashboard', 'admin', 'analytics'],
    }
};

export default SEO_CONFIG;

