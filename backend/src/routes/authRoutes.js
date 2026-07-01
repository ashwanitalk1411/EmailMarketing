const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const uploadResume = require('../middlewares/uploadResume');
const { authenticate, authorize } = require('../middlewares/auth');
const { loginSchema, updateProfileSchema } = require('../validators');

const router = express.Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);

router.get('/resume', authenticate, authorize('user'), authController.getResume);
router.post('/resume', authenticate, authorize('user'), uploadResume.single('resume'), authController.saveResume);
router.delete('/resume', authenticate, authorize('user'), authController.deleteResume);

module.exports = router;
