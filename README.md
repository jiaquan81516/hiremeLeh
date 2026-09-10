# HiremeLeh! 🇸🇬

A Singapore internship tracker for university students — built with Node.js, Express, MongoDB, and React.

Live data from the [MyCareersFuture API](https://api.mycareersfuture.gov.sg) (free, no API key needed).

## Features

- **Trends** — top in-demand skills and hiring companies from live job postings
- **Browse jobs** — searchable, filterable tech roles with salary info
- **Skill gap analyzer** — input your skills, see your match % against real postings
- **Deadlines** — key internship application windows for major SG companies
- **Peer insights** — anonymous salary and interview insights from students

---

## Project structure

```
hiremeLeh/
├── backend/
│   ├── controllers/
│   │   ├── jobsController.js      # MyCareersFuture sync + skill gap logic
│   │   ├── insightsController.js  # Anonymous peer insights
│   │   └── deadlinesController.js # Internship deadlines
│   ├── models/
│   │   ├── Job.js
│   │   ├── Insight.js
│   │   └── Deadline.js
│   ├── routes/
│   │   ├── jobs.js
│   │   ├── insights.js
│   │   └── deadlines.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Trends.js
    │   │   ├── Jobs.js
    │   │   ├── SkillGap.js
    │   │   ├── Deadlines.js
    │   │   └── Insights.js
    │   ├── App.js
    │   ├── App.css
    │   ├── api.js
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

---

## Running locally

### 1. Clone and set up backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI (see step 2 below)
npm run dev
```

### 2. Set up MongoDB Atlas (free)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up free
2. Create a free M0 cluster
3. Under **Database Access**, create a user with read/write access
4. Under **Network Access**, add `0.0.0.0/0` (allow all IPs)
5. Click **Connect → Connect your application** and copy the connection string
6. Paste it into `backend/.env` as `MONGODB_URI`

### 3. Set up frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000, backend on http://localhost:5000.

---

## Deploying for free

### Backend → Render

1. Go to [render.com](https://render.com) and sign up free
2. Click **New → Web Service**
3. Connect your GitHub repo, select the `backend` folder as root
4. Set these:
   - **Build command**: `npm install`
   - **Start command**: `npm start`
   - **Environment**: Node
5. Add environment variables:
   - `MONGODB_URI` = your Atlas connection string
   - `FRONTEND_URL` = your Netlify frontend URL (add after deploying frontend)
6. Deploy — you'll get a URL like `https://hiremeLeh-backend.onrender.com`

> Note: Render free tier spins down after 15 mins inactivity. First request after sleep takes ~30s.

### Frontend → Netlify

1. Go to [netlify.com](https://netlify.com) and sign up free
2. Click **Add new site → Import an existing project**
3. Import your GitHub repo
4. Netlify will use `netlify.toml` from the repo root:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
5. Add environment variable:
   - `REACT_APP_API_URL` = your Render backend URL (e.g. `https://hiremeLeh-backend.onrender.com`)
6. Deploy — you'll get a URL like `https://hiremeleh.netlify.app`

### Final step

Go back to Render → your backend service → Environment variables and update:

- `FRONTEND_URL` = your Netlify URL

---

## Adding to your resume

```
HiremeLeh! — Singapore Internship Tracker               2026
- Built a full-stack web app using Node.js, Express, MongoDB, and React
  to aggregate and analyze 1,000+ live tech job postings from MyCareersFuture API
- Implemented a skill gap analyzer that matches users' skills against real-time
  hiring trends across Singapore's top tech companies
- Deployed on Netlify (frontend) and Render (backend) with MongoDB Atlas — $0 cost
```

---

## Tech stack

| Layer            | Technology                 |
| ---------------- | -------------------------- |
| Frontend         | React, Chart.js            |
| Backend          | Node.js, Express           |
| Database         | MongoDB (Mongoose)         |
| Data source      | MyCareersFuture public API |
| Job scheduler    | node-cron (syncs every 6h) |
| Frontend hosting | Netlify (free)             |
| Backend hosting  | Render (free)              |
| DB hosting       | MongoDB Atlas (free)       |

---

Built by Foo Jia Quan · SMU Information Systems
