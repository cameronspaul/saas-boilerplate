# 🚀 React + Vite + Tailwind CSS v4 SaaS Boilerplate

A modern, fast, and feature-rich SaaS boilerplate built with React 19, Convex, and Polar to jumpstart your next production-ready application.

## ✨ Features

- ⚡ **Vite 7** - Lightning-fast development and optimized builds
- ⚛️ **React 19** - Utilizing the latest features of the React ecosystem
- 🎨 **Tailwind CSS v4** - Next-generation CSS framework with zero-runtime performance
- 🧭 **React Router 7** - Declarative routing for single-page applications
- 🐻 **Zustand** - Simple and scalable state management
- 🛡️ **Convex** - Real-time database, serverless functions, and rate limiting
- 🔐 **Convex Auth** - Full-stack Auth with Google and GitHub providers
- 💳 **Polar.sh SDK** - Subscription management and premium content gating
- 📧 **Resend** - Styled transactional emails and communications
- 📊 **Analytics & SEO** - High-performance metadata, JSON-LD, Sitemaps, and native integration with PostHog, GA4, and Vercel Analytics.
- 🌓 **Dark Mode** - Built-in theme switching system
- 💎 **Lucide React** - Beautifully simple pixel-perfect icons
- 🎨 **Simple Icons + Developer Icons** - SVG icon system for popular brands
- 🏗️ **Shadcn UI** - Reusable components built with Radix UI
- 🎭 **Framer Motion** - Production-ready motion library for React
- 🖋️ **Blogs** - Blog system with YAML frontmatter support and markdown content. Dynamically generate high-quality, SEO-optimized content using AI.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- [Convex](https://www.convex.dev/) account
- [Polar.sh](https://polar.sh/) account (for payments)
- [Resend](https://resend.com/) API key (for emails)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd saas-boilerplate

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example.local .env.local

# 4. Start the backend & development server
npx convex dev
npm run dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 & TypeScript |
| **Build Tool** | Vite 7 |
| **State** | Zustand |
| **Backend** | Convex (Real-time DB & Functions) |
| **Auth** | Convex Auth (Google & GitHub) |
| **Payments** | Polar.sh (Subscriptions & Credits) |
| **Analytics & SEO** | PostHog, GA4, Vercel & SEO System |
| **Email** | Resend |
| **Styling** | Tailwind CSS v4 |
| **Components** | Shadcn UI & Radix UI |
| **Animations** | Framer Motion |

## 📁 Project Structure

```
├── convex/              # Backend schema, auth, and functions
├── scripts/             # Build utilities (Sitemap, etc.)
├── src/
│   ├── blog/            # Blog components and markdown content
│   ├── components/      # UI components (Shadcn + Custom)
│   ├── contentpages/    # Core pages (Pricing, FAQ, About)
│   ├── hooks/           # Custom hooks (Subscriptions, etc.)
│   ├── lib/             # SEO config and utility functions
│   ├── pages/           # Application dashboard views
│   ├── theme.css        # Tailwind 4 configuration
│   └── main.tsx         # React entry point
```

## 🎨 Customization

### Theme Colors
Edit `src/theme.css` to customize the color palette. This project uses OKLCH colors for better perceptual uniformity.

### Adding UI Components
This project is configured to work with Shadcn UI. You can add components using:
```bash
npx shadcn@latest add <component-name>
```

### 🔍 SEO & Content System
This boilerplate is built to rank. It includes a sophisticated SEO framework designed for single-page applications:

- **Centralized SEO Config**: Manage your site's global presence from `src/lib/seoConfig.ts`.
- **Dynamic Metadata**: Leverages React 19's document metadata support for page-specific titles, descriptions, and keywords.
- **Structured Data (JSON-LD)**: Built-in support for Schema.org snippets (Home, FAQ, Pricing, Blog).
- **Automated Sitemaps**: Run `npm run sitemap` to crawl your routes and generate a production-ready `sitemap.xml`.
- **AI Blog System**: Use `npm run generate-blogs` to dynamically generate or scrape high-quality, SEO-optimized content using AI.
- **Social Optimization**: Perfectly formatted Open Graph (OG) and Twitter Card tags for every page.

### 📄 Pre-built Content Pages
Accelerate your launch with a comprehensive collection of production-ready content pages located in `src/contentpages/`. Make sure to update the content to match your brand:

- **Core Pages**: About Us, Contact, FAQ, Help & Support.
- **Legal & Policies**: Terms of Service, Privacy Policy, Cookie Policy, Refund Policy, Cancellation Policy.
- **Community & Safety**: Community Guidelines, Safety & Security, Report/Block Functionality.
- **Extensible Layout**: All pages utilize a unified `ContentPageLayout` for consistent branding and SEO.

### 🎨 Icon System
The boilerplate includes a universal `Icon` component that aggregates multiple icon packs into a single easy-to-use interface:

- **Simple Icons**: Access thousands of brand icons (Github, Google, etc.).
- **Developer Icons**: High-quality icons for dev tools and languages.
- **Local SVGs**: Directly load custom SVGs from the `public` directory.
- **Theme Reactive**: One-click theme switching (`themeReactive` prop) that automatically toggles icon colors between black and white based on dark/light mode.

**Usage Example:**
```tsx
<Icon name="React" pack="developer-icons" size={64} />
<Icon name="Github" pack="simple-icons" themeReactive />
<Icon name="/custom.svg" pack="local-svg" size={32} />
```

## 📜 Scripts

- `npm run dev`: Start Vite development server
- `npx convex dev`: Start Convex backend in development mode (real-time sync)
- `npm run build`: Build the application for production (includes sitemap generation)
- `npm run sitemap`: Manually generate a fresh `sitemap.xml`
- `npm run preview`: Preview the production build locally
- `npm run jwt`: Generate required authentication keys (JWT)
- `npm run generate-blogs`: Scrape or generate fresh blog content
- `npm run env-dev`: Sync environment variables from `.env.local` to Convex
- `npm run env-prod`: Sync environment variables from `.env.prod` to Convex + Vercel

---
---
Built with ❤️ by [Cameron Paul](https://github.com/cameronspaul) for SaaS Founders.


