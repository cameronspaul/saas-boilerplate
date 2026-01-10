import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://yoursaas.com'; // Matches SEO_CONFIG.siteUrl
const BLOG_DIR = path.join(__dirname, '../src/blog/content');
const PUBLIC_DIR = path.join(__dirname, '../public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// Static routes (non-auth pages only)
const STATIC_ROUTES = [
    '/',
    '/pricing',
    '/blog',
    '/about-us',
    '/contact',
    '/faq',
    '/help-support',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
    '/community-guidelines',
    '/refund-policy',
    '/cancellation-policy',
    '/safety-and-security',
    '/report-block-functionality',
];


function parseFrontmatter(content) {
    const match = content.match(/^---[\s\S]*?---/);
    if (!match) return {};

    const frontmatter = match[0].replace(/^---|---$/g, '');
    const data = {};

    frontmatter.split('\n').forEach(line => {
        const [key, ...values] = line.split(':');
        if (key && values.length) {
            let value = values.join(':').trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            data[key.trim()] = value;
        }
    });

    return data;
}

async function generateSitemap() {
    console.log('Generating sitemap...');

    // Ensure public directory exists
    if (!fs.existsSync(PUBLIC_DIR)) {
        fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const urls = [...STATIC_ROUTES.map(route => ({
        loc: `${BASE_URL}${route}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: route === '/' ? 1.0 : 0.8
    }))];

    // Process blog posts
    if (fs.existsSync(BLOG_DIR)) {
        const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));

        for (const file of files) {
            const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
            const data = parseFrontmatter(content);
            const slug = data.slug || file.replace('.md', '');
            const date = data.date || new Date().toISOString();

            urls.push({
                loc: `${BASE_URL}/blog/${slug}`,
                lastmod: new Date(date).toISOString(),
                changefreq: 'monthly',
                priority: 0.6
            });
        }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, sitemap);
    console.log(`Sitemap generated at ${SITEMAP_PATH}`);
}

generateSitemap().catch(console.error);
