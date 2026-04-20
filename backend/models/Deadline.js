const mongoose = require('mongoose');

const deadlineSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: String,
  description: String,
  deadline: Date,
  applyUrl: String,
  intake: String,
}, { timestamps: true });

module.exports = mongoose.model('Deadline', deadlineSchema);
