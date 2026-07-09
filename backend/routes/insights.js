const express = require('express');
const router = express.Router();
const { getInsights, createInsight } = require('../controllers/insightsController');

router.get('/', getInsights);
router.post('/', createInsight);

module.exports = router;
