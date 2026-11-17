import { useEffect, useState } from 'react';
import { fetchInsights, submitInsight } from '../api';

const COMPANIES = [
  'GovTech',
  'DBS Bank',
  'Shopee',
  'Sea Group',
  'Grab',
  'OCBC',
  'Singtel',
  'Circles.Life',
  'Other',
];
const ROLES = [
  'Software Engineering',
  'Data Analytics',
  'Full-stack',
  'Backend',
  'Frontend',
  'DevOps',
  'IT',
  'Other',
];
const UNIS = ['SMU', 'NUS', 'NTU', 'SIT', 'SUSS', 'Other'];
const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Fresh grad'];
const EMPTY = {
  company: '',
  role: '',
  salary: '',
  interviewFormat: '',
  advice: '',
  university: '',
  year: '',
};

export default function Insights() {
  const [tab, setTab] = useState('read');
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    fetchInsights()
      .then((d) => setInsights(Array.isArray(d) ? d : []))
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.company || !form.role || !form.interviewFormat || !form.advice) {
      setFormError('Please fill in company, role, interview format and advice.');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      const newInsight = await submitInsight(form);
      setInsights((prev) => [newInsight, ...prev]);
      setSubmitted(true);
      setForm(EMPTY);
      setTimeout(() => {
        setTab('read');
        setSubmitted(false);
      }, 2000);
    } catch (e) {
      setFormError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Peer insights</h1>
      <p className="page-sub">
        Real pay and interview formats from students who went through it. Anonymous and honest.
      </p>

      <div className="segment" role="tablist">
        <button
          className={tab === 'read' ? 'on' : ''}
          onClick={() => setTab('read')}
          role="tab"
          aria-selected={tab === 'read'}
        >
          Read insights
        </button>
        <button
          className={tab === 'share' ? 'on' : ''}
          onClick={() => setTab('share')}
          role="tab"
          aria-selected={tab === 'share'}
        >
          Share yours
        </button>
      </div>

      {tab === 'read' && (
        <div>
          {loading && (
            <div className="skel" style={{ height: 180, borderRadius: 16 }} aria-busy="true" />
          )}
          {loadError && (
            <div className="error">
              Could not load insights. The free server may be waking up, try again in a bit.
            </div>
          )}
          {!loading && !loadError && insights.length === 0 && (
            <div className="empty">
              <strong>No insights yet</strong>Be the first to share, it takes 2 minutes.
            </div>
          )}
          <div className="notes">
            {insights.map((ins) => (
              <article className="note" key={ins._id || `${ins.company}-${ins.advice}`}>
                <div className="note-top">
                  <div>
                    <div className="note-co">{ins.company}</div>
                    <div className="note-meta">
                      {ins.role}
                      {ins.university && ` · ${ins.university}`}
                      {ins.year && ` ${ins.year}`}
                    </div>
                  </div>
                  {ins.salary && <div className="note-pay">{ins.salary}</div>}
                </div>
                <h5>Interview format</h5>
                <p>{ins.interviewFormat}</p>
                <h5>Advice</h5>
                <p>{ins.advice}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'share' && (
        <div className="card" style={{ maxWidth: 600 }}>
          {submitted && <div className="ok">Thanks! Your insight is up.</div>}
          {formError && <div className="error">{formError}</div>}
          <div className="form">
            <div className="field">
              <select
                name="company"
                value={form.company}
                onChange={handleChange}
                aria-label="Company"
              >
                <option value="">Company *</option>
                {COMPANIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <select name="role" value={form.role} onChange={handleChange} aria-label="Role type">
                <option value="">Role type *</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <input
                type="text"
                name="salary"
                placeholder="Monthly pay, e.g. $1,400/mo (optional)"
                value={form.salary}
                onChange={handleChange}
              />
            </div>
            <div className="field-2 field">
              <select
                name="university"
                value={form.university}
                onChange={handleChange}
                aria-label="University"
              >
                <option value="">University (optional)</option>
                {UNIS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                aria-label="Year of study"
              >
                <option value="">Year (optional)</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <textarea
                name="interviewFormat"
                rows={3}
                value={form.interviewFormat}
                onChange={handleChange}
                placeholder="How was the interview? How many rounds, what kind of questions? *"
              />
            </div>
            <div className="field">
              <textarea
                name="advice"
                rows={3}
                value={form.advice}
                onChange={handleChange}
                placeholder="Any advice for the next student applying? *"
              />
            </div>
            <button className="btn brand" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit anonymously'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
