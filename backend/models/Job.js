const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  mcfId: { type: String, unique: true },
  title: String,
  company: String,
  salary: {
    min: Number,
    max: Number,
    display: String,
  },
  skills: [String],
  course: { type: String, default: 'general' },
  sector: String,
  url: String,
  postedAt: Date,
  closingAt: Date,
  isInternship: Boolean,
}, { timestamps: true });

jobSchema.index({ title: 'text', company: 'text', skills: 'text' });
jobSchema.index({ course: 1 });

module.exports = mongoose.model('Job', jobSchema);
