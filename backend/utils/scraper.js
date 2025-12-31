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

        // Define elements to remove (Noise)
        const noiseSelectors = [
            'script', 'style', 'nav', 'footer', 'header', 'noscript',
            'aside', '.sidebar', '#sidebar', '.ads', '.ad-container',
            '.social-share', '.related-posts', '.comments', '.newsletter-signup',
            '.menu', '.pagination', '.widget', 'iframe', 'button', 'form'
        ];

        // Process noise removal
        noiseSelectors.forEach(selector => $(selector).remove());

        // Common article content selectors ordered by specificity
        const selectors = [
            'article',
            '[role="main"]',
            '.post-content',
            '.entry-content',
            '.article-body',
            '.content-area',
            '.main-content',
            'main',
            '.elementor-widget-theme-post-content' // Added specifically for BeyondChats-like structures
        ];

        let content = '';
        let bestElement = null;

        for (const selector of selectors) {
            const el = $(selector);
            if (el.length > 0) {
                // Heuristic: take the one with most paragraphs or longest text
                el.each((i, subEl) => {
                    const text = $(subEl).text().trim();
                    if (text.length > content.length) {
                        content = text;
                        bestElement = $(subEl);
                    }
                });
            }
        }

        // If specific containers didn't yield much, try to find the container with most paragraphs
        if (content.length < 500) {
            let maxPText = '';
            $('div, section').each((i, el) => {
                const pText = $(el).find('p').text().trim();
                if (pText.length > maxPText.length) {
                    maxPText = pText;
                }
            });
            if (maxPText.length > content.length) {
                content = maxPText;
            }
        }

        // Fallback to body text if still very short
        if (content.length < 200) {
            content = $('body').text().trim();
        }

        // Clean up the text: remove excessive whitespace and preserve some structure
        const cleanedContent = content
            .replace(/\s\s+/g, ' ')  // Collapse multiple spaces
            .replace(/\n\s*\n/g, '\n\n') // Normalize multiple newlines
            .trim();

        // Limit content length to avoid overloading LLM contexts
        return cleanedContent.substring(0, 8000);
    } catch (error) {
        console.error(`Error scraping ${url}: ${error.message}`);
        return '';
    }
};

module.exports = scrapeContent;
