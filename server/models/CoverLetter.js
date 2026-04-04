import mongoose from 'mongoose';

const coverLetterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  jobDescription: { type: String, default: '' },
  content: { type: String, required: true },
  pdfUrl: { type: String, default: '' },
}, { timestamps: true });

coverLetterSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('CoverLetter', coverLetterSchema);
