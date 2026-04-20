require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = 20;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');

const jobsRouter = require('./routes/jobs');
const insightsRouter = require('./routes/insights');
const deadlinesRouter = require('./routes/deadlines');
const { syncJobs } = require('./controllers/jobsController');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/jobs', jobsRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/deadlines', deadlinesRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Sync jobs from MyCareersFuture every 6 hours
cron.schedule('0 */6 * * *', () => {
  console.log('Syncing jobs from MyCareersFuture...');
  syncJobs();
});

// Initial sync on startup
syncJobs();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
