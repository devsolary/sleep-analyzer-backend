const SleepLog = require('../models/SleepSession');
const analyticsService = require('../services/analyticsService');
const recommendationService = require('../services/sleepService');

// GET /api/v1/analytics/summary?range=7|30|90
exports.getSummary = async (req, res, next) => {
  try {
    const days = Number(req.query.range) || 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const logs = await SleepLog.find({ user: req.user.id, date: { $gte: since } }).sort({ date: 1 });
    const summary = analyticsService.buildSummary(logs, days);

    res.json({ success: true, data: summary });
  } catch (err) { next(err); }
};

// GET /api/v1/analytics/trends
exports.getTrends = async (req, res, next) => {
  try {
    const logs = await SleepLog.find({ user: req.user.id }).sort({ date: 1 }).limit(90);
    const trends = analyticsService.buildTrends(logs);
    res.json({ success: true, data: trends });
  } catch (err) { next(err); }
};

// GET /api/v1/analytics/recommendations
exports.getRecommendations = async (req, res, next) => {
  try {
    const logs = await SleepLog.find({ user: req.user.id }).sort({ date: -1 }).limit(14);
    const recs = recommendationService.recommendedBedtime.generate(logs, req.user);
    res.json({ success: true, data: recs });
  } catch (err) { next(err); }
};