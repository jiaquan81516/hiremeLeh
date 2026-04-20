const BASE = process.env.REACT_APP_API_URL || '';

export async function fetchTrends() {
  const res = await fetch(`${BASE}/api/jobs/trends`);
  return res.json();
}

export async function fetchJobs(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/api/jobs?${qs}`);
  return res.json();
}

export async function fetchSkillGap(skills) {
  const res = await fetch(`${BASE}/api/jobs/skillgap?skills=${encodeURIComponent(skills.join(','))}`);
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

export async function fetchDeadlines() {
  const res = await fetch(`${BASE}/api/deadlines`);
  return res.json();
}
