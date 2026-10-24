const express = require('express');
const { getMetrics } = require('../services/metricsService');
const { requireApiAuth } = require('../middleware/auth');

const router = express.Router();
router.get('/', requireApiAuth, (req, res) => res.json(getMetrics(req.userId)));

module.exports = router;
