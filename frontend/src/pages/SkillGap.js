import { useState } from 'react';
import { fetchSkillGap } from '../api';

export default function SkillGap() {
  const [input, setInput] = useState('');
  const [mySkills, setMySkills] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    const val = input.trim().toLowerCase();
    if (!val || mySkills.includes(val)) { setInput(''); return; }
    const updated = [...mySkills, val];
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
    fetchSkillGap(skills)
      .then(setResult)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const scoreColor = result
    ? result.score >= 70 ? '#3B6D11' : result.score >= 40 ? '#BA7517' : '#e24b4a'
    : '#1a1a1a';

  const scoreMsg = result
    ? result.score >= 70
      ? 'Strong profile! You match most in-demand skills.'
      : result.score >= 40
      ? 'Good start — a few more skills will boost your match.'
      : 'Keep building — focus on the skills below.'
    : '';

  return (
    <div>
      <p className="section-sub">
        Add your current skills and see how you match against live Singapore job postings.
      </p>

      <div className="chip-input-row">
        <input
          type="text"
          placeholder="Type a skill e.g. Python, SQL, Node.js..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSkill()}
        />
        <button className="add-btn" onClick={addSkill}>Add</button>
      </div>

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
              <div className="score-label">match against top roles</div>
              <div className="score-msg">{scoreMsg}</div>
            </div>
            <div style={{ marginTop: '1rem', fontSize: 12, color: '#aaa', textAlign: 'center' }}>
              Based on {result.skills?.length} most in-demand skills in Singapore
            </div>
          </div>

          <div className="card">
            <h3>Skill breakdown</h3>
            <div>
              {result.skills?.map(({ skill, pct, have }) => (
                <div className="gap-item" key={skill}>
                  <div className={`gap-icon ${have ? 'gap-have' : 'gap-miss'}`}>
                    {have ? '✓' : '!'}
                  </div>
                  <div>
                    <div className="gap-text">{skill}</div>
                    <div className="gap-sub">
                      {have ? 'You have this · ' : 'Missing · '}
                      in {pct}% of job postings
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mySkills.length === 0 && (
        <div style={{ marginTop: '2rem', padding: '2rem', background: '#f9f9f7', borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#aaa' }}>
            Start by adding your skills above to see your match score
          </div>
          <div style={{ fontSize: 12, color: '#bbb', marginTop: 8 }}>
            Try: Python, JavaScript, SQL, Node.js, MongoDB...
          </div>
        </div>
      )}
    </div>
  );
}
