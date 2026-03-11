const router = require('express').Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/summary', analyticsController.getSummary);
router.get('/trends', analyticsController.getTrends);
router.get('/recommendations', analyticsController.getRecommendations);

module.exports = router;