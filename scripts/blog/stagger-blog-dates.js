import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../../src/blog/content');

function staggerDates() {
    if (!fs.existsSync(BLOG_DIR)) {
        console.error('Blog directory not found');
        return;
    }

    const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));

    // Sort files to have a consistent order
    files.sort();

    const totalFiles = files.length;
    const startDate = new Date('2025-11-10');
    const endDate = new Date('2026-01-05');
    const timeSpan = endDate.getTime() - startDate.getTime();
    const interval = timeSpan / (totalFiles - 1);

    files.forEach((file, index) => {
        const filePath = path.join(BLOG_DIR, file);
        let content = fs.readFileSync(filePath, 'utf-8');

        const targetDate = new Date(startDate.getTime() + (interval * index));
        const dateString = targetDate.toISOString().split('T')[0];

        // Replace the date in frontmatter
        // Match line like: date: "2026-01-04" or date: 2026-01-04
        content = content.replace(/date:\s*["']?\d{4}-\d{2}-\d{2}["']?/, `date: "${dateString}"`);

        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file} with date ${dateString}`);
    });

    console.log('Finished staggering blog dates.');
}

staggerDates();
