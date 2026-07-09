const RESOURCES = [
  {
    category: 'Internship Tracking',
    items: [
      {
        title: 'Internship Application Tracker (Google Sheet)',
        description:
          'A comprehensive spreadsheet to track all your internship applications — company, role, status, deadlines, contacts and notes all in one place.',
        url: 'https://docs.google.com/spreadsheets/d/1ycVnEhITyzdqM7_5LEADlxI_LPEt1pGNOn4TBUDLJos/edit?gid=0#gid=0',
        credit: 'SparklingKey',
        creditPlatform: 'Reddit',
        tag: 'Google Sheet',
        tagColor: '#0F6E56',
        tagBg: '#E1F5EE',
      },
    ],
  },
  {
    category: 'Interview Preparation',
    items: [
      {
        title: 'Interview Questions Bank (Google Sheet)',
        description:
          'A crowdsourced collection of real interview questions asked at Singapore tech companies — sorted by company, role, and question type.',
        url: 'https://docs.google.com/spreadsheets/d/1hzP8j7matoUiJ15N-RhsL5Dmig8_E3aP/edit?gid=1377915986#gid=1377915986',
        credit: 'TranslatorAway9891',
        creditPlatform: 'Reddit',
        tag: 'Google Sheet',
        tagColor: '#0F6E56',
        tagBg: '#E1F5EE',
      },
      {
        title: 'Tech Interview Handbook — Offer Comparison Tool',
        description:
          'Compare internship and job offers side by side. See what others are getting paid to benchmark your own offer.',
        url: 'https://app.techinterviewhandbook.org/offers?companyId=&companyName=&jobTitleId=&sortDirection=&sortType=&yoeCategory=',
        tag: 'Offers',
        tagColor: '#533AB7',
        tagBg: '#EEEDFE',
      },
    ],
  },
  {
    category: 'Job Portals',
    items: [
      {
        title: 'MyCareersFuture',
        description:
          "Singapore's official government job portal. Best for local company listings and government-linked roles. Where HiremeLeh pulls its live data from.",
        url: 'https://www.mycareersfuture.gov.sg',
        tag: 'Jobs',
        tagColor: '#185FA5',
        tagBg: '#E6F1FB',
      },
      {
        title: 'LinkedIn Jobs',
        description:
          'Best for MNC internships, global companies, and networking with recruiters. Set job alerts for your target roles.',
        url: 'https://www.linkedin.com/jobs',
        tag: 'Jobs',
        tagColor: '#185FA5',
        tagBg: '#E6F1FB',
      },
      {
        title: 'Glassdoor',
        description:
          'Company reviews, salary data, and interview experiences. Great for researching a company before applying or interviewing.',
        url: 'https://www.glassdoor.sg',
        tag: 'Research',
        tagColor: '#854F0B',
        tagBg: '#FAEEDA',
      },
      {
        title: 'NodeFlair',
        description:
          'Singapore-focused tech salary transparency platform. See verified salaries for software engineering and data roles.',
        url: 'https://www.nodeflair.com',
        tag: 'Salaries',
        tagColor: '#533AB7',
        tagBg: '#EEEDFE',
      },
    ],
  },
  {
    category: 'Skill Building',
    items: [
      {
        title: 'LeetCode',
        description:
          'Essential for technical interviews. Start with Easy problems, focus on Arrays, Strings, and HashMaps first. Most SG tech companies test this.',
        url: 'https://leetcode.com',
        tag: 'Coding',
        tagColor: '#854F0B',
        tagBg: '#FAEEDA',
      },
      {
        title: 'freeCodeCamp',
        description:
          'Free full-stack web development curriculum. Great for building projects to put on your resume — HTML, CSS, JavaScript, Node.js, and more.',
        url: 'https://www.freecodecamp.org',
        tag: 'Free',
        tagColor: '#0F6E56',
        tagBg: '#E1F5EE',
      },
      {
        title: 'Kaggle',
        description:
          'Free data science courses and competitions. Build a portfolio of data projects. Kaggle certificates are recognized by Singapore employers.',
        url: 'https://www.kaggle.com',
        tag: 'Data',
        tagColor: '#185FA5',
        tagBg: '#E6F1FB',
      },
    ],
  },
];

export default function Resources() {
  return (
    <div>
      <p style={{ fontSize: 13, color: '#888', marginBottom: '1.5rem' }}>
        Curated resources from the Singapore student community. Know a good resource we're missing?{' '}
        <a href="mailto:jiaquan81516@gmail.com" style={{ color: '#185FA5' }}>
          Submit it here.
        </a>
      </p>

      {RESOURCES.map((section) => (
        <div key={section.category} style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.75rem',
            }}
          >
            {section.category}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {section.items.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #e8e8e4',
                    borderRadius: 12,
                    padding: '1rem 1.25rem',
                    transition: 'border-color 0.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#bbb')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e8e8e4')}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</span>
                      <span
                        style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: item.tagBg,
                          color: item.tagColor,
                          fontWeight: 600,
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <span
                      style={{ fontSize: 12, color: '#185FA5', whiteSpace: 'nowrap', marginTop: 2 }}
                    >
                      Open →
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: 13,
                      color: '#555',
                      lineHeight: 1.5,
                      marginBottom: item.credit ? 8 : 0,
                    }}
                  >
                    {item.description}
                  </p>

                  {item.credit && (
                    <div
                      style={{
                        fontSize: 11,
                        color: '#aaa',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span>Credit:</span>
                      <span style={{ fontWeight: 600, color: '#888' }}>u/{item.credit}</span>
                      <span>on {item.creditPlatform}</span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
