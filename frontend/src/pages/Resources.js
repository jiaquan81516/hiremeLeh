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
  {
    category: 'SMU-Specific',
    items: [
      {
        title: 'SMU Career Development Office (CDO)',
        description:
          'Official SMU career portal — internship listings exclusive to SMU students, resume review appointments, and career fairs.',
        url: 'https://www.smu.edu.sg/campus-life/student-services/career-development',
        tag: 'SMU',
        tagColor: '#185FA5',
        tagBg: '#E6F1FB',
      },
      {
        title: 'SMU TARO (Internship Credit)',
        description:
          "Apply to have your internship recognised for academic credit under SMU's internship programme. Check eligibility requirements.",
        url: 'https://taro.smu.edu.sg',
        tag: 'SMU',
        tagColor: '#185FA5',
        tagBg: '#E6F1FB',
      },
    ],
  },
];

export default function Resources() {
  return (
    <div>
      <h1 className="page-title">Resources</h1>
      <p className="page-sub">
        Hand-picked by students, for students. Know a good one we are missing?{' '}
        <a href="mailto:jiaquan81516@gmail.com" style={{ fontWeight: 700 }}>
          Send it in.
        </a>
      </p>

      {RESOURCES.map((section) => (
        <section className="res-section" key={section.category}>
          <h2>{section.category}</h2>
          <div className="res-list">
            {section.items.map((item) => (
              <a
                className="res"
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="res-top">
                  <span className="res-title">{item.title}</span>
                  <span
                    className="res-tag"
                    style={{ background: item.tagBg, color: item.tagColor }}
                  >
                    {item.tag}
                  </span>
                </div>
                <p className="res-desc">{item.description}</p>
                {item.credit && (
                  <div className="res-credit">
                    Credit: <b>u/{item.credit}</b> on {item.creditPlatform}
                  </div>
                )}
                <span className="res-open">Open</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
