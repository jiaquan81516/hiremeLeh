import { useState } from 'react';

const MOCK_KEYWORDS = ['ATS format', 'action verbs', 'quantified impact', 'keyword match'];
const MOCK_FIXES = [
  'Move technical skills and tools higher so the ATS scan picks them up earlier.',
  'Add measurable results to project bullets instead of task-only descriptions.',
  'Mirror role keywords like React, SQL, and stakeholder communication in experience lines.',
];

export default function AIChatBot() {
  const [notes, setNotes] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes.trim() || !resumeName) {
      alert('Add a prompt and upload a resume file first.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="ai-bot-shell">
      <div className="ai-bot-hero">
        <div className="ai-bot-kicker">Mock career copilot</div>
        <h2>AI CHAT BOT</h2>
        <p>
          Upload a resume, type what role you want, and preview a mock ATS-style review.
          This display is for demonstration only and does not analyse the actual file.
        </p>
      </div>

      {!submitted && (
        <form className="ai-bot-form" onSubmit={handleSubmit}>
          <div className="card">
            <div className="ai-bot-grid">
              <div className="form-group">
                <label className="ai-bot-label" htmlFor="resume-upload">Resume upload</label>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeName(e.target.files?.[0]?.name || '')}
                />
              </div>
              <div className="form-group">
                <label className="ai-bot-label" htmlFor="chat-request">Target role or search prompt</label>
                <textarea
                  id="chat-request"
                  placeholder="Example: Product analyst internship at a Singapore startup"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                />
              </div>
            </div>

            <div className="ai-bot-actions">
              <div className="ai-bot-file-note">
                {resumeName ? `Uploaded: ${resumeName}` : 'No resume uploaded yet'}
              </div>
              <button className="submit-btn" type="submit">
                Run mock ATS check
              </button>
            </div>
          </div>
        </form>
      )}

      {submitted && (
        <div className="ai-bot-results">
          <div className="ai-bot-score card">
            <div className="ai-bot-score-label">ATS Match Score</div>
            <div className="ai-bot-score-value">78</div>
            <div className="ai-bot-score-sub">Mock recruiter-ready preview</div>
          </div>

          <div className="card">
            <h3>Top ATS signals</h3>
            <div className="ai-bot-chip-row">
              {MOCK_KEYWORDS.map((item) => (
                <span className="tag" key={item}>{item}</span>
              ))}
            </div>
            <div className="ai-bot-summary">
              Resume uploaded and prompt captured. The mock display hides the input step after submit
              and shows a fixed ATS-style review panel for demo purposes.
            </div>
          </div>

          <div className="card">
            <h3>Suggested improvements</h3>
            <div className="ai-bot-fix-list">
              {MOCK_FIXES.map((item) => (
                <div className="ai-bot-fix" key={item}>{item}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
