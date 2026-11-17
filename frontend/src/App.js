import { useState } from 'react';
import Trends from './pages/Trends';
import Jobs from './pages/Jobs';
import SkillGap from './pages/SkillGap';
import Insights from './pages/Insights';
import Resources from './pages/Resources';
import About from './pages/About';
import AIChatBot from './pages/AIChatBot';
import { CourseProvider, useCourse } from './CourseContext';
import { COURSES } from './courseConfig';
import './App.css';

// The nav is drawn like an MRT route map: one line, one stop per page.
const TABS = [
  { id: 'trends', label: 'Home', short: 'Home' },
  { id: 'jobs', label: 'Browse jobs', short: 'Jobs' },
  { id: 'gap', label: 'Skill gap', short: 'Skills' },
  { id: 'insights', label: 'Peer insights', short: 'Peers' },
  { id: 'ai', label: 'AI chat bot', short: 'AI' },
  { id: 'resources', label: 'Resources', short: 'Guides' },
  { id: 'about', label: 'About', short: 'About' },
];

function CourseSelector() {
  const { course, setCourse } = useCourse();
  return (
    <label className="course-select">
      <span className="course-select-label">I study</span>
      <select
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        aria-label="Choose your course"
      >
        {Object.entries(COURSES).map(([key, val]) => (
          <option key={key} value={key}>
            {val.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function AppInner() {
  const [tab, setTab] = useState('trends');
  const { course } = useCourse();

  const go = (id) => {
    setTab(id);
    window.scrollTo(0, 0);
  };

  return (
    <div className="shell" data-track={course}>
      <header className="topbar">
        <div className="topbar-inner">
          <button className="wordmark" onClick={() => go('trends')} aria-label="HiremeLeh home">
            HiremeLeh<span>!</span>
          </button>
          <CourseSelector />
        </div>
      </header>

      <nav className="route" aria-label="Pages">
        <div className="route-inner" style={{ '--n': TABS.length }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`stop ${tab === t.id ? 'active' : ''}`}
              onClick={() => go(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
            >
              <span className="stop-dot" />
              <span className="stop-label stop-long">{t.label}</span>
              <span className="stop-label stop-short">{t.short}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="main">
        {tab === 'trends' && <Trends goTo={go} />}
        {tab === 'jobs' && <Jobs />}
        {tab === 'gap' && <SkillGap />}
        {tab === 'insights' && <Insights />}
        {tab === 'ai' && <AIChatBot />}
        {tab === 'resources' && <Resources />}
        {tab === 'about' && <About />}
      </main>

      <footer className="footer">
        <div>Built by Foo Jia Quan, SMU Year 1 IS</div>
        <div>Jobs from MyCareersFuture · refreshed every 6 hours · where got time one leh</div>
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
