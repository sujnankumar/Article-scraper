const express = require('express');
const router = express.Router();
const processController = require('../controllers/processController');

router.post('/process', processController.triggerProcess);

module.exports = router;
