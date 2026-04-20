const express = require('express');
const router = express.Router();
const { getInsights, createInsight, seedInsights } = require('../controllers/insightsController');

seedInsights();

router.get('/', getInsights);
router.post('/', createInsight);

module.exports = router;
