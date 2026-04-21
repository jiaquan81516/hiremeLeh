const axios = require('axios');
const Job = require('../models/Job');

const MCF_BASE = 'https://api.mycareersfuture.gov.sg/v2';

const ALL_QUERIES = [
  // Targeted entry-level queries
  'fresh graduate singapore', 'entry level singapore',
  'junior executive singapore', 'graduate trainee singapore',

  // Internship-specific with singapore suffix to avoid rate limiting
  'intern singapore', 'internship singapore',
  'software intern singapore', 'data intern singapore',
  'business intern singapore', 'finance intern singapore',
  'marketing intern singapore', 'accounting intern singapore',
  'economics intern singapore', 'research intern singapore',
  'operations intern singapore', 'hr intern singapore',
  'technology intern singapore', 'engineering intern singapore',

  // SCIS
  'software engineer', 'software developer', 'data analyst',
  'backend developer', 'frontend developer', 'full stack developer',
  'backend engineer', 'frontend engineer', 'data engineer',
  'data scientist', 'machine learning engineer', 'ai engineer',
  'devops engineer', 'cloud engineer', 'cybersecurity analyst',
  'mobile developer', 'android developer', 'ios developer',
  'qa engineer', 'software tester', 'systems analyst',
  'product manager', 'ux designer', 'ui designer',
  'network engineer', 'site reliability engineer',
  'information technology', 'it analyst', 'it executive',
  'web developer', 'application developer', 'technical analyst',

  // Business
  'marketing executive', 'marketing analyst', 'marketing intern',
  'business development', 'sales executive', 'sales intern',
  'operations analyst', 'operations executive', 'operations intern',
  'management trainee', 'hr executive', 'human resource',
  'supply chain analyst', 'logistics executive', 'procurement analyst',
  'corporate banking', 'investment banking intern', 'relationship manager',
  'strategy analyst', 'commercial analyst',
  'digital marketing', 'brand executive', 'communications executive',
  'customer success', 'account manager', 'partnerships',

  // Economics
  'research analyst', 'policy analyst', 'economist',
  'quantitative analyst', 'quant analyst', 'market research analyst',
  'investment analyst', 'portfolio analyst', 'fund analyst',
  'actuarial analyst', 'economic analyst', 'risk analyst',
  'credit analyst', 'equity analyst', 'equity research',
  'valuation analyst', 'trading analyst', 'investment associate',
  'market analyst', 'economic research',

  // Accountancy
  'audit associate', 'audit executive', 'audit intern', 'auditor',
  'tax associate', 'tax executive', 'tax intern', 'tax consultant',
  'assurance associate', 'assurance intern',
  'accountant', 'accounts executive', 'accounts assistant',
  'accounting intern', 'accounting associate',
  'finance executive', 'finance intern', 'finance associate',
  'financial controller', 'treasury analyst', 'treasury intern',
  'compliance analyst', 'compliance intern',
  'corporate finance analyst', 'financial reporting',
  'internal auditor', 'accounts payable', 'accounts receivable',
  'payroll executive', 'bookkeeper', 'full set accountant',
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

const COURSE_TITLE_PATTERNS = {
  accountancy: [
    'audit intern', 'audit associate', 'audit executive', 'auditor', 'external audit',
    'internal audit', 'assurance intern', 'assurance associate', 'audit trainee',
    'tax intern', 'tax associate', 'tax executive', 'tax consultant', 'tax analyst',
    'indirect tax', 'corporate tax', 'transfer pricing',
    'accounting intern', 'accountant', 'accounts executive', 'accounts assistant',
    'accounts payable', 'accounts receivable', 'accounting associate',
    'account payable', 'account receivable', 'full set accountant',
    'bookkeeper', 'gl accountant', 'general ledger',
    'finance intern', 'finance executive', 'finance associate', 'finance assistant',
    'financial controller', 'financial reporting', 'financial accounting',
    'treasury analyst', 'treasury intern', 'treasury executive',
    'compliance analyst', 'compliance intern', 'compliance executive',
    'payroll executive', 'payroll analyst', 'payroll intern',
    'corporate finance intern', 'corporate finance analyst',
    'assurance trainee', 'audit trainee', 'tax trainee',
  ],
  economics: [
    'research analyst', 'research associate', 'research intern', 'research executive',
    'policy analyst', 'policy intern', 'policy associate', 'policy researcher',
    'economic analyst', 'economist', 'economic research',
    'quantitative analyst', 'quant analyst', 'quant researcher', 'quant trader',
    'investment analyst', 'investment associate', 'investment intern', 'investment trainee',
    'portfolio analyst', 'portfolio associate', 'fund analyst', 'fund associate',
    'equity analyst', 'equity research', 'fixed income analyst',
    'trading analyst', 'trading associate', 'trading intern', 'commodities analyst',
    'risk analyst', 'risk associate', 'risk intern', 'credit analyst',
    'credit associate', 'credit intern', 'market risk', 'credit risk',
    'market research analyst', 'market analyst', 'market intelligence',
    'actuarial analyst', 'actuarial intern', 'actuarial associate', 'actuary',
    'valuation analyst', 'valuation intern', 'financial advisory',
    'mergers and acquisitions', 'due diligence analyst',
  ],
  scis: [
    'software engineer', 'software developer', 'software intern',
    'backend engineer', 'backend developer', 'frontend engineer', 'frontend developer',
    'full stack', 'fullstack', 'full-stack',
    'mobile developer', 'android developer', 'ios developer',
    'web developer', 'application developer', 'app developer',
    'data scientist', 'data engineer', 'data analyst',
    'machine learning', 'ml engineer', 'ai engineer', 'artificial intelligence',
    'deep learning', 'nlp engineer', 'computer vision',
    'devops', 'cloud engineer', 'site reliability', 'infrastructure engineer',
    'platform engineer', 'network engineer', 'systems engineer',
    'cybersecurity', 'security engineer', 'security analyst', 'penetration tester',
    'qa engineer', 'quality assurance', 'software tester', 'test engineer',
    'product manager', 'product analyst', 'ux designer', 'ui designer',
    'product designer', 'ux researcher',
    'it analyst', 'it executive', 'it intern', 'it support',
    'systems analyst', 'business analyst', 'technical analyst',
    'database administrator', 'database analyst',
  ],
  business: [
    'marketing executive', 'marketing analyst', 'marketing intern', 'marketing associate',
    'digital marketing', 'brand executive', 'brand analyst', 'brand intern',
    'content creator', 'content marketing', 'social media',
    'communications executive', 'public relations', 'pr executive',
    'sales executive', 'sales intern', 'sales associate', 'sales analyst',
    'business development', 'commercial analyst', 'partnerships',
    'account manager', 'client relations', 'customer success',
    'operations executive', 'operations analyst', 'operations intern',
    'supply chain analyst', 'supply chain intern', 'supply chain executive',
    'logistics executive', 'logistics analyst', 'logistics intern',
    'procurement analyst', 'procurement executive', 'procurement intern',
    'hr executive', 'hr analyst', 'hr intern', 'human resource',
    'talent acquisition', 'recruitment intern', 'recruitment consultant', 'people operations',
    'strategy analyst', 'strategy intern', 'strategy associate',
    'management trainee', 'management associate', 'graduate programme',
    'consultant intern', 'consulting analyst', 'management consultant',
    'relationship manager', 'corporate banking', 'investment banking intern',
    'wealth management', 'private banking', 'retail banking',
  ],
};

const COURSE_PRIORITY = ['accountancy', 'economics', 'scis', 'business'];

function detectCourses(title, description) {
  const titleLower = title.toLowerCase();

  for (const course of COURSE_PRIORITY) {
    const patterns = COURSE_TITLE_PATTERNS[course];
    if (patterns.some(p => titleLower.includes(p))) {
      return [course];
    }
  }

  const descLower = description.toLowerCase();
  const descPatterns = {
    accountancy: ['big 4', 'pwc', 'deloitte', 'ernst & young', 'kpmg', 'grant thornton', 'mazars', 'bdo', 'rsm', 'financial statements', 'general ledger', 'accounts payable', 'accounts receivable', 'bookkeeping', 'sfrs', 'ifrs '],
    economics: ['econometric', 'monetary policy', 'macroeconomic', 'microeconomic', 'fiscal policy', 'investment portfolio', 'asset management', 'hedge fund', 'private equity', 'venture capital', 'fixed income', 'derivatives'],
    scis: ['software development', 'web development', 'app development', 'coding', 'programming', 'agile', 'scrum', 'github', 'version control'],
    business: ['go-to-market', 'brand awareness', 'lead generation', 'b2b', 'b2c', 'crm system', 'customer acquisition'],
  };

  for (const course of COURSE_PRIORITY) {
    if (descPatterns[course].some(p => descLower.includes(p))) {
      return [course];
    }
  }

  return ['general'];
}

function extractSkills(text) {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter(skill => lower.includes(skill));
}

function detectCompanySize(companyName) {
  const name = (companyName || '').toLowerCase();
  const govKeywords = ['government', 'ministry', 'agency', 'authority', 'board', 'govtech', 'iras', 'cpf', 'hdb', 'lta', 'mas ', 'mof', 'moh', 'nea', 'sla', 'imda', 'edb', 'a*star', 'dsta', 'dso'];
  const mncKeywords = ['google', 'meta', 'amazon', 'microsoft', 'apple', 'grab', 'shopee', 'sea ', 'dbs', 'ocbc', 'uob', 'citibank', 'hsbc', 'jp morgan', 'goldman', 'morgan stanley', 'mckinsey', 'bcg', 'bain', 'deloitte', 'pwc', 'kpmg', 'ernst', 'accenture', 'ibm', 'oracle', 'sap', 'salesforce', 'singtel', 'starhub', 'capitaland', 'keppel', 'st engineering', 'singapore airlines'];
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

function formatSalary(min, max) {
  if (!min && !max) return 'Not stated';
  if (min && max) return `$${min.toLocaleString()}–$${max.toLocaleString()}`;
  if (min) return `From $${min.toLocaleString()}`;
  return `Up to $${max.toLocaleString()}`;
}

function isStudentRelevant(job) {
  const title = (job.title || '').toLowerCase();
  const desc = (job.description || '').toLowerCase();
  const text = title + ' ' + desc;

  // Always keep internships and attachments
  if (title.includes('intern') || title.includes('attachment')) return true;

  // Reject if min experience > 3 years
  const minExp = job.minimumYearsExperience || 0;
  if (minExp > 3) return false;

  // Reject senior/managerial titles
  const seniorTitles = [
    'senior', 'sr.', 'lead', 'principal', 'head of', 'director',
    'vp ', 'vice president', 'chief', 'cto', 'cfo', 'coo', 'ceo',
    'manager', 'partner', 'president', 'founder', 'c-suite',
  ];
  if (seniorTitles.some(s => title.includes(s))) return false;

  // Reject if description explicitly requires many years
  const expPatterns = [
    /[4-9]+?s*years?s*(ofs*)?(relevants*)?experience/i,
    /minimums*[4-9]s*years?/i,
    /at leasts*[4-9]s*years?/i,
    /[4-9]s*tos*d+s*years?s*experience/i,
  ];
  if (expPatterns.some(p => p.test(text))) return false;

  return true;
}

async function syncJobs() {
  try {
    let allJobs = [];
    for (let i = 0; i < ALL_QUERIES.length; i += 1) {
      const batch = ALL_QUERIES.slice(i, i + 1);
      await Promise.all(batch.map(async (q) => {
        try {
          for (let page = 0; page < 1; page++) {
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
      await new Promise(r => setTimeout(r, 5000));
    }

    const seen = new Set();
    const unique = allJobs.filter(j => {
      if (!j.uuid || seen.has(j.uuid)) return false;
      seen.add(j.uuid);
      return isStudentRelevant(j);
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
          skills, courses, companySize, workArrangement, applicationCount,
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
    console.log(`Synced ${saved} unique jobs`);
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

    if (course && course !== 'all') {
      query.courses = { $in: [course] };
    }

    if (internship === 'true') query.isInternship = true;
    if (companySize) query.companySize = companySize;
    if (workArrangement) query.workArrangement = workArrangement;
    if (salaryMin) query['salary.min'] = { $gte: Number(salaryMin) };
    if (salaryMax) query['salary.max'] = { $lte: Number(salaryMax) };

    if (hiddenGems === 'true') {
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      query.postedAt = { $gte: twoDaysAgo };
      query.applicationCount = { $lt: 10 };
    }

    if (closingSoon === 'true') {
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      query.closingAt = { $lte: sevenDaysFromNow, $gte: new Date() };
    }

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