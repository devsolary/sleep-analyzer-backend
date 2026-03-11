const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sleep-analyzer';

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
};

module.exports = connectDB;