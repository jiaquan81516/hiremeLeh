const { syncJobs } = require('../controllers/jobsController');

async function refreshJobs() {
  const count = await syncJobs();
  return count ?? 0;
}

module.exports = { refreshJobs };
