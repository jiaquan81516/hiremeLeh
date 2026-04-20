const Insight = require('../models/Insight');

async function getInsights(req, res) {
  try {
    const { company } = req.query;
    const query = { approved: true };
    if (company) query.company = { $regex: company, $options: 'i' };

    const insights = await Insight.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createInsight(req, res) {
  try {
    const { company, role, salary, interviewFormat, advice, university, year } = req.body;

    if (!company || !role || !interviewFormat || !advice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const insight = await Insight.create({
      company, role, salary, interviewFormat, advice, university, year, approved: true,
    });

    res.status(201).json(insight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Seed some initial insights if DB is empty
async function seedInsights() {
  const count = await Insight.countDocuments();
  if (count > 0) return;

  await Insight.insertMany([
    {
      company: 'GovTech', role: 'Software Engineering Intern', salary: '$1,400/mo',
      interviewFormat: '2 rounds — online coding test (LeetCode easy/medium), then a 45-min technical interview with system design basics.',
      advice: 'Brush up on REST APIs and basic SQL queries. They care more about problem-solving approach than perfect syntax.',
      university: 'SMU', year: 'Year 2', approved: true,
    },
    {
      company: 'Shopee', role: 'Backend Engineering Intern', salary: '$1,800/mo',
      interviewFormat: '3 rounds — HR screen, coding test (Python/JS), final with hiring manager. Fast process, got offer in 2 weeks.',
      advice: 'Having a GitHub with actual projects matters. They asked me to walk through my code live.',
      university: 'NTU', year: 'Year 3', approved: true,
    },
    {
      company: 'DBS Bank', role: 'Data Analyst Intern', salary: '$1,600/mo',
      interviewFormat: 'Case study + SQL test sent beforehand, then 1 interview with the team. Very chill, more about fit than hard skills.',
      advice: 'Know your resume inside out. They asked me to explain every single project bullet point.',
      university: 'SMU', year: 'Year 2', approved: true,
    },
  ]);

  console.log('Seeded initial insights');
}

module.exports = { getInsights, createInsight, seedInsights };
