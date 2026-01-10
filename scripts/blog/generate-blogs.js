import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import dotenv from 'dotenv';

// Load .env.local specifically since it's common in Vite/Next.js projects
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
// Also load standard .env as fallback
dotenv.config();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.resolve(__dirname, '../../src/blog/content');
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.error('Error: OPENROUTER_API_KEY environment variable is not set.');
    process.exit(1);
}

async function getExistingBlogs() {
    const files = fs.readdirSync(BLOG_DIR);
    const blogs = [];

    for (const file of files) {
        if (file.endsWith('.md')) {
            const filePath = path.join(BLOG_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(content);
            blogs.push({
                title: data.title || 'No Title',
                slug: data.slug || file.replace('.md', ''),
            });
        }
    }

    return blogs;
}

const FEATURE_SUMMARY = `
# Linkur.bio Investor Feature Summary

## Overview in Plain Language
Linkur.bio is a link-in-bio platform that helps creators, brands, and professionals turn a single profile link into a high-converting landing page. It combines easy page building with built-in experiments, performance tracking, and growth tools so users can quickly discover what works and scale it.

This summary lists the product features currently available in the app, written for a non-technical audience.

---

## What the Product Helps Users Do
- Create a beautiful, mobile-first link-in-bio page in minutes.
- Publish a shareable link (linkur.bio/username) that works everywhere.
- Test different page versions to see which converts better.
- Track clicks, views, and visitor behavior over time.
- Grow an audience with built-in email collection.
- Upgrade to unlock advanced growth, branding, and analytics features.

---

## Core Product Experience

### 1) Guided onboarding
New users are walked through a step-by-step setup flow:
- Claim a unique username.
- Choose their purpose (creator, brand, professional, etc.).
- Select platforms and add links.
- Preview a sample A/B test concept.
- Pick a theme and set the page look and feel.
- Customize profile details (name, pronouns, location, bio, avatar).
- Publish the page and go live immediately.

Progress is saved automatically so users can resume without losing work.

### 2) Profile page builder
Users can create a branded link-in-bio page with:
- Profile photo, display name, pronouns, location, and bio.
- Flexible layout for links and social icons.
- Multiple design presets and fonts.
- Color and background customization (paid tiers).
- Animated buttons and gradients (paid tiers).
- Verified badge and last-updated status (Pro).

### 3) Link management
Links can be organized and optimized with:
- Unlimited buttons and social links.
- Drag-and-drop reordering.
- Link display styles (buttons, icons, featured).
- A large icon library for platforms and social networks.
- Link scheduling (timed reveal and expiration) for promotions (Pro).
- Password-protected links for exclusive content (Pro).

### 4) A/B testing built in
Users can run experiments on their link pages:
- Two variants (A and B) of the same page.
- Traffic is split so users can compare performance.
- Results are tracked in the analytics area to spot winners.

### 5) Analytics and insights
The analytics area helps users understand performance and audience behavior:
- Total views, total clicks, and click-through rate.
- Device breakdown and engagement metrics.
- Peak activity times and visitor return rates.
- "Super fan" insights (visitors who click multiple links).
- Weekly summaries and top-performing links.
- Side-by-side comparison of A/B test results.
- Pro-only insights for traffic sources and visitor locations.

### 6) Growth tools
Built-in features that help users convert more visitors:
- Email list signup embedded directly on the profile (Pro).
- Subscriber growth tracking.
- CSV export of email lists (Pro).
- CSV export of analytics reports (Pro).

### 7) Milestones and motivation
Creators stay engaged with:
- Milestones for clicks, visits, links, and subscribers.
- Achievement badges that recognize progress.
- A progress tracker that encourages continued sharing.

### 8) Sharing and distribution
Linkur.bio makes it easy for users to spread their page:
- A shareable QR code for every profile.
- A clean, mobile-first public profile page.
- A viewer-friendly theme switcher for improved readability.

### 9) Account and privacy controls
Users can manage their presence safely:
- Change their public URL name.
- Toggle profile visibility.
- Request account deletion.
- Feedback form for product suggestions and bug reports.

---

## Pricing and Plans (as shown on the pricing page)

### Free Plan (0 dollars)
Core features included:
- Unlimited links.
- Views and clicks tracking.
- A/B testing.
- Suggestions and optimization tips.
- Basic themes and styling.
- 7-day data history.
- QR code sharing.
- Easy drag-and-drop link ordering.
- Milestones and achievements.

### Plus Plan (8 dollars per month)
Everything in Free, plus:
- 90-day analytics history.
- Button animations (shake, leap, etc.).
- Custom colors for backgrounds and buttons.
- Custom background images.
- Full theme library access.
- Two bio-link pages.

### Pro Plan (20 dollars per month)
Everything in Plus, plus:
- Lifetime analytics history.
- Remove "Made with linkur.bio" branding.
- Audience location insights.
- Traffic source tracking.
- Email list signup on the profile.
- Link scheduling and expiration.
- Password-protected links.
- Verified badge.
- "Last updated" status on the profile.
- Export email lists as CSV.
- Export analytics as CSV.

### Lifetime Plan (one-time payment)
A limited lifetime offer that includes the full Pro feature set:
- One-time payment for lifetime Pro access.
- Access to future Pro features and updates.

### Billing and customer experience
- Simple monthly pricing.
- Cancel anytime through the billing portal.
- 7-day trial for Pro (payment method required).
- Prorated upgrades from Plus to Pro.

---

## Supporting Pages and Trust Signals
The public website includes a full set of trust and support pages:
- About, Contact, and Help/Support.
- FAQ and pricing details.
- Terms of service, privacy policy, and cookie policy.
- Refund and cancellation policies.
- Community guidelines, safety, and reporting features.

---

## Why This Matters for Investors
Linkur.bio is not just a link page. It is a conversion-focused growth platform with:
- A clear free-to-paid upgrade path.
- Built-in experimentation and analytics that drive retention.
- Premium features that increase revenue per user.
- A product experience designed to minimize churn (easy setup, measurable results, visible progress).

---

## Short Summary of the Value Proposition
Linkur.bio helps creators and brands turn a single link into a measurable growth channel. It combines page building, testing, analytics, and conversion tools in one place, making it easier to prove results and upgrade when they are ready.
`;

async function generateBlog(targetSlug = null) {
    console.log('Reading existing blogs...');
    const existingBlogs = await getExistingBlogs();
    const existingListMd = existingBlogs.map(b => `title: "${b.title}"\nslug: "${b.slug}"`).join('\n\n');

    const slugInstruction = targetSlug
        ? `\n\n**IMPORTANT:** You MUST generate a blog post specifically about the topic represented by this slug: "${targetSlug}". The content should focus on this exact topic, using it as the primary keyword and main subject matter. The generated slug must be: "${targetSlug}".`
        : '';

    const prompt = `
**Role:** You are a Senior SEO Content Strategist and Lead Writer for **linkur.bio**. Your goal is to convert technical project data into high-converting, search-optimized blog posts. You don't just write about the product; you write about the **problems our customers face** (e.g., low social media click-through rates, messy branding, fragmented link sharing) and position our product as the natural solution.

We have already published posts with the titles and slugs below so please ensure your suggestions are completely different from these to avoid duplicate content.
\`\`\`markdown
${existingListMd}
\`\`\`
${slugInstruction}

**Task:** Using the provided project data, you will research, strategize, and write a comprehensive, 1,500-word blog post.

### **Phase 1: Research & Strategy**

1. **Analyze Data:** Review the provided project data:

\`\`\`markdown
${FEATURE_SUMMARY}
\`\`\`

2. **Identify the Pain Point:** Determine the "problem" the reader is trying to solve before they find this article eg "linktr.ee alternatives" or "a/b testing website".
3. **Select Content Type:** Choose the most effective format: [Listicle, Product reviews, Informational, History of, Pros and Cons, Comparisons, How-tos, Versus, Best for articles, Brand roundup].
4. **Keyword Selection:** Identify 1 primary keyword and 2-3 secondary semantic keywords (1-4 words each).

### **Phase 2: Execution Guidelines**

* **The 70/30 Rule:** 70% of the article must be educational/informational value (solving the user's problem). 30% should be how **linkur.bio** specifically solves that problem.
* **Tone:** Use a "Helpful Peer" tone—expert but accessible. Avoid corporate jargon like "leveraging solutions."
* **Depth & Length:** To reach 1,500 words, provide exhaustive detail. For every "How-to" step or tip, explain **why** it matters, **how** to implement it, and a **pro-tip** for advanced users.
* **Structure:** Use a strict hierarchy (One H1, then H2s, then H3s). Never skip header levels.
* **Readability:** Adhere to the **3-Line Rule** (max 4 lines per paragraph).
* **Scannability:** Use **strategic bolding** for key concepts and bulleted lists for any sequence of 2+ items.
* **SEO Integration:** Include the primary keyword in the first 100 words.

### **CRITICAL CONTENT QUALITY RULES (MUST FOLLOW)**

#### **Statistics & Data Integrity**
* **NEVER fabricate statistics or cite fake studies.** Do NOT use specific percentages or numbers unless they are:
  - General directional statements (e.g., "significantly higher," "many creators see improved results")
* ✅ ACCEPTABLE: "optimized pages often see higher engagement" or "creators report better click-through rates"
* ❌ PROHIBITED: "Studies show 38% higher bounce rates" or "Linkur.bio internal data shows 22% increase"

#### **Internal Linking Requirements**
* **Include 2-3 contextual internal links** to other blog posts from the existing list above.
* Format: \`[descriptive anchor text](/blog/slug-name)\`
* Example: "For more on scheduling content, check out our [guide to scheduling links](/blog/schedule-protect-link-in-bio)."
* Place links naturally within the content where they add value, not in a separate section.

#### **Promotional Tone Guidelines**
* Keep product mentions **educational and subtle**, not sales-heavy.
* ✅ GOOD: "Tools like linkur.bio offer built-in A/B testing to simplify this process."
* ❌ BAD: "Linkur.bio makes optimization effortless! Users love the measurable progress and see quick lifts!"
* When describing linkur.bio features, focus on **how they solve the problem**, not promotional language.
* Avoid phrases like "Users love..." or "Many see quick results." Instead use "This helps by..." or "The feature allows..."

#### **FAQ Section Requirements**
* **Create 6-8 FAQ questions** (not just 3-4).
* Target **question-based search queries** that users actually type into Google.
* ✅ Examples: "How do I add a link in bio to Instagram?" "What's the best free link in bio tool?" "Can I schedule links in my bio?"
* Mix beginner and advanced questions.
* Keep answers concise (2-4 sentences each).

#### **Engagement & Shareability**
* At the end of the article (before or after the conclusion), add a **social engagement prompt**:
  - Example: "What's your biggest challenge with link-in-bio pages? Share in the comments below!"
  - OR: "Found this helpful? Share it with a creator who needs better analytics."
* This should feel natural and conversational, not forced.

### **Phase 3: Output Format**

Return the content strictly as a \`.md\` file with the following structure:

\`\`\`markdown
title: "[Optimized Title with Primary Keyword]"
slug: "[short-keyword-rich-url-slug]"
date: "${new Date().toISOString().split('T')[0]}"
description: "[Compelling 150-character meta description]"
author: "Linkur.bio Team"
---

[Introduction: Hook the reader by acknowledging their specific pain point. Define the 'Why'.]

## [H2 Industry/Topic Context - The 'What']
[Discuss the broader topic or trend. Provide value here that applies even if the reader doesn't use the tool yet. Use bolding for key terms. Include 1-2 internal links to related blog posts here.]

## [H2 Step-by-Step Guide or Deep Dive - The 'How']
### [H3 Detailed Sub-topic]
[Content including "Why it matters" and "Pro-tips". Add 1 internal link if relevant.]

## [H2 How linkur.bio Addresses This Challenge]
[Describe features objectively, focusing on utility not hype. Use educational tone.]
* [Feature/Benefit 1 - explain how it helps]
* [Feature/Benefit 2 - explain how it helps]

## Frequently Asked Questions

**[Question 1 - beginner level]?**
[Concise answer 2-3 sentences.]

**[Question 2 - practical implementation]?**
[Concise answer 2-3 sentences.]

**[Question 3 - comparison/choice]?**
[Concise answer 2-3 sentences.]

**[Question 4 - technical detail]?**
[Concise answer 2-3 sentences.]

**[Question 5 - best practices]?**
[Concise answer 2-3 sentences.]

**[Question 6 - advanced strategy]?**
[Concise answer 2-3 sentences.]

[Add 1-2 more FAQs if relevant to topic, totaling 6-8 questions]

## Conclusion
[Summary of value and natural CTA.]

[Social engagement prompt - conversational question or share request]
\`\`\`
`.trim();

    console.log('Calling OpenRouter API...');

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'xiaomi/mimo-v2-flash:free',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                reasoning: {
                    enabled: true
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Request failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content;

        // Remove markdown code blocks if the AI wrapped the whole thing
        content = content.replace(/^```markdown\n/, '').replace(/\n```$/, '');
        content = content.replace(/^```\n/, '').replace(/\n```$/, '');

        // Ensure we don't have double opening dashes if the AI included them
        content = content.trim();
        if (content.startsWith('---')) {
            // Content already has opening dashes, just use as is or trim if needed
        } else {
            content = `---\n${content}`;
        }

        // Extract slug from frontmatter to name the file
        const slugMatch = content.match(/slug:\s*["']?([^"'\n]+)["']?/);
        const slug = slugMatch ? slugMatch[1] : `blog-${Date.now()}`;
        const fileName = `${slug}.md`;
        const filePath = path.join(BLOG_DIR, fileName);

        fs.writeFileSync(filePath, content);
        console.log(`Successfully generated and saved blog: ${filePath}`);

    } catch (error) {
        console.error('Error generating blog:', error);
    }
}

async function main() {
    const args = process.argv.slice(2);

    // Check if the first argument is a number (count) or a string (slug)
    const firstArg = args[0];
    const countArg = parseInt(firstArg, 10);

    // If it's a valid number, generate that many random blogs
    // If it's a string (NaN when parsed), treat it as a slug
    if (!isNaN(countArg) && firstArg === countArg.toString()) {
        const count = countArg;
        console.log(`Starting generation of ${count} blog(s)...`);

        for (let i = 1; i <= count; i++) {
            console.log(`\n--- Generating Blog ${i} of ${count} ---`);
            await generateBlog();
            // Brief pause to avoid rate limiting if necessary, though mimo-v2-flash:free is quite lenient
            if (i < count) {
                console.log('Waiting 2 seconds before next generation...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    } else if (firstArg) {
        // Treat it as a slug
        const targetSlug = firstArg;
        console.log(`Generating blog for slug: "${targetSlug}"...`);
        await generateBlog(targetSlug);
    } else {
        // No arguments, generate one random blog
        console.log('Generating 1 blog...');
        await generateBlog();
    }
    console.log('\nAll generations complete!');
}

main();
