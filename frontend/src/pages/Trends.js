import { useEffect, useState } from 'react';
import { fetchTrends } from '../api';
import { useCourse } from '../CourseContext';
import { COURSES } from '../courseConfig';

function BarRows({ rows, hotAt }) {
  const max = rows[0]?.value || 1;
  return rows.map((r, i) => {
    const level = hotAt(r, max);
    return (
      <div className="bar-row" key={r.name}>
        <span className="bar-rank">{i + 1}</span>
        <span className="bar-name" title={r.name}>
          {r.name}
        </span>
        <div className="bar-track">
          <div
            className={`bar-fill ${level}`}
            style={{
              width: `${Math.max(3, Math.round((r.value / max) * 100))}%`,
              animationDelay: `${i * 40}ms`,
            }}
          />
        </div>
        <span className="bar-val">{r.label}</span>
      </div>
    );
  });
}

export default function Trends({ goTo }) {
  const { course, setCourse } = useCourse();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTrends(course)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [course]);

  const label = COURSES[course]?.label;
  const skillRows = (data?.topSkills || []).map((s) => ({
    name: s.skill,
    value: s.count,
    pct: s.pct,
    label: `${s.pct}%`,
  }));
  const companyRows = (data?.topCompanies || []).map((c) => ({
    name: c.company,
    value: c.count,
    label: String(c.count),
  }));

  return (
    <div>
      <section className="hero">
        <div className="hero-kicker">Singapore internships, no need to scroll 10 sites</div>
        <div className="hero-num">
          {loading || !data ? <span className="skel" /> : data.totalJobs?.toLocaleString()}
        </div>
        <div className="hero-line">
          roles open for {label} students right now. Refreshed every 6 hours.
        </div>
        <div className="hero-picker-label">Which course are you?</div>
        <div className="hero-picker" role="group" aria-label="Choose your course">
          {Object.entries(COURSES).map(([key, val]) => (
            <button
              key={key}
              className={`pick ${course === key ? 'on' : ''}`}
              onClick={() => setCourse(key)}
            >
              {val.label}
            </button>
          ))}
        </div>
        <div className="hero-cta">
          <button className="btn" onClick={() => goTo && goTo('jobs')}>
            See the jobs
          </button>
          <button className="btn ghost" onClick={() => goTo && goTo('gap')}>
            Check my skill gap
          </button>
        </div>
      </section>

      {error && (
        <div className="error">
          Could not load trends ({error}). The free server may be waking up, give it about 30
          seconds.
        </div>
      )}

      {data && !error && (
        <>
          <div className="stats">
            <div className="stat">
              <div className="stat-label">Avg entry salary</div>
              <div className="stat-value">
                {data.avgSalary ? `$${data.avgSalary.toLocaleString()}` : '—'}
              </div>
              <div className="stat-sub">per month, excluding internships</div>
            </div>
            <div className="stat">
              <div className="stat-label">Internships</div>
              <div className="stat-value">
                {data.internships?.toLocaleString?.() ?? data.internships}
              </div>
              <div className="stat-sub">open right now</div>
            </div>
            <div className="stat">
              <div className="stat-label">Hottest skill</div>
              <div className="stat-value" style={{ textTransform: 'capitalize' }}>
                {data.topSkills?.[0]?.skill || '—'}
              </div>
              <div className="stat-sub">asked for the most</div>
            </div>
          </div>

          <div className="two-col" key={course}>
            <div className="card">
              <h3>What employers keep asking for</h3>
              {skillRows.length === 0 && (
                <div className="empty">No skill data for this track yet.</div>
              )}
              <BarRows
                rows={skillRows}
                hotAt={(r) => (r.pct > 70 ? 'hot' : r.pct > 50 ? 'warm' : '')}
              />
            </div>
            <div className="card">
              <h3>Who is hiring the most</h3>
              {companyRows.length === 0 && (
                <div className="empty">No company data for this track yet.</div>
              )}
              <BarRows
                rows={companyRows}
                hotAt={(r, max) => (r.value === max ? 'hot' : r.value > max * 0.6 ? 'warm' : '')}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
