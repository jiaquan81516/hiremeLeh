const express = require('express');
const router = express.Router();
const { getJobs, getTrends, getSkillGap, getTopSkills } = require('../controllers/jobsController');
router.get('/', getJobs);
router.get('/trends', getTrends);
router.get('/skillgap', getSkillGap);
router.get('/topskills', getTopSkills);


module.exports = router;
