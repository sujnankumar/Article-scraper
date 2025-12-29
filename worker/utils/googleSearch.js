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

        // Google search results typically have titles in h3 tags inside 'a' tags
        $('div.g').each((i, el) => {
            const link = $(el).find('a').attr('href');
            if (link && link.startsWith('http')) {
                // Heuristic to filter for blog/article-like URLs
                const isArticle = !link.includes('google.com') &&
                    !link.includes('youtube.com') &&
                    !link.includes('facebook.com') &&
                    !link.includes('twitter.com') &&
                    !link.includes('linkedin.com');

                if (isArticle) {
                    links.push(link);
                }
            }
            if (links.length >= 2) return false; // Break loop
        });

        // Fallback for different HTML structures
        if (links.length < 2) {
            $('a h3').each((i, el) => {
                const link = $(el).parent().attr('href');
                if (link && link.startsWith('http') && !link.includes('google.com')) {
                    if (!links.includes(link)) {
                        links.push(link);
                    }
                }
                if (links.length >= 2) return false;
            });
        }

        console.log(`Found ${links.length} suitable links.`);
        return links.slice(0, 2);
    } catch (error) {
        console.error('Error during Google search:', error.message);
        return [];
    }
};

module.exports = searchGoogle;
