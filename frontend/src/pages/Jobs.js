import { useEffect, useState, useCallback } from 'react';
import { fetchJobs } from '../api';
import { useCourse } from '../CourseContext';
import { COURSES } from '../courseConfig';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'leastApplicants', label: 'Least applicants' },
  { value: 'salaryHigh', label: 'Salary: High to low' },
  { value: 'salaryLow', label: 'Salary: Low to high' },
  { value: 'closingSoon', label: 'Closing soon' },
];

const COMPANY_SIZES = [
  { value: '', label: 'Any company' },
  { value: 'government', label: '🏛 Government' },
  { value: 'mnc', label: '🌐 MNC' },
  { value: 'sme', label: '🏢 SME' },
  { value: 'startup', label: '🚀 Startup' },
];

const WORK_ARRANGEMENTS = [
  { value: '', label: 'Any arrangement' },
  { value: 'remote', label: '🏠 Remote' },
  { value: 'hybrid', label: '🔄 Hybrid' },
  { value: 'onsite', label: '🏢 On-site' },
];

function daysUntilClose(date) {
  if (!date) return null;
  const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

function timeAgo(date) {
  if (!date) return '';
  const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function Jobs() {
  const { course } = useCourse();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [internOnly, setInternOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [companySize, setCompanySize] = useState('');
  const [workArrangement, setWorkArrangement] = useState('');
  const [hiddenGems, setHiddenGems] = useState(false);
  const [closingSoon, setClosingSoon] = useState(false);
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [page, setPage] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    const params = { course, sortBy, page, limit: 15 };
    if (search) params.search = search;
    if (internOnly) params.internship = true;
    if (companySize) params.companySize = companySize;
    if (workArrangement) params.workArrangement = workArrangement;
    if (hiddenGems) params.hiddenGems = true;
    if (closingSoon) params.closingSoon = true;
    if (salaryMin) params.salaryMin = salaryMin;
    if (salaryMax) params.salaryMax = salaryMax;
    fetchJobs(params)
      .then(d => { setJobs(d.jobs || []); setTotal(d.total || 0); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, course, internOnly, sortBy, companySize, workArrangement, hiddenGems, closingSoon, salaryMin, salaryMax, page]);

  useEffect(() => { setPage(0); }, [course]);
  useEffect(() => { load(); }, [load]);

  const activeFilterCount = [internOnly, companySize, workArrangement, hiddenGems, closingSoon, salaryMin, salaryMax].filter(Boolean).length;

  return (
    <div>
      {/* Search + Sort row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder={`Search ${COURSES[course]?.label} roles...`}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          style={{ flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 8, border: '1px solid #e8e8e4', fontSize: 13 }}
        />
        <select
          value={sortBy}
          onChange={e => { setSortBy(e.target.value); setPage(0); }}
          style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #e8e8e4', fontSize: 13, background: '#fff' }}
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button
          onClick={() => setShowFilters(f => !f)}
          style={{
            padding: '9px 16px', borderRadius: 8, border: '1px solid #e8e8e4',
            background: showFilters ? '#1a1a1a' : '#fff',
            color: showFilters ? '#fff' : '#1a1a1a',
            fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div style={{ background: '#f9f9f7', borderRadius: 12, padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Quick toggles */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: '💼 Internships only', value: internOnly, set: setInternOnly },
              { label: '💎 Hidden gems', value: hiddenGems, set: setHiddenGems },
              { label: '⏰ Closing soon', value: closingSoon, set: setClosingSoon },
            ].map(({ label, value, set }) => (
              <button
                key={label}
                onClick={() => { set(v => !v); setPage(0); }}
                style={{
                  padding: '6px 14px', borderRadius: 999, border: '1px solid #e8e8e4',
                  background: value ? '#1a1a1a' : '#fff',
                  color: value ? '#fff' : '#666',
                  fontSize: 12, cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Dropdowns row */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <select
              value={companySize}
              onChange={e => { setCompanySize(e.target.value); setPage(0); }}
              style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e8e8e4', fontSize: 13, background: '#fff' }}
            >
              {COMPANY_SIZES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select
              value={workArrangement}
              onChange={e => { setWorkArrangement(e.target.value); setPage(0); }}
              style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e8e8e4', fontSize: 13, background: '#fff' }}
            >
              {WORK_ARRANGEMENTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Salary range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>Salary range:</span>
            <input
              type="number"
              placeholder="Min $"
              value={salaryMin}
              onChange={e => { setSalaryMin(e.target.value); setPage(0); }}
              style={{ width: 90, padding: '6px 10px', borderRadius: 8, border: '1px solid #e8e8e4', fontSize: 13 }}
            />
            <span style={{ fontSize: 12, color: '#aaa' }}>to</span>
            <input
              type="number"
              placeholder="Max $"
              value={salaryMax}
              onChange={e => { setSalaryMax(e.target.value); setPage(0); }}
              style={{ width: 90, padding: '6px 10px', borderRadius: 8, border: '1px solid #e8e8e4', fontSize: 13 }}
            />
            {(salaryMin || salaryMax) && (
              <button onClick={() => { setSalaryMin(''); setSalaryMax(''); }} style={{ fontSize: 12, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
            )}
          </div>

          {/* Hidden gems explanation */}
          {hiddenGems && (
            <div style={{ fontSize: 12, color: '#888', background: '#fff', padding: '8px 12px', borderRadius: 8, border: '1px solid #e8e8e4' }}>
              💎 Hidden gems = posted in the last 48hrs with fewer than 10 applicants. Apply fast for the best chance!
            </div>
          )}
        </div>
      )}

      <div style={{ fontSize: 12, color: '#aaa', marginBottom: '1rem' }}>
        {total} roles · <strong>{COURSES[course]?.label}</strong>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading jobs...</div>}

      {!loading && (
        <div className="job-list">
          {jobs.length === 0 && (
            <div className="empty">
              No jobs found. Try switching to "All Courses" or adjusting your filters.
            </div>
          )}
          {jobs.map(job => {
            const daysLeft = daysUntilClose(job.closingAt);
            const isUrgent = daysLeft !== null && daysLeft <= 7;
            const isNew = job.postedAt && (new Date() - new Date(job.postedAt)) < 48 * 60 * 60 * 1000;
            const isHidden = isNew && job.applicationCount < 10;

            return (
              <div className="job-card" key={job._id}>
                <div className="job-top">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                      <div className="job-title">{job.title}</div>
                      {isHidden && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 999, background: '#EEEDFE', color: '#533AB7', fontWeight: 700 }}>💎 Hidden gem</span>}
                      {isUrgent && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 999, background: '#FCEBEB', color: '#A32D2D', fontWeight: 700 }}>⏰ {daysLeft}d left</span>}
                      {isNew && !isHidden && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 999, background: '#EAF3DE', color: '#3B6D11', fontWeight: 700 }}>New</span>}
                    </div>
                    <div className="job-company">{job.company}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div className="job-salary">{job.salary?.display || 'Not stated'}</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{timeAgo(job.postedAt)}</div>
                  </div>
                </div>

                {/* Tags row */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {job.companySize && job.companySize !== 'unknown' && (
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#f0f0ee', color: '#666', border: '1px solid #e8e8e4' }}>
                      {job.companySize === 'government' ? '🏛' : job.companySize === 'mnc' ? '🌐' : job.companySize === 'startup' ? '🚀' : '🏢'} {job.companySize}
                    </span>
                  )}
                  {job.workArrangement && job.workArrangement !== 'onsite' && (
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#f0f0ee', color: '#666', border: '1px solid #e8e8e4' }}>
                      {job.workArrangement === 'remote' ? '🏠 Remote' : '🔄 Hybrid'}
                    </span>
                  )}
                  {job.applicationCount > 0 && (
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#f0f0ee', color: '#666', border: '1px solid #e8e8e4' }}>
                      {job.applicationCount} applicants
                    </span>
                  )}
                  {job.skills.slice(0, 4).map(s => <span className="tag" key={s}>{s}</span>)}
                </div>

                <div style={{ marginTop: 10 }}>
                  <a className="apply-btn" href={job.url} target="_blank" rel="noopener noreferrer">
                    View on MyCareersFuture →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {total > 15 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1.5rem' }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #e8e8e4', background: '#fff', fontSize: 13, opacity: page === 0 ? 0.4 : 1 }}>
            Previous
          </button>
          <span style={{ fontSize: 13, color: '#888', padding: '7px 8px' }}>Page {page + 1} of {Math.ceil(total / 15)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * 15 >= total}
            style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #e8e8e4', background: '#fff', fontSize: 13, opacity: (page + 1) * 15 >= total ? 0.4 : 1 }}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}