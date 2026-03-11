const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
];

router.post('/register', registerValidation, authController.register);
router.post('/login',    authController.login);
// router.post('/refresh',  authController.refreshToken);
// router.post('/logout',   protect, authController.logout);
router.get('/me', protect, authController.getMe);

module.exports = router;