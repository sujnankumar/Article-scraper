const Article = require('../models/Article');
const searchGoogle = require('../utils/googleSearch');
const scrapeContent = require('../utils/scraper');
const enrichArticle = require('../utils/llm');

const runPipeline = async () => {
    console.log('Background pipeline started...');
    try {
        const articles = await Article.find({ isUpdated: false });
        console.log(`Found ${articles.length} pending articles.`);

        for (const article of articles) {
            console.log(`Processing: ${article.title}`);

            // 1. Search
            const searchResults = await searchGoogle(article.title);

            // 2. Scrape
            const references = [];
            for (const url of searchResults) {
                const content = await scrapeContent(url);
                if (content) {
                    references.push({ url, content });
                }
            }

            // 3. Enrich
            if (references.length > 0) {
                const enrichedContent = await enrichArticle({
                    title: article.title,
                    content: article.originalContent
                }, references);

                // 4. Update
                article.updatedContent = enrichedContent;
                article.isUpdated = true;
                await article.save();
                console.log(`Successfully updated: ${article.title}`);
            } else {
                console.log(`Skipping ${article.title}: No references found.`);
            }
        }
    } catch (error) {
        console.error('Pipeline error:', error);
    }
    console.log('Background pipeline finished.');
};

exports.triggerProcess = async (req, res) => {
    // Start processing in background (fire and forget)
    // We don't await runPipeline() here so the response is immediate
    runPipeline();

    res.json({
        success: true,
        message: 'AI Processing started in background. Check server logs for progress.'
    });
};
