const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    mcfId: { type: String, unique: true },
    title: String,
    company: String,
    salary: {
      min: Number,
      max: Number,
      display: String,
    },
    skills: [String],
    courses: [{ type: String }], // array — job can belong to multiple courses
    sector: String,
    url: String,
    postedAt: Date,
    closingAt: Date,
    isInternship: Boolean,
    applicationCount: { type: Number, default: 0 },
    companySize: { type: String, default: 'unknown' }, // startup, sme, mnc, government
    workArrangement: { type: String, default: 'onsite' }, // remote, hybrid, onsite
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', company: 'text', skills: 'text' });
jobSchema.index({ courses: 1 });
jobSchema.index({ postedAt: -1 });
jobSchema.index({ applicationCount: 1 });
jobSchema.index({ closingAt: 1 });

module.exports = mongoose.model('Job', jobSchema);
