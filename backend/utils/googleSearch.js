const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Searches DuckDuckGo HTML for a query and returns article links.
 * @param {string} query - The search query (article title)
 * @returns {Promise<string[]>} - Array of top competitor URLs
 */
const searchGoogle = async (query) => {
    try {
        console.log(`Searching for competitors: "${query}"`);

        // Using DuckDuckGo HTML which is much more scraper-friendly than Google
        const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + " blog article")}`;

        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const links = [];

        $('.result__a').each((i, el) => {
            let link = $(el).attr('href');

            // DuckDuckGo often uses redirect links, extract the actual URL from 'uddg' param
            if (link && link.includes('uddg=')) {
                try {
                    const urlObj = new URL('https:' + link);
                    link = urlObj.searchParams.get('uddg');
                } catch (e) {
                    // Fallback to regex if URL parsing fails
                    const match = link.match(/uddg=([^&]+)/);
                    if (match) link = decodeURIComponent(match[1]);
                }
            }

            if (link && link.startsWith('http')) {
                // Heuristic to filter for blog/article-like URLs
                const isInternal = link.includes('google.com') ||
                    link.includes('duckduckgo.com') ||
                    link.includes('beyondchats.com') || // Skip our own site
                    link.includes('youtube.com') ||
                    link.includes('facebook.com') ||
                    link.includes('twitter.com') ||
                    link.includes('instagram.com') ||
                    link.includes('linkedin.com');

                if (!isInternal && !links.includes(link)) {
                    links.push(link);
                }
            }
            if (links.length >= 2) return false; // Break loop
        });

        console.log(`Found ${links.length} competitor links.`);
        return links;
    } catch (error) {
        console.error('Error during search:', error.message);
        return [];
    }
};

module.exports = searchGoogle;
