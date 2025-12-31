const axios = require('axios');
const cheerio = require('cheerio');
const scrapeContent = require('./scraper');

/**
 * Crawls the BeyondChats blog to find recent articles.
 * @returns {Promise<Array>} - Array of article objects { title, sourceUrl, originalContent, slug }
 */
const crawlBlog = async () => {
    try {
        const BLOG_URL = 'https://beyondchats.com/blogs/';
        console.log(`Crawling ${BLOG_URL}...`);

        const { data } = await axios.get(BLOG_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const $ = cheerio.load(data);
        const articles = [];

        // Find article links - adjusting selectors for BeyondChats structure
        // Usually WP sites occupy .post-title a or similar. 
        // We'll look for generic article links.
        const articleLinks = [];

        $('article a').each((i, el) => {
            const href = $(el).attr('href');
            const title = $(el).text().trim();

            // Basic filtering for valid article links
            if (href && href.includes('/blog/') && href !== BLOG_URL && title.length > 10) {
                if (!articleLinks.some(a => a.url === href)) {
                    articleLinks.push({ url: href, title });
                }
            }
        });

        // Also try standard h2 a pattern if above fails
        if (articleLinks.length === 0) {
            $('h2 a, h3 a').each((i, el) => {
                const href = $(el).attr('href');
                const title = $(el).text().trim();
                if (href && title) {
                    if (!articleLinks.some(a => a.url === href)) {
                        articleLinks.push({ url: href, title });
                    }
                }
            });
        }

        console.log(`Found ${articleLinks.length} potential articles.`);

        // Process top 5
        const toProcess = articleLinks.slice(0, 5);

        for (const link of toProcess) {
            console.log(`Scraping blog post: ${link.title}`);
            const content = await scrapeContent(link.url);

            if (content) {
                articles.push({
                    title: link.title,
                    sourceUrl: link.url,
                    originalContent: content,
                    slug: link.url.split('/').filter(Boolean).pop()
                });
            }
        }

        return articles;

    } catch (error) {
        console.error('Error crawling blog:', error.message);
        return [];
    }
};

module.exports = crawlBlog;
