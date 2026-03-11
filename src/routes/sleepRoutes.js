const router = require('express').Router();
const sleepController = require('../controllers/sleepController');
const { protect } = require('../middleware/auth');
// const { sleepLogValidator } = require('../middleware/validator');

router.use(protect);

router.route('/')
  .get(sleepController.getLogs)
  .post(sleepController.createLog);

router.route('/:id')
  .get(sleepController.getLog)
  .put(sleepController.updateLog)
  .delete(sleepController.deleteLog);

module.exports = router;