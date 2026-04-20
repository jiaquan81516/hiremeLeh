const axios = require('axios');
const Job = require('../models/Job');

const MCF_BASE = 'https://api.mycareersfuture.gov.sg/v2';

const ALL_QUERIES = [
  // IS / Tech
  'software engineer intern', 'data analyst intern', 'it intern',
  'backend developer', 'full stack developer', 'systems analyst',
  // CS
  'software developer', 'devops intern', 'cloud engineer intern',
  'machine learning intern', 'frontend developer',
  // Business
  'business analyst intern', 'consultant intern', 'marketing intern',
  'business development intern', 'operations intern', 'management trainee',
  'corporate banking intern', 'investment banking intern',
  // Economics
  'research analyst intern', 'policy analyst intern', 'economist intern',
  'quantitative analyst intern', 'market research intern',
  // Accountancy
  'audit intern', 'tax intern', 'assurance intern', 'accounting intern',
  'finance intern', 'internal audit intern',
];

const SKILL_KEYWORDS = [
  'python', 'javascript', 'sql', 'node', 'react', 'mongodb',
  'express', 'tableau', 'firebase', 'git', 'html', 'css',
  'java', 'c++', 'typescript', 'aws', 'docker', 'kubernetes',
  'machine learning', 'data analysis', 'excel', 'power bi',
  'r', 'stata', 'sap', 'myob', 'powerpoint', 'financial modelling',
  'econometrics', 'salesforce', 'crm', 'ifrs', 'audit', 'tax',
];

const COURSE_KEYWORDS = {
  is: ['software', 'data', 'it ', 'tech', 'system', 'python', 'javascript', 'database', 'developer', 'analyst', 'product'],
  cs: ['software engineer', 'backend', 'frontend', 'devops', 'cloud', 'machine learning', 'platform', 'swe'],
  business: ['business', 'consultant', 'marketing', 'operations', 'commercial', 'strategy', 'management', 'corporate', 'investment banking'],
  economics: ['research', 'policy', 'economist', 'quantitative', 'market research', 'economic', 'mas intern', 'mof'],
  accountancy: ['audit', 'tax', 'assurance', 'accounting', 'finance intern', 'big 4', 'pwc', 'deloitte', 'ey', 'kpmg', 'financial report'],
};

function extractSkills(text) {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter(skill => lower.includes(skill));
}

function detectCourse(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  for (const [course, keywords] of Object.entries(COURSE_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) return course;
  }
  return 'general';
}

function formatSalary(min, max) {
  if (!min && !max) return 'Not stated';
  if (min && max) return `$${min.toLocaleString()}–$${max.toLocaleString()}`;
  if (min) return `From $${min.toLocaleString()}`;
  return `Up to $${max.toLocaleString()}`;
}

async function syncJobs() {
  try {
    let allJobs = [];
    for (const q of ALL_QUERIES) {
      try {
        const res = await axios.get(`${MCF_BASE}/jobs`, {
          params: { search: q, limit: 20, page: 0 },
          headers: { 'User-Agent': 'HiremeLeh/1.0' },
          timeout: 10000,
        });
        allJobs = allJobs.concat(res.data?.results || []);
      } catch (e) {
        console.error(`Query failed: ${q} — ${e.message}`);
      }
    }

    let saved = 0;
    for (const job of allJobs) {
      const title = job.title || '';
      const desc = job.description || '';
      const skills = extractSkills(title + ' ' + desc);
      const course = detectCourse(title, desc);
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
          course,
          sector: job.ssocDetailList?.[0]?.ssocTitle || 'General',
          url: `https://www.mycareersfuture.gov.sg/job/${job.uuid}`,
          postedAt: job.metadata?.createdAt ? new Date(job.metadata.createdAt) : new Date(),
          closingAt: job.metadata?.expiryDate ? new Date(job.metadata.expiryDate) : null,
          isInternship: title.toLowerCase().includes('intern'),
        },
        { upsert: true, new: true }
      );
      saved++;
    }
    console.log(`Synced ${saved} jobs across all course tracks`);
  } catch (err) {
    console.error('Job sync failed:', err.message);
  }
}

async function getJobs(req, res) {
  try {
    const { search, course, internship, page = 0, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (course && course !== 'all') query.course = course;
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
    const { course } = req.query;
    const filter = course && course !== 'all' ? { course } : {};
    const jobs = await Job.find(filter);

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
      .map(([skill, count]) => ({ skill, count, pct: Math.round((count / Math.max(jobs.length, 1)) * 100) }));

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
    const { skills, course } = req.query;
    if (!skills) return res.status(400).json({ error: 'skills query param required' });

    const userSkills = skills.split(',').map(s => s.trim().toLowerCase());
    const filter = course && course !== 'all' ? { course } : {};
    const jobs = await Job.find(filter);

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
        pct: Math.round((count / Math.max(jobs.length, 1)) * 100),
        have: userSkills.some(us => us.includes(skill) || skill.includes(us)),
      }));

    const have = topDemanded.filter(s => s.have).length;
    const score = Math.round((have / Math.max(topDemanded.length, 1)) * 100);

    res.json({ score, skills: topDemanded });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { syncJobs, getJobs, getTrends, getSkillGap };
