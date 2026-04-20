export const COURSES = {
  all: {
    label: 'All Courses',
    keywords: [
      'intern', 'graduate', 'analyst', 'associate', 'software engineer',
      'consultant', 'developer', 'data', 'audit', 'research', 'marketing',
      'operations', 'business development', 'accounting', 'economist'
    ],
    skills: [
      'python', 'sql', 'excel', 'javascript', 'tableau', 'powerpoint',
      'communication', 'data analysis', 'project management'
    ],
    skillLabels: {
      python: 'Python', sql: 'SQL', excel: 'Excel', javascript: 'JavaScript',
      tableau: 'Tableau', powerpoint: 'PowerPoint', communication: 'Communication',
      'data analysis': 'Data Analysis', 'project management': 'Project Management'
    },
    companies: [
      'GovTech', 'DBS Bank', 'OCBC', 'Shopee', 'Sea Group', 'Grab',
      'PwC', 'Deloitte', 'McKinsey', 'Singtel'
    ],
  },
  is: {
    label: 'Information Systems',
    keywords: [
      'software engineer', 'data analyst', 'it intern', 'backend developer',
      'full stack developer', 'systems analyst', 'business analyst', 'data engineer',
      'product manager', 'python', 'javascript', 'database'
    ],
    skills: [
      'python', 'javascript', 'sql', 'node.js', 'react', 'mongodb',
      'express', 'tableau', 'firebase', 'git', 'html', 'css'
    ],
    skillLabels: {
      python: 'Python', javascript: 'JavaScript', sql: 'SQL', 'node.js': 'Node.js',
      react: 'React', mongodb: 'MongoDB', express: 'Express.js', tableau: 'Tableau',
      firebase: 'Firebase', git: 'Git/GitHub', html: 'HTML', css: 'CSS'
    },
    companies: [
      'GovTech', 'DBS Bank', 'Shopee', 'Sea Group', 'Grab', 'OCBC',
      'Singtel', 'Circles.Life', 'Accenture', 'IBM'
    ],
  },
  cs: {
    label: 'Computer Science',
    keywords: [
      'software engineer', 'backend engineer', 'frontend engineer', 'SWE intern',
      'software developer', 'devops', 'cloud engineer', 'machine learning',
      'systems engineer', 'platform engineer', 'site reliability'
    ],
    skills: [
      'python', 'java', 'c++', 'javascript', 'typescript', 'sql',
      'aws', 'docker', 'kubernetes', 'react', 'node.js', 'git'
    ],
    skillLabels: {
      python: 'Python', java: 'Java', 'c++': 'C++', javascript: 'JavaScript',
      typescript: 'TypeScript', sql: 'SQL', aws: 'AWS', docker: 'Docker',
      kubernetes: 'Kubernetes', react: 'React', 'node.js': 'Node.js', git: 'Git/GitHub'
    },
    companies: [
      'Shopee', 'Sea Group', 'Grab', 'GovTech', 'Google', 'Meta',
      'ByteDance', 'Stripe', 'Salesforce', 'Atlassian'
    ],
  },
  business: {
    label: 'Business (BBA)',
    keywords: [
      'business analyst', 'consultant', 'operations intern', 'marketing intern',
      'business development', 'strategy intern', 'management trainee',
      'commercial analyst', 'corporate banking', 'investment banking intern'
    ],
    skills: [
      'excel', 'powerpoint', 'financial modelling', 'sql', 'tableau',
      'communication', 'project management', 'data analysis', 'crm', 'salesforce'
    ],
    skillLabels: {
      excel: 'Excel', powerpoint: 'PowerPoint', 'financial modelling': 'Financial Modelling',
      sql: 'SQL', tableau: 'Tableau', communication: 'Communication',
      'project management': 'Project Management', 'data analysis': 'Data Analysis',
      crm: 'CRM', salesforce: 'Salesforce'
    },
    companies: [
      'McKinsey', 'BCG', 'Bain', 'Deloitte', 'DBS Bank', 'OCBC',
      'UBS', 'Goldman Sachs', 'Morgan Stanley', 'Grab'
    ],
  },
  economics: {
    label: 'Economics',
    keywords: [
      'research analyst', 'policy analyst', 'economist intern', 'MAS intern',
      'economic research', 'data analyst', 'quantitative analyst',
      'market research', 'public policy', 'MOF intern'
    ],
    skills: [
      'r', 'stata', 'python', 'excel', 'sql', 'data analysis',
      'econometrics', 'tableau', 'powerpoint', 'research'
    ],
    skillLabels: {
      r: 'R', stata: 'Stata', python: 'Python', excel: 'Excel', sql: 'SQL',
      'data analysis': 'Data Analysis', econometrics: 'Econometrics',
      tableau: 'Tableau', powerpoint: 'PowerPoint', research: 'Research'
    },
    companies: [
      'MAS', 'MOF', 'MTI', 'GovTech', 'DBS Bank', 'OCBC',
      'World Bank', 'UNDP', 'EDB', 'A*STAR'
    ],
  },
  accountancy: {
    label: 'Accountancy',
    keywords: [
      'audit intern', 'tax intern', 'assurance intern', 'accounting intern',
      'Big 4', 'financial reporting', 'audit associate', 'corporate tax',
      'internal audit', 'finance intern', 'accounts executive'
    ],
    skills: [
      'excel', 'sap', 'myob', 'financial reporting', 'powerpoint',
      'sql', 'accounting', 'tax', 'audit', 'ifrs'
    ],
    skillLabels: {
      excel: 'Excel', sap: 'SAP', myob: 'MYOB', 'financial reporting': 'Financial Reporting',
      powerpoint: 'PowerPoint', sql: 'SQL', accounting: 'Accounting',
      tax: 'Tax', audit: 'Audit', ifrs: 'IFRS'
    },
    companies: [
      'PwC', 'Deloitte', 'EY', 'KPMG', 'Grant Thornton',
      'RSM', 'BDO', 'DBS Bank', 'OCBC', 'Temasek'
    ],
  },
};

export const COURSE_DEADLINES = {
  all: ['GovTech', 'DBS Bank', 'OCBC', 'Shopee', 'Sea Group', 'Grab', 'Singtel', 'PwC'],
  is: ['GovTech', 'DBS Bank', 'Shopee', 'Sea Group', 'Grab', 'OCBC', 'Singtel', 'Circles.Life'],
  cs: ['Shopee', 'Sea Group', 'Grab', 'GovTech', 'ByteDance', 'Salesforce', 'Atlassian', 'Stripe'],
  business: ['McKinsey', 'BCG', 'Deloitte', 'DBS Bank', 'OCBC', 'UBS', 'Goldman Sachs', 'Grab'],
  economics: ['MAS', 'MOF', 'GovTech', 'DBS Bank', 'EDB', 'MTI', 'OCBC', 'A*STAR'],
  accountancy: ['PwC', 'Deloitte', 'EY', 'KPMG', 'Grant Thornton', 'RSM', 'BDO', 'Temasek'],
};
