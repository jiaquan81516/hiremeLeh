import { useEffect, useState, useCallback } from 'react';
import { fetchJobs } from '../api';
import { useCourse } from '../CourseContext';
import { COURSES } from '../courseConfig';

export default function Jobs() {
  const { course } = useCourse();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [internOnly, setInternOnly] = useState(false);
  const [page, setPage] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    fetchJobs({ search, course, internship: internOnly || undefined, page, limit: 15 })
      .then(d => { setJobs(d.jobs || []); setTotal(d.total || 0); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, course, internOnly, page]);

  useEffect(() => { setPage(0); }, [course]);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search ${COURSES[course]?.label} roles, skills, companies...`}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666', whiteSpace: 'nowrap', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={internOnly}
            onChange={e => { setInternOnly(e.target.checked); setPage(0); }}
          />
          Internships only
        </label>
      </div>

      <div style={{ fontSize: 12, color: '#aaa', marginBottom: '1rem' }}>
        {total} roles found for <strong>{COURSES[course]?.label}</strong>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading jobs...</div>}

      {!loading && (
        <div className="job-list">
          {jobs.length === 0 && (
            <div className="empty">
              No jobs found for {COURSES[course]?.label}. Try switching to "All Courses" or a different search.
            </div>
          )}
          {jobs.map(job => (
            <div className="job-card" key={job._id}>
              <div className="job-top">
                <div>
                  <div className="job-title">{job.title}</div>
                  <div className="job-company">{job.company}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="job-salary">{job.salary?.display || 'Not stated'}</div>
                  {job.isInternship && (
                    <span style={{ fontSize: 11, color: '#185FA5', fontWeight: 600 }}>Internship</span>
                  )}
                </div>
              </div>
              <div className="job-tags">
                {job.skills.slice(0, 6).map(s => <span className="tag" key={s}>{s}</span>)}
              </div>
              <div style={{ marginTop: 10 }}>
                <a className="apply-btn" href={job.url} target="_blank" rel="noopener noreferrer">
                  View on MyCareersFuture →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > 15 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1.5rem' }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #e8e8e4', background: '#fff', fontSize: 13, opacity: page === 0 ? 0.4 : 1 }}
          >
            Previous
          </button>
          <span style={{ fontSize: 13, color: '#888', padding: '7px 8px' }}>
            Page {page + 1} of {Math.ceil(total / 15)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * 15 >= total}
            style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #e8e8e4', background: '#fff', fontSize: 13, opacity: (page + 1) * 15 >= total ? 0.4 : 1 }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
