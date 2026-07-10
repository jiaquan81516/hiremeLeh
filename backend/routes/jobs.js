const express = require('express');
const router = express.Router();
const { getJobs, getTrends, getSkillGap, getTopSkills } = require('../controllers/jobsController');
const { refreshJobs } = require('../services/jobRefreshService');

router.get('/', getJobs);
router.get('/trends', getTrends);
router.get('/skillgap', getSkillGap);
router.get('/topskills', getTopSkills);
router.post('/refresh', async (req, res) => {
  const refreshSecret = req.header('x-refresh-secret');

  if (!refreshSecret || refreshSecret !== process.env.REFRESH_JOBS_SECRET) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const count = await refreshJobs();
    return res.json({
      success: true,
      message: 'Jobs refreshed successfully',
      count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Job refresh failed',
    });
  }
});

module.exports = router;
