const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Searches Google for a query and returns the first two blog/article links.
 * @param {string} query - The search query (article title)
 * @returns {Promise<string[]>} - Array of top two article URLs
 */
const searchGoogle = async (query) => {
    try {
        console.log(`Searching Google for: "${query}"`);

        // Using a basic search URL. Note: Google often blocks scrapers, 
        // in a production environment, a Search API would be preferred.
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + " blog article")}`;

        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const links = [];

        // Google search results are typically in 'a' tags inside 'div.g' (for desktop)
        // or just 'a' tags with specific patterns.
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.startsWith('http') && !href.includes('google.com')) {
                // Filter out some common non-article sites if needed, or just take the first two
                links.push(href);
            }
        });

        // Filter and get top 2
        const articleLinks = links.slice(0, 2);
        console.log(`Found ${articleLinks.length} suitable links.`);

        return articleLinks;
    } catch (error) {
        console.error('Error during Google search:', error.message);
        return [];
    }
};

module.exports = searchGoogle;
