import mongoose from 'mongoose';

const atsScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
}, { timestamps: true });

atsScoreSchema.index({ user: 1, createdAt: -1 });
atsScoreSchema.index({ resume: 1, createdAt: -1 });

export default mongoose.model('AtsScore', atsScoreSchema);
