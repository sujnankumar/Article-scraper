const Article = require('../models/Article');
const searchGoogle = require('../utils/googleSearch');
const scrapeContent = require('../utils/scraper');
const enrichArticle = require('../utils/llm');

const runPipeline = async () => {
    console.log('\n========================================');
    console.log('🚀 AI Enhancement Pipeline Started');
    console.log('========================================\n');

    const results = {
        processed: 0,
        enhanced: 0,
        skipped: 0,
        errors: 0,
        details: []
    };

    try {
        const articles = await Article.find({ isUpdated: false });
        console.log(`📋 Found ${articles.length} pending articles.\n`);

        if (articles.length === 0) {
            console.log('✅ No pending articles to process.');
            return results;
        }

        for (const article of articles) {
            results.processed++;
            console.log(`\n--- Processing [${results.processed}/${articles.length}]: "${article.title}" ---`);

            try {
                // 1. Search for competitor content
                console.log('🔍 Searching for competitor articles...');
                const searchResults = await searchGoogle(article.title);
                console.log(`   Found ${searchResults.length} competitor URLs`);

                // 2. Scrape reference content
                const references = [];
                for (const url of searchResults) {
                    console.log(`   📄 Scraping: ${url.substring(0, 60)}...`);
                    const content = await scrapeContent(url);
                    if (content) {
                        references.push({ url, content: content.substring(0, 5000) }); // Limit content size
                        console.log(`   ✓ Got ${content.length} chars`);
                    }
                }

                // 3. Enrich with AI
                if (references.length > 0) {
                    console.log('🤖 Enhancing with Gemini AI...');
                    const enrichedContent = await enrichArticle({
                        title: article.title,
                        content: article.originalContent
                    }, references);

                    // Validate that content was actually enhanced
                    if (enrichedContent && enrichedContent !== article.originalContent && enrichedContent.length > 100) {
                        // 4. Save to database
                        article.updatedContent = enrichedContent;
                        article.isUpdated = true;
                        await article.save();

                        results.enhanced++;
                        results.details.push({ title: article.title, status: 'enhanced' });
                        console.log(`✅ Successfully enhanced: "${article.title}"`);
                        console.log(`   Original: ${article.originalContent.length} chars → Enhanced: ${enrichedContent.length} chars`);
                    } else {
                        results.errors++;
                        results.details.push({ title: article.title, status: 'error', reason: 'AI returned same/invalid content' });
                        console.log(`❌ Enhancement failed: Content unchanged or invalid for "${article.title}"`);
                    }
                } else {
                    results.skipped++;
                    results.details.push({ title: article.title, status: 'skipped', reason: 'No references found' });
                    console.log(`⏭️  Skipped (no references): "${article.title}"`);
                }
            } catch (articleError) {
                results.errors++;
                results.details.push({ title: article.title, status: 'error', reason: articleError.message });
                console.error(`❌ Error processing "${article.title}":`, articleError.message);
            }
        }
    } catch (error) {
        console.error('💥 Pipeline error:', error);
        throw error;
    }

    console.log('\n========================================');
    console.log('🏁 AI Enhancement Pipeline Completed');
    console.log(`   Enhanced: ${results.enhanced}`);
    console.log(`   Skipped:  ${results.skipped}`);
    console.log(`   Errors:   ${results.errors}`);
    console.log('========================================\n');

    return results;
};

exports.triggerProcess = async (req, res) => {
    try {
        // AWAIT the pipeline to complete before responding
        const results = await runPipeline();

        res.json({
            success: true,
            message: `Enhancement complete! ${results.enhanced} articles enhanced, ${results.skipped} skipped.`,
            data: results
        });
    } catch (error) {
        console.error('Trigger process error:', error);
        res.status(500).json({
            success: false,
            message: 'Enhancement failed. Check server logs for details.',
            error: error.message
        });
    }
};
