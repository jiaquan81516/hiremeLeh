const axios = require('axios');
const Job = require('../models/Job');

const MCF_BASE = 'https://api.mycareersfuture.gov.sg/v2';

const TECH_KEYWORDS = [
  'software', 'developer', 'engineer', 'data', 'analyst',
  'backend', 'frontend', 'fullstack', 'full-stack', 'devops',
  'cloud', 'it ', 'tech', 'intern', 'python', 'javascript'
];

const SKILL_KEYWORDS = [
  'python', 'javascript', 'sql', 'node', 'react', 'mongodb',
  'express', 'tableau', 'firebase', 'git', 'html', 'css',
  'java', 'c++', 'typescript', 'aws', 'docker', 'kubernetes',
  'machine learning', 'data analysis', 'excel', 'power bi'
];

function extractSkills(text) {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter(skill => lower.includes(skill));
}

function isTechJob(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  return TECH_KEYWORDS.some(kw => text.includes(kw));
}

function formatSalary(min, max) {
  if (!min && !max) return 'Not stated';
  if (min && max) return `$${min.toLocaleString()}–$${max.toLocaleString()}`;
  if (min) return `From $${min.toLocaleString()}`;
  return `Up to $${max.toLocaleString()}`;
}

async function syncJobs() {
  try {
    const queries = ['software engineer', 'data analyst intern', 'it intern', 'backend developer', 'full stack developer'];
    let allJobs = [];

    for (const q of queries) {
      const res = await axios.get(`${MCF_BASE}/jobs`, {
        params: { search: q, limit: 20, page: 0 },
        headers: { 'User-Agent': 'HiremeLeh/1.0' },
        timeout: 10000,
      });

      const results = res.data?.results || [];
      allJobs = allJobs.concat(results);
    }

    let saved = 0;
    for (const job of allJobs) {
      const title = job.title || '';
      const desc = job.description || '';
      if (!isTechJob(title, desc)) continue;

      const skills = extractSkills(title + ' ' + desc);
      const minSalary = job.salary?.minimum;
      const maxSalary = job.salary?.maximum;

      await Job.findOneAndUpdate(
        { mcfId: job.uuid },
        {
          mcfId: job.uuid,
          title,
          company: job.postedCompany?.name || 'Unknown',
          salary: { min: minSalary, max: maxSalary, display: formatSalary(minSalary, maxSalary) },
          skills,
          sector: job.ssocDetailList?.[0]?.ssocTitle || 'Tech',
          url: `https://www.mycareersfuture.gov.sg/job/${job.uuid}`,
          postedAt: job.metadata?.createdAt ? new Date(job.metadata.createdAt) : new Date(),
          closingAt: job.metadata?.expiryDate ? new Date(job.metadata.expiryDate) : null,
          isInternship: title.toLowerCase().includes('intern'),
        },
        { upsert: true, new: true }
      );
      saved++;
    }

    console.log(`Synced ${saved} tech jobs from MyCareersFuture`);
  } catch (err) {
    console.error('Job sync failed:', err.message);
  }
}

async function getJobs(req, res) {
  try {
    const { search, sector, internship, page = 0, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (sector) query.sector = { $regex: sector, $options: 'i' };
    if (internship === 'true') query.isInternship = true;

    const jobs = await Job.find(query)
      .sort({ postedAt: -1 })
      .skip(Number(page) * Number(limit))
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    res.json({ jobs, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTrends(req, res) {
  try {
    const jobs = await Job.find({});
    const skillCount = {};
    const companyCount = {};

    for (const job of jobs) {
      for (const skill of job.skills) {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      }
      companyCount[job.company] = (companyCount[job.company] || 0) + 1;
    }

    const topSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count, pct: Math.round((count / jobs.length) * 100) }));

    const topCompanies = Object.entries(companyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([company, count]) => ({ company, count }));

    const avgSalary = jobs
      .filter(j => j.salary?.min)
      .reduce((sum, j, _, arr) => sum + j.salary.min / arr.length, 0);

    res.json({
      totalJobs: jobs.length,
      avgSalary: Math.round(avgSalary),
      topSkills,
      topCompanies,
      internships: jobs.filter(j => j.isInternship).length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getSkillGap(req, res) {
  try {
    const { skills } = req.query;
    if (!skills) return res.status(400).json({ error: 'skills query param required' });

    const userSkills = skills.split(',').map(s => s.trim().toLowerCase());
    const jobs = await Job.find({});

    const demanded = {};
    for (const job of jobs) {
      for (const skill of job.skills) {
        demanded[skill] = (demanded[skill] || 0) + 1;
      }
    }

    const topDemanded = Object.entries(demanded)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([skill, count]) => ({
        skill,
        count,
        pct: Math.round((count / jobs.length) * 100),
        have: userSkills.some(us => us.includes(skill) || skill.includes(us)),
      }));

    const have = topDemanded.filter(s => s.have).length;
    const score = Math.round((have / topDemanded.length) * 100);

    res.json({ score, skills: topDemanded });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { syncJobs, getJobs, getTrends, getSkillGap };
