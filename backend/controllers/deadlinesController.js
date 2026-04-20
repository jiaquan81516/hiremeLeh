const Deadline = require('../models/Deadline');

async function getDeadlines(req, res) {
  try {
    const deadlines = await Deadline.find({ deadline: { $gte: new Date() } })
      .sort({ deadline: 1 });
    res.json(deadlines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function seedDeadlines() {
  const count = await Deadline.countDocuments();
  if (count > 0) return;

  const now = new Date();
  await Deadline.insertMany([
    { company: 'GovTech', role: 'Student Internship Programme', description: 'Software Eng / Data / UX · May–Aug 2026 intake', deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21), applyUrl: 'https://www.careers.gov.sg', intake: 'May–Aug 2026' },
    { company: 'DBS Bank', role: 'Tech Internship', description: 'Engineering / Data Analytics · Summer 2026', deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 24), applyUrl: 'https://www.dbs.com/careers', intake: 'Summer 2026' },
    { company: 'Sea Group', role: 'Internship (Shopee / Garena)', description: 'Backend / Full-stack · Rolling intake', deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 40), applyUrl: 'https://career.sea.com', intake: 'Rolling' },
    { company: 'Grab', role: 'Tech Internship Programme', description: 'Engineering · May–Aug 2026', deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 40), applyUrl: 'https://grab.careers', intake: 'May–Aug 2026' },
    { company: 'Singtel', role: 'Internship', description: 'IT / Software / Data · Summer 2026', deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 55), applyUrl: 'https://careers.singtel.com', intake: 'Summer 2026' },
    { company: 'OCBC', role: 'Technology Internship', description: 'Full-stack / Data Engineering', deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 60), applyUrl: 'https://www.ocbc.com/group/careers', intake: 'Summer 2026' },
  ]);

  console.log('Seeded deadlines');
}

module.exports = { getDeadlines, seedDeadlines };
