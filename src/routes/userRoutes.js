const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { AppError } = require('../utils/AppError');

const router = express.Router();
router.use(protect);

router.get('/me/settings', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ status: 'success', data: { settings: user.sleepGoal } });
  } catch (err) { next(err); }
});

router.patch('/me', async (req, res, next) => {
  try {
    const allowed = ['name', 'timezone', 'sleepGoal', 'notificationsEnabled', 'pushToken'];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
});

module.exports = router;