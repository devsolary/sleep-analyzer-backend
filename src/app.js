const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');
const limiter = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const sleepRoutes = require('./routes/sleepRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Security & Parsing
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use('/api', limiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/sleep', sleepRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/users', userRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler
app.use(errorHandler);

module.exports = app;