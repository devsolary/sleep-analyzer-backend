const SleepLog = require('../models/SleepSession');
const  calculateSleepScore  = require('../services/sleepService');

// POST /api/v1/sleep
exports.createLog = async (req, res, next) => {
  try {
    const { bedtime, wakeTime, quality, notes, tags, interruptions, heartRateAvg, deepSleepMinutes, remSleepMinutes } = req.body;
    const date = new Date(bedtime);
    date.setHours(0, 0, 0, 0);

    const log = await SleepLog.create({
      user: req.user.id, date, bedtime, wakeTime, quality,
      notes, tags, interruptions, heartRateAvg, deepSleepMinutes, remSleepMinutes
    });

    log.score = calculateSleepScore(log);
    await log.save();

    res.status(201).json({ success: true, data: log });
  } catch (err) { next(err); }
};

// GET /api/v1/sleep
exports.getLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, startDate, endDate } = req.query;
    const filter = { user: req.user.id };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }

    const logs = await SleepLog.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await SleepLog.countDocuments(filter);
    res.json({ success: true, data: logs, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
};

// GET /api/v1/sleep/:id
exports.getLog = async (req, res, next) => {
  try {
    const log = await SleepLog.findOne({ _id: req.params.id, user: req.user.id });
    if (!log) return res.status(404).json({ success: false, message: 'Log not found' });
    res.json({ success: true, data: log });
  } catch (err) { next(err); }
};

// PUT /api/v1/sleep/:id
exports.updateLog = async (req, res, next) => {
  try {
    let log = await SleepLog.findOne({ _id: req.params.id, user: req.user.id });
    if (!log) return res.status(404).json({ success: false, message: 'Log not found' });

    Object.assign(log, req.body);
    log.score = calculateSleepScore(log);
    await log.save();

    res.json({ success: true, data: log });
  } catch (err) { next(err); }
};

// DELETE /api/v1/sleep/:id
exports.deleteLog = async (req, res, next) => {
  try {
    const log = await SleepLog.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!log) return res.status(404).json({ success: false, message: 'Log not found' });
    res.json({ success: true, message: 'Log deleted' });
  } catch (err) { next(err); }
};