const BASE = process.env.REACT_APP_API_BASE_URL || '';

function cleanParams(params) {
  const cleaned = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== 'undefined' && value !== '' && value !== false) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export async function fetchTrends(course = 'all') {
  const res = await fetch(`${BASE}/api/jobs/trends?course=${course}`);
  return res.json();
}

export async function fetchJobs(params = {}) {
  const qs = new URLSearchParams(cleanParams(params)).toString();
  const res = await fetch(`${BASE}/api/jobs?${qs}`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}

export async function fetchTopSkills(course = 'all') {
  const res = await fetch(`${BASE}/api/jobs/topskills?course=${course}`);
  return res.json();
}

export async function fetchSkillGap(skills, course = 'all') {
  const res = await fetch(`${BASE}/api/jobs/skillgap?skills=${encodeURIComponent(skills.join(','))}&course=${course}`);
  return res.json();
}

export async function fetchInsights(company = '') {
  const qs = company ? `?company=${encodeURIComponent(company)}` : '';
  const res = await fetch(`${BASE}/api/insights${qs}`);
  return res.json();
}

export async function submitInsight(data) {
  const res = await fetch(`${BASE}/api/insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
