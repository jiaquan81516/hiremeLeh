import { useEffect, useState } from 'react';
import { fetchDeadlines } from '../api';

function daysUntil(date) {
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function urgencyClass(days) {
  if (days <= 14) return 'urgent';
  if (days <= 30) return 'soon';
  return 'ok';
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });
}

function initials(company) {
  return company.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
}

export default function Deadlines() {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeadlines()
      .then(setDeadlines)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading deadlines...</div>;
  if (error) return <div className="error">Could not load deadlines: {error}</div>;

  return (
    <div>
      <p className="section-sub">
        Key internship application windows for Singapore tech companies. Always verify on the company's careers page.
      </p>

      <div className="card">
        <h3>Upcoming deadlines</h3>
        {deadlines.length === 0 && (
          <div className="empty">No upcoming deadlines found.</div>
        )}
        {deadlines.map(d => {
          const days = daysUntil(d.deadline);
          const cls = urgencyClass(days);
          return (
            <div className="deadline-item" key={d._id}>
              <div className="deadline-logo">{initials(d.company)}</div>
              <div className="deadline-main">
                <div className="deadline-title">{d.company} — {d.role}</div>
                <div className="deadline-sub">{d.description}</div>
                {d.applyUrl && (
                  <a
                    href={d.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 11, color: '#185FA5', marginTop: 4, display: 'inline-block' }}
                  >
                    Apply →
                  </a>
                )}
              </div>
              <div className="deadline-right">
                <div className={`deadline-date ${cls}`}>{formatDate(d.deadline)}</div>
                <div className="deadline-days">{days}d left</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 11, color: '#bbb', marginTop: 8 }}>
        Dates are approximate — always verify on the company's official careers page before applying.
      </div>
    </div>
  );
}
