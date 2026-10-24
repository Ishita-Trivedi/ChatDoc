// Sends user questions and retrieved document evidence to the configured AI provider.
const express = require('express');
const { handleUserQuestion, handleStreamingQuestion, handleComparison } = require('../controllers/questionController');
const { requireApiAuth } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');
const router = express.Router();

router.use(requireApiAuth, rateLimit({ limit: 30 }));
router.post('/ask', handleUserQuestion);
router.post('/ask/stream', handleStreamingQuestion);
router.post('/compare', handleComparison);

module.exports = router;
