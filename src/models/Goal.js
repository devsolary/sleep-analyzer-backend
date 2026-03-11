const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['sleep_duration', 'sleep_quality', 'consistency', 'bedtime', 'wake_time'],
      required: true,
    },
    targetValue: { type: Number, required: true },
    targetUnit: { type: String, enum: ['hours', 'score', 'days', 'time'] },
    currentValue: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    isAchieved: { type: Boolean, default: false },
    achievedAt: { type: Date },
    streak: { type: Number, default: 0 },
    description: { type: String, maxlength: 200 },
  },
  { timestamps: true }
);

goalSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('Goal', goalSchema);