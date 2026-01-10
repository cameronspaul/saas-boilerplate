
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

const validSlugs = files.map(f => f.replace('.md', ''));
const otherValidPaths = ['/', '/pricing', '/dashboard', '/onboarding', '/blog'];

const results = [];

files.forEach(file => {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
        const text = match[1];
        const url = match[2];

        if (url.startsWith('/') || !url.includes('://')) {
            // Internal link
            let isValid = false;
            let reason = '';

            const pathOnly = url.split('#')[0].split('?')[0];

            if (pathOnly.startsWith('/blog/')) {
                const slug = pathOnly.replace('/blog/', '');
                if (validSlugs.includes(slug)) {
                    isValid = true;
                } else {
                    reason = `Blog slug "${slug}" not found`;
                }
            } else if (otherValidPaths.includes(pathOnly)) {
                isValid = true;
            } else {
                reason = `Path "${pathOnly}" not in known list`;
            }

            if (!isValid) {
                results.push({
                    file,
                    linkText: text,
                    linkUrl: url,
                    reason
                });
            }
        }
    }
});

if (results.length === 0) {
    console.log('All internal links are valid!');
} else {
    console.log(`Found ${results.length} broken or unknown internal links.`);
    fs.writeFileSync('link-check-results.json', JSON.stringify(results, null, 2));
    console.log('Results written to link-check-results.json');
}
