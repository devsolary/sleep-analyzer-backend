const logger = require('../utils/logger');

exports.errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  if (err.name === 'CastError')
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  if (err.code === 11000)
    return res.status(409).json({ success: false, message: 'Duplicate field value' });
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};