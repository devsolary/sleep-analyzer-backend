const cron = require('node-cron');
const logger = require('../utils/logger');

/**
 * Placeholder for scheduled background jobs.
 * Add real notification / aggregation logic here.
 */
const startCronJobs = () => {
  // Daily at 08:00 — send morning sleep summary notifications
  cron.schedule('0 8 * * *', () => {
    logger.info('[cron] Running daily sleep summary job');
    // TODO: query users with notifications enabled, compute summaries, send push
  });

  // Weekly on Sunday at 09:00 — weekly report
  cron.schedule('0 9 * * 0', () => {
    logger.info('[cron] Running weekly report job');
    // TODO: generate weekly reports
  });
};

module.exports = { startCronJobs };