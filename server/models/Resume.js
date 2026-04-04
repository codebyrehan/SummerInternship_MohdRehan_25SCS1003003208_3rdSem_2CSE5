import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled Resume' },
  template: { type: String, default: 'modern-pro' },
  accentColor: { type: String, default: '#6366f1' },
  personalInfo: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    location: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    summary: { type: String, default: '' },
  },
  education: [{
    degree: String,
    institution: String,
    year: String,
    cgpa: String,
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
  }],
  technicalSkills: [String],
  softSkills: [String],
  experience: [{
    title: String,
    company: String,
    startDate: String,
    endDate: String,
    duration: String,
    description: String,
    bullets: [String],
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
  }],
  projects: [{
    name: String,
    tech: String,
    description: String,
    liveUrl: String,
    githubUrl: String,
    link: String,
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    description: String,
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
  }],
  certificationsText: { type: String, default: '' },
  sectionOrder: {
    type: [String],
    default: ['personalInfo', 'education', 'skills', 'experience', 'projects', 'certifications']
  },
  versions: [{
    data: mongoose.Schema.Types.Mixed,
    savedAt: { type: Date, default: Date.now },
    label: { type: String, default: '' },
  }],
  atsScore: { type: Number, default: null },
  lastAtsCheck: { type: Date },
  pdfUrl: { type: String, default: '' },
}, { timestamps: true });

// Index for user queries
resumeSchema.index({ user: 1, updatedAt: -1 });

export default mongoose.model('Resume', resumeSchema);
