const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { loginSchema, updateProfileSchema } = require('../validators');

const router = express.Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);

module.exports = router;
