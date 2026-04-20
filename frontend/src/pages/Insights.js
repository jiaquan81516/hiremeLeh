import { useEffect, useState } from 'react';
import { fetchInsights, submitInsight } from '../api';

const COMPANIES = ['GovTech', 'DBS Bank', 'Shopee', 'Sea Group', 'Grab', 'OCBC', 'Singtel', 'Circles.Life', 'Other'];
const ROLES = ['Software Engineering', 'Data Analytics', 'Full-stack', 'Backend', 'Frontend', 'DevOps', 'IT', 'Other'];
const UNIS = ['SMU', 'NUS', 'NTU', 'SIT', 'SUSS', 'Other'];
const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Fresh grad'];

export default function Insights() {
  const [tab, setTab] = useState('read');
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    company: '', role: '', salary: '', interviewFormat: '', advice: '', university: '', year: ''
  });

  useEffect(() => {
    fetchInsights()
      .then(setInsights)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.company || !form.role || !form.interviewFormat || !form.advice) {
      alert('Please fill in company, role, interview format, and advice.');
      return;
    }
    setSubmitting(true);
    try {
      const newInsight = await submitInsight(form);
      setInsights(prev => [newInsight, ...prev]);
      setSubmitted(true);
      setForm({ company: '', role: '', salary: '', interviewFormat: '', advice: '', university: '', year: '' });
      setTimeout(() => { setTab('read'); setSubmitted(false); }, 2000);
    } catch (e) {
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="tab-row">
        <button className={`tab-btn ${tab === 'read' ? 'active' : ''}`} onClick={() => setTab('read')}>
          Read insights
        </button>
        <button className={`tab-btn ${tab === 'share' ? 'active' : ''}`} onClick={() => setTab('share')}>
          Share yours
        </button>
      </div>

      {tab === 'read' && (
        <div>
          <p className="section-sub">Anonymous salary and interview insights from students like you.</p>
          {loading && <div className="loading">Loading insights...</div>}
          {!loading && insights.length === 0 && (
            <div className="empty">No insights yet — be the first to share!</div>
          )}
          {insights.map(ins => (
            <div className="insight-card" key={ins._id}>
              <div className="insight-top">
                <div>
                  <div className="insight-company">{ins.company}</div>
                  <div className="insight-meta">
                    {ins.role}
                    {ins.university && ` · ${ins.university}`}
                    {ins.year && ` ${ins.year}`}
                  </div>
                </div>
                {ins.salary && <div className="insight-salary">{ins.salary}</div>}
              </div>
              <div className="insight-label">Interview format</div>
              <div className="insight-text">{ins.interviewFormat}</div>
              <div className="insight-label">Advice</div>
              <div className="insight-text">{ins.advice}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'share' && (
        <div>
          <p className="section-sub">Help fellow students by sharing your experience. 100% anonymous.</p>
          {submitted && <div className="success-msg">Thanks! Your insight has been shared.</div>}
          <div className="card">
            <div className="form-group">
              <select name="company" value={form.company} onChange={handleChange}>
                <option value="">Select company *</option>
                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="">Select role type *</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <input
                type="text"
                name="salary"
                placeholder="Monthly salary e.g. $1,400/mo (optional)"
                value={form.salary}
                onChange={handleChange}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
              <select name="university" value={form.university} onChange={handleChange} style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #e8e8e4', fontSize: 13 }}>
                <option value="">University (optional)</option>
                {UNIS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <select name="year" value={form.year} onChange={handleChange} style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #e8e8e4', fontSize: 13 }}>
                <option value="">Year of study (optional)</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="form-group">
              <textarea
                name="interviewFormat"
                placeholder="Describe the interview format — how many rounds, what types of questions? *"
                value={form.interviewFormat}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="form-group">
              <textarea
                name="advice"
                placeholder="Any advice for other students applying to this company? *"
                value={form.advice}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit anonymously'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
