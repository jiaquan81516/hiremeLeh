import { useEffect, useState } from 'react';
import { fetchTrends } from '../api';
import { useCourse } from '../CourseContext';
import { COURSES } from '../courseConfig';

export default function Trends() {
  const { course } = useCourse();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTrends(course)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [course]);

  if (loading) return <div className="loading">Loading trends for {COURSES[course]?.label}...</div>;
  if (error) return <div className="error">Could not load trends: {error}</div>;
  if (!data) return null;

  const maxSkill = data.topSkills?.[0]?.count || 1;
  const maxCompany = data.topCompanies?.[0]?.count || 1;

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: '#888' }}>Showing data for</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{COURSES[course]?.label}</span>
      </div>

      <div className="metric-grid">
        <div className="metric">
          <div className="metric-label">Live postings</div>
          <div className="metric-value">{data.totalJobs?.toLocaleString()}</div>
          <div className="metric-sub">roles in SG</div>
        </div>
        <div className="metric">
          <div className="metric-label">Avg entry salary</div>
          <div className="metric-value">${data.avgSalary?.toLocaleString() || '—'}</div>
          <div className="metric-sub">per month</div>
        </div>
        <div className="metric">
          <div className="metric-label">Hottest skill</div>
          <div className="metric-value" style={{ fontSize: 16 }}>{data.topSkills?.[0]?.skill || '—'}</div>
          <div className="metric-sub">most in-demand</div>
        </div>
        <div className="metric">
          <div className="metric-label">Internships</div>
          <div className="metric-value">{data.internships}</div>
          <div className="metric-sub">open right now</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>Most in-demand skills</h3>
          {data.topSkills?.length === 0 && <div className="empty">No skill data yet for this track.</div>}
          {data.topSkills?.map(({ skill, count, pct }) => (
            <div className="skill-bar-row" key={skill}>
              <span className="skill-name">{skill}</span>
              <div className="bar-track">
                <div
                  className={`bar-fill ${pct > 70 ? 'hot' : pct > 50 ? 'warm' : ''}`}
                  style={{ width: `${Math.round((count / maxSkill) * 100)}%` }}
                />
              </div>
              <span className="skill-pct">{pct}%</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Top hiring companies</h3>
          {data.topCompanies?.length === 0 && <div className="empty">No company data yet for this track.</div>}
          {data.topCompanies?.map(({ company, count }) => (
            <div className="skill-bar-row" key={company}>
              <span className="skill-name">{company}</span>
              <div className="bar-track">
                <div
                  className={`bar-fill ${count === maxCompany ? 'hot' : count > maxCompany * 0.6 ? 'warm' : ''}`}
                  style={{ width: `${Math.round((count / maxCompany) * 100)}%` }}
                />
              </div>
              <span className="skill-pct">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
