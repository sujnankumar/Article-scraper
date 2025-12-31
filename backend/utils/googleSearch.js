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
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            timeout: 10000
        });

        const $ = cheerio.load(data);
        const links = [];

        // Debug: Log how many elements we find with each selector
        console.log(`Debug: .result__a found: ${$('.result__a').length}`);
        console.log(`Debug: .result found: ${$('.result').length}`);
        console.log(`Debug: a[href] found: ${$('a[href*="uddg"]').length}`);

        // Try multiple selectors
        const selectors = ['.result__a', '.result a', 'a.result__url', 'a[href*="uddg"]'];

        for (const selector of selectors) {
            $(selector).each((i, el) => {
                if (links.length >= 2) return false;

                let link = $(el).attr('href');
                if (!link) return;

                // DuckDuckGo often uses redirect links, extract the actual URL from 'uddg' param
                if (link.includes('uddg=')) {
                    try {
                        const fullUrl = link.startsWith('//') ? 'https:' + link : link;
                        const urlObj = new URL(fullUrl);
                        link = urlObj.searchParams.get('uddg');
                    } catch (e) {
                        const match = link.match(/uddg=([^&]+)/);
                        if (match) link = decodeURIComponent(match[1]);
                    }
                }

                if (link && link.startsWith('http')) {
                    const isBlacklisted =
                        link.includes('google.com') ||
                        link.includes('duckduckgo.com') ||
                        link.includes('beyondchats.com') ||
                        link.includes('youtube.com') ||
                        link.includes('facebook.com') ||
                        link.includes('twitter.com') ||
                        link.includes('instagram.com') ||
                        link.includes('linkedin.com') ||
                        link.includes('wikipedia.org');

                    if (!isBlacklisted && !links.includes(link)) {
                        console.log(`Found link: ${link}`);
                        links.push(link);
                    }
                }
            });

            if (links.length >= 2) break;
        }

        console.log(`Found ${links.length} competitor links.`);
        return links;
    } catch (error) {
        console.error('Error during search:', error.message);
        return [];
    }
};

module.exports = searchGoogle;
