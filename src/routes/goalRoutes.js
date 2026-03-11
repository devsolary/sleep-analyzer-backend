const express = require('express');
const Goal = require('../models/Goal');
const { protect } = require('../middleware/auth');
const { AppError } = require('../utils/AppError');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.id, isActive: true });
    res.json({ status: 'success', data: { goals } });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.user.id });
    res.status(201).json({ status: 'success', data: { goal } });
  } catch (err) { next(err); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!goal) return next(new AppError('Goal not found', 404));
    res.json({ status: 'success', data: { goal } });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
});

module.exports = router;