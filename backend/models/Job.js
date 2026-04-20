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
  sector: String,
  url: String,
  postedAt: Date,
  closingAt: Date,
  isInternship: Boolean,
}, { timestamps: true });

jobSchema.index({ title: 'text', company: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
