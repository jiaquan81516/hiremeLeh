import { useState, useEffect } from 'react';
import { fetchSkillGap, fetchTopSkills } from '../api';
import { useCourse } from '../CourseContext';
import { COURSES } from '../courseConfig';

const R = 80;
const CIRC = 2 * Math.PI * R;

function Ring({ score }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  const colour = score >= 70 ? 'var(--green)' : score >= 40 ? 'var(--gold)' : 'var(--brand)';
  return (
    <div className="ring" role="img" aria-label={`${score} percent match`}>
      <svg viewBox="0 0 190 190">
        <circle className="bg" cx="95" cy="95" r={R} />
        <circle
          className="fg"
          cx="95"
          cy="95"
          r={R}
          stroke={colour}
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - shown / 100)}
        />
      </svg>
      <div className="ring-num">
        <span>
          {score}
          <small>%</small>
        </span>
      </div>
    </div>
  );
}

export default function SkillGap() {
  const { course } = useCourse();
  const [input, setInput] = useState('');
  const [mySkills, setMySkills] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState([]);

  const courseConfig = COURSES[course];
  const labelFor = (s) => courseConfig?.skillLabels?.[s] || s;

  useEffect(() => {
    setMySkills([]);
    setResult(null);
    fetchTopSkills(course)
      .then((d) => setSuggestedSkills(d.skills || []))
      .catch(() => setSuggestedSkills(courseConfig?.skills?.slice(0, 8) || []));
  }, [course]);

  const analyze = (skills) => {
    setLoading(true);
    fetchSkillGap(skills, course)
      .then(setResult)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const addSkill = (val) => {
    const s = (val || input).trim().toLowerCase();
    if (!s || mySkills.includes(s)) {
      setInput('');
      return;
    }
    const updated = [...mySkills, s];
    setMySkills(updated);
    setInput('');
    analyze(updated);
  };

  const removeSkill = (s) => {
    const updated = mySkills.filter((x) => x !== s);
    setMySkills(updated);
    if (updated.length > 0) analyze(updated);
    else setResult(null);
  };

  const scoreMsg = result
    ? result.score >= 70
      ? 'Steady lah, strong profile for this track.'
      : result.score >= 40
        ? 'Good start. A few more skills will boost your match.'
        : 'Keep building. Start with the skills below.'
    : '';

  const missing = (result?.skills || []).filter((s) => !s.have);
  const nextUp = missing.length ? [...missing].sort((a, b) => b.pct - a.pct)[0] : null;
  const ordered = result
    ? [...result.skills].sort((a, b) => Number(a.have) - Number(b.have) || b.pct - a.pct)
    : [];

  return (
    <div>
      <h1 className="page-title">Skill gap</h1>
      <p className="page-sub">
        Add what you already know and see how you stack up against real{' '}
        <strong>{courseConfig?.label}</strong> postings. Change course using the selector at the
        top.
      </p>

      <div className="skill-form">
        <input
          type="text"
          placeholder={`Type a skill, e.g. ${suggestedSkills[0] || 'python'}`}
          aria-label="Add a skill"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSkill()}
        />
        <button className="btn" onClick={() => addSkill()}>
          Add
        </button>
      </div>

      {suggestedSkills.filter((s) => !mySkills.includes(s)).length > 0 && (
        <>
          <div className="sug-label">Hot in {courseConfig?.label}. Tap what you already have:</div>
          <div className="sug-row">
            {suggestedSkills
              .filter((s) => !mySkills.includes(s))
              .map((s) => (
                <button key={s} className="sug" onClick={() => addSkill(s)}>
                  + {labelFor(s)}
                </button>
              ))}
          </div>
        </>
      )}

      {mySkills.length > 0 && (
        <div className="mine">
          {mySkills.map((s) => (
            <button
              key={s}
              className="fchip"
              onClick={() => removeSkill(s)}
              aria-label={`Remove ${s}`}
            >
              {labelFor(s)}
              <i>×</i>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="skel" style={{ height: 240, borderRadius: 14 }} aria-busy="true" />
      )}

      {result && !loading && (
        <div className="gap-grid">
          <div className="card ring-card">
            <Ring key={`${course}-${result.score}`} score={result.score} />
            <div className="ring-cap">match for {courseConfig?.label}</div>
            <div className="ring-msg">{scoreMsg}</div>
            {nextUp && (
              <div className="next-up">
                <small>Learn this next</small>
                <b>{labelFor(nextUp.skill)}</b>
                <span>asked for in {nextUp.pct}% of postings</span>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Your breakdown</h3>
            {ordered.map(({ skill, pct, have }) => (
              <div className="gap-row" key={skill}>
                <div className={`gap-mark ${have ? 'have' : 'miss'}`}>{have ? '✓' : '!'}</div>
                <div>
                  <div className="gap-name">{labelFor(skill)}</div>
                  <div className="gap-sub">{have ? 'You have this' : 'Missing'}</div>
                </div>
                <div className="gap-pct">{pct}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mySkills.length === 0 && (
        <div className="empty">
          <strong>Nothing added yet</strong>
          Add a skill above, or tap the suggestions, to see your match score.
        </div>
      )}
    </div>
  );
}
