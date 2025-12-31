const express = require('express');
const router = express.Router();
const {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    scrapeAndStore,
    getArticleStats
} = require('../controllers/articleController');

router.route('/')
    .get(getArticles)
    .post(createArticle);

router.get('/stats', getArticleStats);
router.post('/scrape', scrapeAndStore);

router.route('/:id')
    .get(getArticle)
    .put(updateArticle)
    .delete(deleteArticle);

module.exports = router;
