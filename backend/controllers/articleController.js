const Article = require('../models/Article');
const scrapeArticles = require('../utils/scraper');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const articles = await Article.find(queryObj).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: articles.length, data: articles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
exports.getArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, error: 'Article not found' });
        }
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Public (for now)
exports.createArticle = async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json({ success: true, data: article });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Public (for now)
exports.updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!article) {
            return res.status(404).json({ success: false, error: 'Article not found' });
        }
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Public (for now)
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, error: 'Article not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Scrape and store articles
// @route   POST /api/articles/scrape
// @access  Public
exports.scrapeAndStore = async (req, res) => {
    try {
        const articles = await scrapeArticles();

        const storedArticles = [];
        for (const art of articles) {
            // Avoid duplicates based on sourceUrl
            let exists = await Article.findOne({ sourceUrl: art.sourceUrl });
            if (!exists) {
                // Transform the scraped 'content' into 'originalContent' and 'updatedContent'
                const newArtData = {
                    title: art.title,
                    sourceUrl: art.sourceUrl,
                    originalContent: art.originalContent,
                    updatedContent: art.originalContent, // Initially, updatedContent is the same as original
                    slug: art.slug
                };
                const newArt = await Article.create(newArtData);
                storedArticles.push(newArt);
            } else {
                storedArticles.push(exists);
            }
        }

        res.status(201).json({
            success: true,
            count: storedArticles.length,
            data: storedArticles
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
