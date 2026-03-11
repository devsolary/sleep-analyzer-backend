const mongoose = require('mongoose');

const sleepStageSchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: ['awake', 'light', 'deep', 'rem'],
    required: true,
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
}, { _id: false });

const sleepSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    bedtime: { type: Date, required: true },
    wakeTime: { type: Date, required: true },
    totalDurationMinutes: { type: Number },

    // Sleep quality score 1-100
    qualityScore: { type: Number, min: 0, max: 100 },

    // Sleep stages breakdown
    stages: [sleepStageSchema],

    // Manual or sensor metrics
    heartRateAvg: { type: Number },
    heartRateMin: { type: Number },
    heartRateMax: { type: Number },
    respirationRate: { type: Number },
    movementScore: { type: Number, min: 0, max: 100 }, // 0 = very still

    // Environmental factors
    roomTemperature: { type: Number },        // Celsius
    noiseLevel: { type: Number, min: 0, max: 100 },
    lightLevel: { type: Number, min: 0, max: 100 },

    // User-reported
    mood: {
      type: String,
      enum: ['terrible', 'poor', 'fair', 'good', 'excellent'],
    },
    notes: { type: String, maxlength: 500 },
    tags: [{ type: String, maxlength: 30 }],

    // Interruptions
    interruptions: { type: Number, default: 0 },
    interruptionMinutes: { type: Number, default: 0 },

    // Data source
    dataSource: {
      type: String,
      enum: ['manual', 'wearable', 'phone_sensor'],
      default: 'manual',
    },
  },
  { timestamps: true }
);

// Auto-calculate duration before saving
sleepSessionSchema.pre('save', function (next) {
  if (this.bedtime && this.wakeTime) {
    const ms = new Date(this.wakeTime) - new Date(this.bedtime);
    this.totalDurationMinutes = Math.round(ms / 60000);
  }
  next();
});

// Virtual: duration in hours
sleepSessionSchema.virtual('durationHours').get(function () {
  return this.totalDurationMinutes
    ? parseFloat((this.totalDurationMinutes / 60).toFixed(2))
    : null;
});

// Index for fast range queries
sleepSessionSchema.index({ user: 1, bedtime: -1 });
sleepSessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SleepSession', sleepSessionSchema);