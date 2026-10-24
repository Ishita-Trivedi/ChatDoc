//Sends user questions and file data to OpenAI
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
