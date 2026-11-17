import { useEffect, useState, useCallback } from 'react';
import { fetchJobs } from '../api';
import { useCourse } from '../CourseContext';
import { COURSES } from '../courseConfig';

const PAGE_SIZE = 15;
const SAVED_KEY = 'hiremeLeh_saved';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'leastApplicants', label: 'Least applicants' },
  { value: 'salaryHigh', label: 'Salary: high to low' },
  { value: 'salaryLow', label: 'Salary: low to high' },
  { value: 'closingSoon', label: 'Closing soon' },
];

const COMPANY_SIZES = [
  { value: 'government', label: 'Government' },
  { value: 'mnc', label: 'MNC' },
  { value: 'sme', label: 'SME' },
  { value: 'startup', label: 'Startup' },
];

const WORK_ARRANGEMENTS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
];

const SIZE_LABEL = { government: 'Government', mnc: 'MNC', sme: 'SME', startup: 'Startup' };

const TILE_COLOURS = ['#d90f29', '#005ec4', '#0a8f4e', '#7a2fb5', '#c96a00', '#10141f', '#0b7c8a'];

function tileColour(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TILE_COLOURS[h % TILE_COLOURS.length];
}

function daysUntilClose(date) {
  if (!date) return null;
  const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

function timeAgo(date) {
  if (!date) return '';
  const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Posted today';
  if (days === 1) return 'Posted yesterday';
  if (days < 7) return `Posted ${days}d ago`;
  if (days < 30) return `Posted ${Math.floor(days / 7)}w ago`;
  return `Posted ${Math.floor(days / 30)}mo ago`;
}

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || {};
  } catch {
    return {};
  }
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3h12v18l-6-4.5L6 21z" />
    </svg>
  );
}

function JobCard({ job, saved, onToggle }) {
  const daysLeft = daysUntilClose(job.closingAt);
  const isUrgent = daysLeft !== null && daysLeft <= 7;
  const isNew = job.postedAt && new Date() - new Date(job.postedAt) < 48 * 60 * 60 * 1000;
  const isHidden = isNew && job.applicationCount < 10;
  const stated = job.salary?.display && job.salary.display !== 'Not stated';
  const kind = isHidden ? 'gem' : isUrgent ? 'urgent' : isNew ? 'fresh' : '';

  return (
    <article className={`job ${kind}`}>
      <div className="job-head">
        <div className="tile" style={{ background: tileColour(job.company) }} aria-hidden="true">
          {(job.company || '?').trim().charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="job-title">{job.title}</h3>
          <div className="job-company">{job.company}</div>
        </div>
        <div className="job-pay">
          <div className={`job-salary ${stated ? '' : 'none'}`}>
            {stated ? job.salary.display : 'Salary not stated'}
          </div>
          {stated && <div className="job-per">per month</div>}
        </div>
      </div>

      {(isHidden || isUrgent || (isNew && !isHidden)) && (
        <div className="ribbons">
          {isHidden && <span className="ribbon gem">Hidden gem</span>}
          {isUrgent && <span className="ribbon urgent">Closes in {daysLeft}d</span>}
          {isNew && !isHidden && <span className="ribbon fresh">New</span>}
        </div>
      )}

      <div className="facts">
        <span>{timeAgo(job.postedAt)}</span>
        {job.applicationCount > 0 && (
          <span>
            <b>{job.applicationCount}</b> applicants
          </span>
        )}
        {job.companySize && job.companySize !== 'unknown' && (
          <span>{SIZE_LABEL[job.companySize] || job.companySize}</span>
        )}
        {job.workArrangement && job.workArrangement !== 'onsite' && (
          <span style={{ textTransform: 'capitalize' }}>{job.workArrangement}</span>
        )}
      </div>

      {job.skills?.length > 0 && (
        <div className="skills">
          {job.skills.slice(0, 4).map((s) => (
            <span className="skill-tag" key={s}>
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="job-foot">
        <a className="btn" href={job.url} target="_blank" rel="noopener noreferrer">
          View on MyCareersFuture
        </a>
        <button
          className={`save ${saved ? 'on' : ''}`}
          onClick={() => onToggle(job)}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from saved' : 'Save this job'}
          title={saved ? 'Saved' : 'Save for later'}
        >
          <BookmarkIcon />
        </button>
      </div>
    </article>
  );
}

export default function Jobs() {
  const { course } = useCourse();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(readSaved);
  const [showSaved, setShowSaved] = useState(false);

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
    setError(null);
    const params = { course, sortBy, page, limit: PAGE_SIZE };
    if (search) params.search = search;
    if (internOnly) params.internship = true;
    if (companySize) params.companySize = companySize;
    if (workArrangement) params.workArrangement = workArrangement;
    if (hiddenGems) params.hiddenGems = true;
    if (closingSoon) params.closingSoon = true;
    if (salaryMin) params.salaryMin = salaryMin;
    if (salaryMax) params.salaryMax = salaryMax;
    fetchJobs(params)
      .then((d) => {
        setJobs(d.jobs || []);
        setTotal(d.total || 0);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [
    search,
    course,
    internOnly,
    sortBy,
    companySize,
    workArrangement,
    hiddenGems,
    closingSoon,
    salaryMin,
    salaryMax,
    page,
  ]);

  useEffect(() => {
    setPage(0);
  }, [course]);
  useEffect(() => {
    load();
  }, [load]);

  const toggleSaved = (job) => {
    setSaved((prev) => {
      const next = { ...prev };
      if (next[job._id]) delete next[job._id];
      else next[job._id] = { ...job, savedAt: Date.now() };
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const savedList = Object.values(saved).sort((a, b) => b.savedAt - a.savedAt);
  const savedCount = savedList.length;

  const reset = () => setPage(0);
  const chips = [];
  if (internOnly)
    chips.push({ key: 'intern', label: 'Internships', clear: () => setInternOnly(false) });
  if (hiddenGems)
    chips.push({ key: 'gems', label: 'Hidden gems', clear: () => setHiddenGems(false) });
  if (closingSoon)
    chips.push({ key: 'closing', label: 'Closing soon', clear: () => setClosingSoon(false) });
  if (companySize)
    chips.push({
      key: 'size',
      label: COMPANY_SIZES.find((c) => c.value === companySize)?.label,
      clear: () => setCompanySize(''),
    });
  if (workArrangement)
    chips.push({
      key: 'work',
      label: WORK_ARRANGEMENTS.find((c) => c.value === workArrangement)?.label,
      clear: () => setWorkArrangement(''),
    });
  if (salaryMin || salaryMax) {
    chips.push({
      key: 'sal',
      label: `$${salaryMin || 0} to ${salaryMax ? '$' + salaryMax : 'any'}`,
      clear: () => {
        setSalaryMin('');
        setSalaryMax('');
      },
    });
  }

  const clearAll = () => {
    setInternOnly(false);
    setHiddenGems(false);
    setClosingSoon(false);
    setCompanySize('');
    setWorkArrangement('');
    setSalaryMin('');
    setSalaryMax('');
    setSearch('');
    reset();
  };

  const goPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0 });
  };

  const visible = showSaved ? savedList : jobs;
  const courseLabel = COURSES[course]?.label;

  return (
    <div>
      <h1 className="page-title">Jobs for {courseLabel}</h1>
      <p className="page-sub">
        Pulled live from MyCareersFuture. Save the ones you like, they stay on this device.
      </p>

      <div className="fbar">
        <div className="fbar-row">
          <input
            className="search"
            type="search"
            placeholder={`Search ${courseLabel} roles`}
            aria-label="Search roles"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              reset();
            }}
          />
          <select
            className="sort-select"
            aria-label="Sort by"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              reset();
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            className={`pill-btn ${open ? 'on' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            Filters{chips.length > 0 && <span className="count">{chips.length}</span>}
          </button>
          <button
            className={`pill-btn ${showSaved ? 'on' : ''}`}
            onClick={() => setShowSaved((s) => !s)}
            aria-pressed={showSaved}
          >
            Saved{savedCount > 0 && <span className="count">{savedCount}</span>}
          </button>
        </div>

        {chips.length > 0 && (
          <div className="chips">
            {chips.map((c) => (
              <button
                key={c.key}
                className="fchip"
                onClick={() => {
                  c.clear();
                  reset();
                }}
                aria-label={`Remove filter ${c.label}`}
              >
                {c.label}
                <i>×</i>
              </button>
            ))}
            <button className="clear-all" onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}

        {open && (
          <>
            <div className="scrim" onClick={() => setOpen(false)} />
            <div className="sheet" role="dialog" aria-label="Filters">
              <div className="sheet-head">
                <span>Filters</span>
                <button onClick={() => setOpen(false)} aria-label="Close filters">
                  ×
                </button>
              </div>

              <div>
                <h4>Quick picks</h4>
                <div className="seg">
                  <button
                    className={internOnly ? 'on' : ''}
                    onClick={() => {
                      setInternOnly((v) => !v);
                      reset();
                    }}
                  >
                    Internships only
                  </button>
                  <button
                    className={hiddenGems ? 'on' : ''}
                    onClick={() => {
                      setHiddenGems((v) => !v);
                      reset();
                    }}
                  >
                    Hidden gems
                  </button>
                  <button
                    className={closingSoon ? 'on' : ''}
                    onClick={() => {
                      setClosingSoon((v) => !v);
                      reset();
                    }}
                  >
                    Closing soon
                  </button>
                </div>
                {hiddenGems && (
                  <p className="gem-note" style={{ marginTop: 10 }}>
                    Hidden gem = posted in the last 48 hours with fewer than 10 applicants. Apply
                    fast!
                  </p>
                )}
              </div>

              <div>
                <h4>Company type</h4>
                <div className="seg">
                  {COMPANY_SIZES.map((o) => (
                    <button
                      key={o.value}
                      className={companySize === o.value ? 'on' : ''}
                      onClick={() => {
                        setCompanySize((v) => (v === o.value ? '' : o.value));
                        reset();
                      }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4>Work arrangement</h4>
                <div className="seg">
                  {WORK_ARRANGEMENTS.map((o) => (
                    <button
                      key={o.value}
                      className={workArrangement === o.value ? 'on' : ''}
                      onClick={() => {
                        setWorkArrangement((v) => (v === o.value ? '' : o.value));
                        reset();
                      }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4>Monthly salary</h4>
                <div className="salary-row">
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Min $"
                    aria-label="Minimum salary"
                    value={salaryMin}
                    onChange={(e) => {
                      setSalaryMin(e.target.value);
                      reset();
                    }}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Max $"
                    aria-label="Maximum salary"
                    value={salaryMax}
                    onChange={(e) => {
                      setSalaryMax(e.target.value);
                      reset();
                    }}
                  />
                </div>
              </div>

              <div className="sheet-foot">
                <button className="clear-all" onClick={clearAll}>
                  Clear all
                </button>
                <button className="btn brand" onClick={() => setOpen(false)}>
                  Show {showSaved ? savedCount : total} roles
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="result-count">
        {showSaved ? (
          <>
            <strong>{savedCount}</strong> saved {savedCount === 1 ? 'job' : 'jobs'}
          </>
        ) : (
          <>
            <strong>{total.toLocaleString()}</strong> roles for {courseLabel}
          </>
        )}
      </div>

      {error && !showSaved && (
        <div className="error">
          Could not load jobs ({error}). The free server may be waking up.
          <button onClick={load}>Try again</button>
        </div>
      )}

      {loading && !showSaved && (
        <div className="job-list" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skel job-skel" />
          ))}
        </div>
      )}

      {(!loading || showSaved) && (
        <div className="job-list">
          {visible.length === 0 && !error && (
            <div className="empty">
              <strong>{showSaved ? 'Nothing saved yet' : 'Aiya, nothing here'}</strong>
              {showSaved
                ? 'Tap the bookmark on any job and it will show up here.'
                : 'Try loosening your filters, or switch to All Courses.'}
            </div>
          )}
          {visible.map((job) => (
            <JobCard key={job._id} job={job} saved={!!saved[job._id]} onToggle={toggleSaved} />
          ))}
        </div>
      )}

      {!showSaved && total > PAGE_SIZE && (
        <div className="pager">
          <button
            className="btn ghost"
            onClick={() => goPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}
          </span>
          <button
            className="btn ghost"
            onClick={() => goPage(page + 1)}
            disabled={(page + 1) * PAGE_SIZE >= total}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
