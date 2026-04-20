import { useState } from 'react';
import Trends from './pages/Trends';
import Jobs from './pages/Jobs';
import SkillGap from './pages/SkillGap';
import Deadlines from './pages/Deadlines';
import Insights from './pages/Insights';
import Resources from './pages/Resources';
import { CourseProvider, useCourse } from './CourseContext';
import { COURSES } from './courseConfig';
import './App.css';

const TABS = [
  { id: 'trends', label: 'Trends' },
  { id: 'jobs', label: 'Browse jobs' },
  { id: 'gap', label: 'Skill gap' },
  { id: 'deadlines', label: 'Deadlines' },
  { id: 'insights', label: 'Peer insights' },
  { id: 'resources', label: 'Resources' },
];

function CourseSelector() {
  const { course, setCourse } = useCourse();
  return (
    <select
      value={course}
      onChange={e => setCourse(e.target.value)}
      style={{
        padding: '5px 10px',
        borderRadius: 999,
        border: '1px solid #e8e8e4',
        fontSize: 12,
        fontWeight: 500,
        background: '#f5f5f3',
        color: '#1a1a1a',
        cursor: 'pointer',
      }}
    >
      {Object.entries(COURSES).map(([key, val]) => (
        <option key={key} value={key}>{val.label}</option>
      ))}
    </select>
  );
}

function AppInner() {
  const [tab, setTab] = useState('trends');

  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-inner">
          <div className="logo">HiremeLeh<span className="logo-accent">!</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CourseSelector />
            <div className="live-badge">Live · MyCareersFuture</div>
          </div>
        </div>
      </header>

      <nav className="nav">
        <div className="nav-inner">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`nav-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="main">
        {tab === 'trends' && <Trends />}
        {tab === 'jobs' && <Jobs />}
        {tab === 'gap' && <SkillGap />}
        {tab === 'deadlines' && <Deadlines />}
        {tab === 'insights' && <Insights />}
        {tab === 'resources' && <Resources />}
      </main>

      <footer className="footer">
        Built by Foo Jia Quan · Data from MyCareersFuture (Singapore)
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CourseProvider>
      <AppInner />
    </CourseProvider>
  );
}
