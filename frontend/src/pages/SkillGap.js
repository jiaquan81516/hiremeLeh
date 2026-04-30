import { useState, useEffect } from 'react';
import { fetchSkillGap, fetchTopSkills } from '../api';
import { useCourse } from '../CourseContext';
import { COURSES } from '../courseConfig';

export default function SkillGap() {
  const { course } = useCourse();
  const [input, setInput] = useState('');
  const [mySkills, setMySkills] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState([]);

  const courseConfig = COURSES[course];

useEffect(() => {
  setMySkills([]);
  setResult(null);
  fetchTopSkills(course)
    .then(d => setSuggestedSkills(d.skills || []))
    .catch(() => setSuggestedSkills(courseConfig?.skills?.slice(0, 8) || []));
}, [course]);

  const addSkill = (val) => {
    const s = (val || input).trim().toLowerCase();
    if (!s || mySkills.includes(s)) { setInput(''); return; }
    const updated = [...mySkills, s];
    setMySkills(updated);
    setInput('');
    analyze(updated);
  };

  const removeSkill = (s) => {
    const updated = mySkills.filter(x => x !== s);
    setMySkills(updated);
    if (updated.length > 0) analyze(updated);
    else setResult(null);
  };

  const analyze = (skills) => {
    setLoading(true);
    fetchSkillGap(skills, course)
      .then(setResult)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const scoreColor = result
    ? result.score >= 70 ? '#3B6D11' : result.score >= 40 ? '#BA7517' : '#e24b4a'
    : '#1a1a1a';

  const scoreMsg = result
    ? result.score >= 70 ? 'Strong profile for this track!'
    : result.score >= 40 ? 'Good start — a few more skills will boost your match.'
    : 'Keep building — focus on the skills below.'
    : '';

  return (
    <div>
      <p className="section-sub">
        Analyzing skills for <strong>{courseConfig?.label}</strong>. Change your course using the selector at the top.
      </p>

      <div className="chip-input-row">
        <input
          type="text"
          placeholder={`Type a skill e.g. ${suggestedSkills[0] || 'Python'}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSkill()}
        />
        <button className="add-btn" onClick={() => addSkill()}>Add</button>
      </div>

      {suggestedSkills.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>Suggested for {courseConfig?.label}:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {suggestedSkills.filter(s => !mySkills.includes(s)).map(s => (
              <button
                key={s}
                onClick={() => addSkill(s)}
                style={{ fontSize: 12, padding: '3px 12px', borderRadius: 999, border: '1px dashed #ccc', background: 'transparent', color: '#666', cursor: 'pointer' }}
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {mySkills.length > 0 && (
        <div className="chip-list">
          {mySkills.map(s => (
            <div className="chip" key={s}>
              {s}
              <span className="chip-x" onClick={() => removeSkill(s)}>×</span>
            </div>
          ))}
        </div>
      )}

      {loading && <div className="loading">Analyzing your skills...</div>}

      {result && !loading && (
        <div className="two-col" style={{ marginTop: '1rem' }}>
          <div className="card">
            <div className="score-center">
              <div className="score-num" style={{ color: scoreColor }}>{result.score}%</div>
              <div className="score-label">match for {courseConfig?.label}</div>
              <div className="score-msg">{scoreMsg}</div>
            </div>
          </div>

          <div className="card">
            <h3>Skill breakdown</h3>
            {result.skills?.map(({ skill, pct, have }) => (
              <div className="gap-item" key={skill}>
                <div className={`gap-icon ${have ? 'gap-have' : 'gap-miss'}`}>
                  {have ? '✓' : '!'}
                </div>
                <div>
                  <div className="gap-text">{skill}</div>
                  <div className="gap-sub">
                    {have ? 'You have this · ' : 'Missing · '}
                    in {pct}% of {courseConfig?.label} postings
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mySkills.length === 0 && (
        <div style={{ marginTop: '2rem', padding: '2rem', background: '#f9f9f7', borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#aaa' }}>Add your skills above to see your match score</div>
          <div style={{ fontSize: 12, color: '#bbb', marginTop: 8 }}>
            Or click the suggested skills for {courseConfig?.label} above
          </div>
        </div>
      )}
    </div>
  );
}