const express = require('express');
const router = express.Router();
const { getJobs, getTrends, getSkillGap } = require('../controllers/jobsController');

router.get('/', getJobs);
router.get('/trends', getTrends);
router.get('/skillgap', getSkillGap);

module.exports = router;
