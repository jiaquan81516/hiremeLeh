const axios = require('axios');
const Job = require('../models/Job');

const MCF_BASE = 'https://api.mycareersfuture.gov.sg/v2';

const ALL_QUERIES = [
  // Broad
  'internship singapore', 'fresh graduate singapore', 'entry level',
  'junior associate', 'trainee', 'attachment',

  // IS / Tech
  'software engineer intern', 'data analyst intern', 'it intern',
  'backend developer', 'full stack developer', 'systems analyst',
  'product manager intern', 'business analyst', 'data engineer intern',
  'cybersecurity intern', 'ux designer intern', 'ui designer intern',
  'mobile developer intern', 'data science intern', 'ai intern',
  'machine learning intern', 'network engineer intern',

  // CS
  'software developer intern', 'devops intern', 'cloud engineer intern',
  'frontend developer intern', 'backend engineer intern',
  'software testing intern', 'qa engineer intern',

  // Business
  'business analyst intern', 'consultant intern', 'marketing intern',
  'business development intern', 'operations intern', 'management trainee',
  'corporate banking intern', 'investment banking intern',
  'digital marketing intern', 'brand marketing intern',
  'sales intern', 'strategy intern', 'hr intern',
  'supply chain intern', 'logistics intern', 'commercial analyst',

  // Economics
  'research analyst intern', 'policy analyst intern', 'economist intern',
  'quantitative analyst intern', 'market research intern',
  'financial analyst intern', 'investment analyst intern',
  'risk analyst intern', 'credit analyst intern',

  // Accountancy
  'audit intern', 'tax intern', 'assurance intern', 'accounting intern',
  'finance intern', 'internal audit intern',
  'financial reporting intern', 'corporate finance intern',
  'treasury intern', 'compliance intern',
];

const SKILL_KEYWORDS = [
  'python', 'javascript', 'sql', 'node', 'react', 'mongodb',
  'express', 'tableau', 'firebase', 'git', 'html', 'css',
  'java', 'c++', 'typescript', 'aws', 'docker', 'kubernetes',
  'machine learning', 'data analysis', 'excel', 'power bi',
  'r', 'stata', 'sap', 'myob', 'powerpoint', 'financial modelling',
  'econometrics', 'salesforce', 'crm', 'ifrs', 'audit', 'tax',
  'figma', 'photoshop', 'swift', 'kotlin', 'flutter',
  'django', 'flask', 'vue', 'angular', 'tensorflow', 'pytorch',
  'pandas', 'numpy', 'spark', 'accounting', 'financial reporting',
];

// Each job can belong to MULTIPLE courses
const COURSE_PATTERNS = {
  is: [
    'software', 'data', 'it ', 'tech', 'system', 'python', 'javascript',
    'database', 'developer', 'analyst', 'product', 'ux', 'ui',
    'cybersecurity', 'information', 'digital', 'web ', 'app ',
  ],
  cs: [
    'software engineer', 'backend', 'frontend', 'devops', 'cloud',
    'machine learning', 'platform', 'swe', 'mobile', 'android',
    'ios', 'qa', 'testing', 'infrastructure', 'site reliability',
  ],
  business: [
    'business', 'consult', 'marketing', 'operations', 'commercial',
    'strategy', 'management', 'corporate', 'investment banking',
    'sales', 'hr ', 'human resource', 'supply chain', 'logistics',
    'brand', 'digital marketing', 'account manager', 'relationship',
    'client', 'business development', 'partnerships',
  ],
  economics: [
    'research', 'policy', 'economist', 'quantitative', 'market research',
    'economic', 'financial analyst', 'investment analyst', 'risk',
    'credit analyst', 'fund', 'portfolio', 'macroeconomic',
    'monetary', 'fiscal', 'regulatory',
  ],
  accountancy: [
    'audit', 'tax', 'assurance', 'accounti', 'finance intern',
    'big 4', 'pwc', 'deloitte', 'ernst', 'kpmg', 'grant thornton',
    'financial report', 'treasury', 'compliance', 'corporate finance',
    'accounts payable', 'accounts receivable', 'bookkeep',
    'payroll', 'financial controller', 'cfo', 'cpa',
  ],
};

// Detect company size from name heuristics
function detectCompanySize(companyName) {
  const name = (companyName || '').toLowerCase();
  const govKeywords = ['government', 'ministry', 'agency', 'authority', 'board', 'govtech', 'iras', 'cpf', 'hdb', 'lta', 'mas ', 'mof', 'moh', 'nea', 'sla', 'imda', 'edb', 'a*star', 'dsta', 'dso', 'saf', 'spf', 'scdf'];
  const mncKeywords = ['google', 'meta', 'amazon', 'microsoft', 'apple', 'grab', 'shopee', 'sea ', 'dbs', 'ocbc', 'uob', 'citibank', 'hsbc', 'jp morgan', 'goldman', 'morgan stanley', 'mckinsey', 'bcg', 'bain', 'deloitte', 'pwc', 'kpmg', 'ernst', 'accenture', 'ibm', 'oracle', 'sap', 'salesforce', 'singtel', 'starhub', 'm1 ', 'capitaland', 'jardine', 'wilmar', 'sembcorp', 'keppel', 'st engineering', 'singapore airlines', 'sia ', 'changi'];
  if (govKeywords.some(k => name.includes(k))) return 'government';
  if (mncKeywords.some(k => name.includes(k))) return 'mnc';
  if (name.includes('pte ltd') || name.includes('pte. ltd')) return 'sme';
  return 'startup';
}

function detectWorkArrangement(description) {
  const text = (description || '').toLowerCase();
  if (text.includes('fully remote') || text.includes('work from home') || text.includes('remote only')) return 'remote';
  if (text.includes('hybrid')) return 'hybrid';
  return 'onsite';
}

function detectCourses(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  const matched = [];
  for (const [course, patterns] of Object.entries(COURSE_PATTERNS)) {
    if (patterns.some(p => text.includes(p))) matched.push(course);
  }
  // If nothing matched, tag as general (shows up in "all")
  return matched.length > 0 ? matched : ['general'];
}

function formatSalary(min, max) {
  if (!min && !max) return 'Not stated';
  if (min && max) return `$${min.toLocaleString()}–$${max.toLocaleString()}`;
  if (min) return `From $${min.toLocaleString()}`;
  return `Up to $${max.toLocaleString()}`;
}

function extractSkills(text) {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter(skill => lower.includes(skill));
}

async function syncJobs() {
  try {
    let allJobs = [];
    for (let i = 0; i < ALL_QUERIES.length; i += 5) {
      const batch = ALL_QUERIES.slice(i, i + 5);
      await Promise.all(batch.map(async (q) => {
        try {
          for (let page = 0; page < 2; page++) {
            const res = await axios.get(`${MCF_BASE}/jobs`, {
              params: { search: q, limit: 50, page },
              headers: { 'User-Agent': 'HiremeLeh/1.0' },
              timeout: 12000,
            });
            const results = res.data?.results || [];
            allJobs = allJobs.concat(results);
            if (results.length < 50) break;
          }
        } catch (e) {
          console.error(`Query failed: ${q} — ${e.message}`);
        }
      }));
      await new Promise(r => setTimeout(r, 500));
    }

    // Deduplicate
    const seen = new Set();
    const unique = allJobs.filter(j => {
      if (!j.uuid || seen.has(j.uuid)) return false;
      seen.add(j.uuid);
      return true;
    });

    let saved = 0;
    for (const job of unique) {
      const title = job.title || '';
      const desc = job.description || '';
      const skills = extractSkills(title + ' ' + desc);
      const courses = detectCourses(title, desc);
      const companySize = detectCompanySize(job.postedCompany?.name);
      const workArrangement = detectWorkArrangement(desc);
      const minSalary = job.salary?.minimum;
      const maxSalary = job.salary?.maximum;
      const applicationCount = job.numberOfApplications || 0;

      await Job.findOneAndUpdate(
        { mcfId: job.uuid },
        {
          mcfId: job.uuid,
          title,
          company: job.postedCompany?.name || 'Unknown',
          salary: { min: minSalary, max: maxSalary, display: formatSalary(minSalary, maxSalary) },
          skills,
          courses,
          companySize,
          workArrangement,
          applicationCount,
          sector: job.ssocDetailList?.[0]?.ssocTitle || 'General',
          url: `https://www.mycareersfuture.gov.sg/job/${job.uuid}`,
          postedAt: job.metadata?.createdAt ? new Date(job.metadata.createdAt) : new Date(),
          closingAt: job.metadata?.expiryDate ? new Date(job.metadata.expiryDate) : null,
          isInternship: title.toLowerCase().includes('intern') || title.toLowerCase().includes('attachment'),
        },
        { upsert: true, new: true }
      );
      saved++;
    }
    console.log(`Synced ${saved} unique jobs across ${ALL_QUERIES.length} queries`);
  } catch (err) {
    console.error('Job sync failed:', err.message);
  }
}

async function getJobs(req, res) {
  try {
    const {
      search, course, internship, page = 0, limit = 20,
      sortBy = 'recent', salaryMin, salaryMax,
      companySize, workArrangement, hiddenGems, closingSoon,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Course filter — jobs now have courses array
    if (course && course !== 'all') {
      query.courses = { $in: [course] };
    }

    if (internship === 'true') query.isInternship = true;
    if (companySize) query.companySize = companySize;
    if (workArrangement) query.workArrangement = workArrangement;

    if (salaryMin) query['salary.min'] = { $gte: Number(salaryMin) };
    if (salaryMax) query['salary.max'] = { $lte: Number(salaryMax) };

    // Hidden gems: posted in last 48hrs AND fewer than 10 applicants
    if (hiddenGems === 'true') {
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      query.postedAt = { $gte: twoDaysAgo };
      query.applicationCount = { $lt: 10 };
    }

    // Closing soon: within 7 days
    if (closingSoon === 'true') {
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      query.closingAt = { $lte: sevenDaysFromNow, $gte: new Date() };
    }

    // Sort options
    const sortMap = {
      recent: { postedAt: -1 },
      leastApplicants: { applicationCount: 1 },
      salaryHigh: { 'salary.max': -1 },
      salaryLow: { 'salary.min': 1 },
      closingSoon: { closingAt: 1 },
    };
    const sort = sortMap[sortBy] || { postedAt: -1 };

    const jobs = await Job.find(query)
      .sort(sort)
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
    const filter = course && course !== 'all' ? { courses: { $in: [course] } } : {};
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
    const filter = course && course !== 'all' ? { courses: { $in: [course] } } : {};
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
        skill, count,
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