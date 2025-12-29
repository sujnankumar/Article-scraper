const axios = require('axios');
const cheerio = require('cheerio');
const searchGoogle = require('./utils/googleSearch');
const scrapeContent = require('./utils/scraper');
const enrichArticle = require('./utils/llm');

const BACKEND_URL = process.env.BACKEND_URL;

const fetchPendingArticles = async () => {
    try {
        console.log('Fetching non-updated articles from backend...');
        const { data } = await axios.get(`${BACKEND_URL}/articles`, {
            params: { isUpdated: false }
        });
        return data.data;
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        return [];
    }
};

const main = async () => {
    console.log('Worker is starting...');

    const articles = await fetchPendingArticles();
    console.log(`Found ${articles.length} articles to process.`);

    for (const article of articles) {
        console.log(`\nProcessing: ${article.title}`);

        // 1. Search Google
        const searchResults = await searchGoogle(article.title);

        // 2. Scrape each result
        const references = [];
        for (const url of searchResults) {
            const content = await scrapeContent(url);
            if (content) {
                references.push({ url, content });
            }
        }

        console.log(`Found ${references.length} reference articles.`);

        // 3. LLM Logic
        if (references.length > 0) {
            const enrichedContent = await enrichArticle({
                title: article.title,
                content: article.originalContent
            }, references);

            // 4. Publish back to backend
            console.log(`Publishing updated article: ${article.title}`);
            try {
                await axios.put(`${BACKEND_URL}/articles/${article._id}`, {
                    updatedContent: enrichedContent,
                    isUpdated: true
                });
                console.log(`Successfully updated: ${article.title}`);
            } catch (publishError) {
                console.error(`Failed to publish ${article.title}:`, publishError.message);
            }
        } else {
            console.log(`Skipping LLM for ${article.title} due to missing references.`);
        }
    }
};

main();
