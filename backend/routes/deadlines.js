const express = require('express');
const router = express.Router();
const { getDeadlines, seedDeadlines } = require('../controllers/deadlinesController');

seedDeadlines();

router.get('/', getDeadlines);

module.exports = router;
