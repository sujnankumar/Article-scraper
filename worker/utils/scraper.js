const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes the main content from a given URL.
 * @param {string} url - The URL to scrape
 * @returns {Promise<string>} - The extracted main content
 */
const scrapeContent = async (url) => {
    try {
        console.log(`Scraping content from: ${url}`);
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(data);

        // Remove scripts, styles, and other noise
        $('script, style, nav, footer, header, noscript').remove();

        // Common article content selectors
        const selectors = [
            'article',
            '.post-content',
            '.entry-content',
            '.article-content',
            '.main-content',
            'main'
        ];

        let content = '';
        for (const selector of selectors) {
            const el = $(selector);
            if (el.length > 0) {
                // Heuristic: take the one with most text
                const text = el.text().trim();
                if (text.length > content.length) {
                    content = text;
                }
            }
        }

        // Fallback to body text if no specific selector works well
        if (content.length < 500) {
            content = $('body').text().trim().replace(/\s+/g, ' ');
        }

        // Limit content length to avoid overloading LLM
        return content.substring(0, 5000);
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return '';
    }
};

module.exports = scrapeContent;
