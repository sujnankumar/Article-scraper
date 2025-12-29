const axios = require('axios');
const cheerio = require('cheerio');
const slugify = require('slugify');

const SCRAPE_URL = 'https://beyondchats.com/blogs/';

const scrapeArticles = async () => {
    try {
        console.log('Fetching main blog page...');
        const { data } = await axios.get(SCRAPE_URL);
        const $ = cheerio.load(data);

        // Get total pages
        const paginationLinks = $('.page-numbers');
        let totalPages = 1;
        paginationLinks.each((i, el) => {
            const pageNum = parseInt($(el).text());
            if (!isNaN(pageNum) && pageNum > totalPages) {
                totalPages = pageNum;
            }
        });

        console.log(`Total pages found: ${totalPages}`);

        let articles = [];
        let currentPage = totalPages;

        while (articles.length < 5 && currentPage > 0) {
            console.log(`Scraping page ${currentPage}...`);
            const pageUrl = currentPage === 1 ? SCRAPE_URL : `${SCRAPE_URL}page/${currentPage}/`;
            const { data: pageData } = await axios.get(pageUrl);
            const $page = cheerio.load(pageData);

            const pageArticles = [];
            $page('article, .ct-entry-inner').each((i, el) => {
                const title = $page(el).find('h2.ct-entry-title a').text().trim();
                const link = $page(el).find('h2.ct-entry-title a').attr('href');

                if (title && link) {
                    pageArticles.push({ title, link });
                }
            });

            // Since we want the OLDEST, and usually pages are ordered newest -> oldest,
            // we should take articles from the bottom of the last page first.
            // But if we are iterating from totalPages downwards, we can just collect them.
            // Let's reverse to get the very oldest first if we are on the last page.
            articles = [...articles, ...pageArticles.reverse()];
            currentPage--;
        }

        // Limit to 5 oldest
        const oldestArticles = articles.slice(0, 5);
        console.log(`Found ${oldestArticles.length} oldest articles metadata. Fetching content...`);

        const detailedArticles = [];
        for (const art of oldestArticles) {
            console.log(`Fetching content for: ${art.title}`);
            const { data: artData } = await axios.get(art.link);
            const $art = cheerio.load(artData);

            // Selector from research: .elementor-widget-theme-post-content
            const content = $art('.elementor-widget-theme-post-content').text().trim();

            detailedArticles.push({
                title: art.title,
                slug: slugify(art.title, { lower: true, strict: true }),
                content: content || 'No content found',
                sourceUrl: art.link,
                isUpdated: false
            });
        }

        return detailedArticles;
    } catch (error) {
        console.error('Error during scraping:', error.message);
        throw error;
    }
};

module.exports = scrapeArticles;
