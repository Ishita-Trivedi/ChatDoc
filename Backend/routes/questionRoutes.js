//Sends user questions and file data to OpenAI
const express = require('express');
const { handleUserQuestion } = require('../controllers/questionController');
const router = express.Router();

router.post('/ask', handleUserQuestion);

module.exports = router;
