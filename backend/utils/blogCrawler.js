const axios = require('axios');
const cheerio = require('cheerio');
const scrapeContent = require('./scraper');
const Article = require('../models/Article');

/**
 * Crawls the BeyondChats blog to find NEW articles (not already in DB).
 * @returns {Promise<Array>} - Array of NEW article objects { title, sourceUrl, originalContent, slug }
 */
const crawlBlog = async () => {
    try {
        const BLOG_URL = 'https://beyondchats.com/blogs/';
        const MAX_NEW_ARTICLES = 5; // How many NEW articles we want

        console.log(`\n📰 Crawling ${BLOG_URL}...`);

        const { data } = await axios.get(BLOG_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const $ = cheerio.load(data);
        const articleLinks = [];

        // Find article links
        $('article a').each((i, el) => {
            const href = $(el).attr('href');
            const title = $(el).text().trim();

            if (href && href.includes('/blogs/') && href !== BLOG_URL && title.length > 10) {
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

        console.log(`   Found ${articleLinks.length} articles on blog page`);

        // Process articles, skipping those that already exist
        const newArticles = [];
        let skipped = 0;

        for (const link of articleLinks) {
            // Stop if we have enough new articles
            if (newArticles.length >= MAX_NEW_ARTICLES) {
                console.log(`   ✓ Got ${MAX_NEW_ARTICLES} new articles, stopping`);
                break;
            }

            // Check if already exists in database
            const exists = await Article.findOne({ sourceUrl: link.url });
            if (exists) {
                skipped++;
                console.log(`   ⏭️  Skip (exists): "${link.title.substring(0, 40)}..."`);
                continue;
            }

            // Scrape new article
            console.log(`   📄 Scraping: "${link.title.substring(0, 40)}..."`);
            const content = await scrapeContent(link.url);

            if (content) {
                newArticles.push({
                    title: link.title,
                    sourceUrl: link.url,
                    originalContent: content,
                    slug: link.url.split('/').filter(Boolean).pop()
                });
                console.log(`   ✓ Got content (${content.length} chars)`);
            }
        }

        console.log(`\n   Summary: ${newArticles.length} new, ${skipped} already existed\n`);
        return newArticles;

    } catch (error) {
        console.error('❌ Error crawling blog:', error.message);
        return [];
    }
};

module.exports = crawlBlog;
