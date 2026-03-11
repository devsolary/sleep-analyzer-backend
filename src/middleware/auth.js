const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/AppError');

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new AppError('Please log in to access this resource', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('User no longer exists', 401));

    req.user = user;
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
};