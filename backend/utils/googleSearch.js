const axios = require('axios');

/**
 * Google Custom Search API Configuration
 * Free tier: 100 queries/day
 */
const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY || 'AIzaSyCOvbh6QxtodL4I1IMLoYEP6KHmU9kg91k';
const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID || '51d1386ef329a490b';

/**
 * Searches Google using the Custom Search API
 * @param {string} query - The search query (article title)
 * @returns {Promise<string[]>} - Array of top competitor URLs
 */
const searchGoogle = async (query) => {
    try {
        console.log(`🔍 Searching Google API for: "${query}"`);

        const apiUrl = 'https://www.googleapis.com/customsearch/v1';

        const response = await axios.get(apiUrl, {
            params: {
                key: GOOGLE_API_KEY,
                cx: SEARCH_ENGINE_ID,
                q: `${query} blog article`,
                num: 5  // Get 5 results
            },
            timeout: 10000
        });

        const results = response.data.items || [];
        console.log(`   API returned ${results.length} results`);

        // Filter and extract URLs
        const links = [];
        const blacklist = [
            'youtube.com',
            'facebook.com',
            'twitter.com',
            'instagram.com',
            'linkedin.com',
            'wikipedia.org',
            'amazon.com',
            'pinterest.com',
            'beyondchats.com' // Skip our own site
        ];

        for (const item of results) {
            if (links.length >= 2) break;

            const url = item.link;
            const isBlacklisted = blacklist.some(blocked => url.includes(blocked));

            if (!isBlacklisted) {
                console.log(`   ✓ Found: ${url.substring(0, 60)}...`);
                links.push(url);
            }
        }

        console.log(`   Returning ${links.length} competitor URLs`);
        return links;

    } catch (error) {
        if (error.response) {
            console.error(`❌ Google API Error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown'}`);

            // Check for quota exceeded
            if (error.response.status === 429 || error.response.data?.error?.code === 429) {
                console.error('   ⚠️ Daily quota exceeded (100 queries/day on free tier)');
            }
        } else {
            console.error('❌ Search error:', error.message);
        }
        return [];
    }
};

module.exports = searchGoogle;
