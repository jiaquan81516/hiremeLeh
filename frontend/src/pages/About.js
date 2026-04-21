import './About.css';

const FEATURES = [
  {
    emoji: '📊',
    title: 'Live job trends',
    desc: 'See what skills Singapore companies are actually hiring for right now — not what some career counsellor guessed 3 years ago.',
  },
  {
    emoji: '💎',
    title: 'Hidden gems filter',
    desc: 'Find jobs posted in the last 48hrs with fewer than 10 applicants. Less competition, same opportunity.',
  },
  {
    emoji: '🎯',
    title: 'Skill gap analyzer',
    desc: 'Paste your skills, see exactly how you match against real live postings. Know what to learn next.',
  },
  {
    emoji: '⏰',
    title: 'Deadline tracker',
    desc: 'GovTech, DBS, Grab, Shopee — all their internship deadlines in one place. Stop missing applications.',
  },
  {
    emoji: '👥',
    title: 'Peer insights',
    desc: 'Real salary figures and interview formats from students who actually went through it. Anonymous, honest, useful.',
  },
  {
    emoji: '📚',
    title: 'Curated resources',
    desc: 'The best community-built Google Sheets, prep guides and tools — all in one tab.',
  },
];

const COURSES = [
  { label: 'Information Systems', emoji: '💻' },
  { label: 'Computer Science', emoji: '⚙️' },
  { label: 'Business (BBA)', emoji: '📈' },
  { label: 'Economics', emoji: '🏦' },
  { label: 'Accountancy', emoji: '📋' },
];

export default function About() {
  return (
    <div className="about">
      {/* Hero */}
      <div className="about-hero">
        <div className="about-tag">Built by a student · For students</div>
        <h1 className="about-title">
          The internship platform<br />
          <span className="about-accent">we wish existed</span><br />
          when we started uni.
        </h1>
        <p className="about-sub">
          Hi! I'm Jia Quan, a Year 1 Information Systems student at SMU.
          I built HiremeLeh! because I was tired of the same frustrations
          — scrolling through outdated job boards, not knowing
          what skills to learn, guessing if a $1,400 stipend was good or not,
          and missing application deadlines I didn't even know existed sia.
        </p>
        <div className="about-rant">
          &ldquo;Wah imagine studying for midterms, next moment E&amp;S, WR A3,
          BQ Final project submission, then study for finals... don't have so
          much time to slowly source leh!&rdquo;
        </div>
        <p className="about-sub" style={{ marginTop: '1.25rem' }}>
          So I built the tool I actually wanted. It's free, it's live, and
          it's made specifically for SMU students — not fresh grads
          with 5 years of experience, not overseas markets, not corporate HR teams.
          <strong> Just us.</strong>
        </p>
        <p className="about-sub">
          Summer break is coming and I've been struggling to find internships myself.
          I needed something real, fast — so in between revision sessions during finals,
          I built this. If you're facing the same stress of not knowing where to apply,
          what skills to learn, or whether your offer is even worth taking —
          this might be for you.
        </p>
        <div className="about-transparency">
          <span className="about-transparency-tag">Disclaimer!</span>
          <p>
            I built this with the help of Claude during finals season.
            Not because I couldn't code it myself, but because I had maybe 3 hours between
            revision sessions and still wanted to ship something real and useful.
            Leveraging AI to build faster is a skill too — and honestly, if you're a student
            not leveraging AI tools yet, you probably should be lah. 🙂
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="about-divider">
        <span>what's inside</span>
      </div>

      {/* Features grid */}
      <div className="about-features">
        {FEATURES.map(f => (
          <div className="about-feature" key={f.title}>
            <div className="about-feature-emoji">{f.emoji}</div>
            <div className="about-feature-title">{f.title}</div>
            <div className="about-feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="about-divider">
        <span>who is this for</span>
      </div>

      {/* Courses */}
      <div className="about-courses-wrap">
        <p className="about-courses-intro">
          Not just for tech students. HiremeLeh! has tailored job feeds,
          skill benchmarks, and company deadlines for:
        </p>
        <div className="about-courses">
          {COURSES.map(c => (
            <div className="about-course-chip" key={c.label}>
              {c.emoji} {c.label}
            </div>
          ))}
        </div>
        <p className="about-courses-intro" style={{ marginTop: '1rem' }}>
          Just pick your course from the dropdown at the top — everything filters automatically.
        </p>
      </div>

      {/* Divider */}
      <div className="about-divider">
        <span>the honest part</span>
      </div>

      {/* Honest section */}
      <div className="about-honest">
        <div className="about-honest-card">
          <div className="about-honest-title">What this is</div>
          <ul className="about-honest-list">
            <li>✅ Live Singapore job data updated every 6 hours</li>
            <li>✅ Real peer insights from real students (submit yours!)</li>
            <li>✅ Free forever, no account needed</li>
            <li>✅ Built specifically for SG uni students</li>
          </ul>
        </div>
        <div className="about-honest-card">
          <div className="about-honest-title">What this isn't (yet)</div>
          <ul className="about-honest-list">
            <li>⚠️ Not a replacement for your uni's career portal</li>
            <li>⚠️ Peer insights database is still growing — submit yours to help!</li>
            <li>⚠️ Not covering every single job board (LinkedIn, Glints etc.)</li>
            <li>⚠️ Still a work in progress — feedback welcome</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="about-divider">
        <span>help make it better</span>
      </div>

      {/* CTA */}
      <div className="about-cta">
        <p className="about-cta-text">
          The more students contribute peer insights, the more useful this becomes for everyone.
          If you've done an internship — even a short one — please share your experience.
          It takes 2 minutes and genuinely helps the next person.
        </p>
        <div className="about-cta-actions">
          <div className="about-cta-card">
            <div className="about-cta-num">01</div>
            <div className="about-cta-label">Go to <strong>Peer insights</strong></div>
            <div className="about-cta-desc">Click "Share yours" and fill in what you know</div>
          </div>
          <div className="about-cta-card">
            <div className="about-cta-num">02</div>
            <div className="about-cta-label">Share with a friend</div>
            <div className="about-cta-desc">Send the link to your coursemates — the more the merrier</div>
          </div>
          <div className="about-cta-card">
            <div className="about-cta-num">03</div>
            <div className="about-cta-label">Give feedback</div>
            <div className="about-cta-desc">
              Email me at{' '}
              <a href="mailto:jiaquan81516@gmail.com" style={{ color: '#e24b4a' }}>
                jiaquan81516@gmail.com
              </a>
              {' '}— I actually read every message
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="about-footer-note">
        Built with Node.js, Express, MongoDB, and React · Data from MyCareersFuture (Singapore) ·
        Deployed free on Netlify + Render · Made at 2am by a broke uni student 🙂
      </div>
    </div>
  );
}