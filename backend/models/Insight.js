const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  salary: String,
  interviewFormat: { type: String, required: true },
  advice: { type: String, required: true },
  university: String,
  year: String,
  approved: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Insight', insightSchema);
