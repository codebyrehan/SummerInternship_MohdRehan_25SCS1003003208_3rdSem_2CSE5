import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  slug: { type: String, unique: true, required: true, lowercase: true },
  theme: { type: String, enum: ['dark-navy', 'pure-white', 'soft-purple', 'forest-green'], default: 'dark-navy' },
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    linkedin: String,
    github: String,
    location: String,
    jobTitle: String,
    bio: String,
  },
  skills: [String],
  projects: [{
    name: String,
    tech: String,
    description: String,
    liveUrl: String,
    githubUrl: String,
  }],
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String,
    bullets: [String],
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    description: String,
  }],
  githubRepos: [{
    name: String,
    description: String,
    language: String,
    stars: Number,
    url: String,
  }],
  viewCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

portfolioSchema.index({ user: 1 });

export default mongoose.model('Portfolio', portfolioSchema);
