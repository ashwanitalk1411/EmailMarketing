const express = require('express');
const emailController = require('../controllers/emailController');
const validate = require('../middlewares/validate');
const uploadResume = require('../middlewares/uploadResume');
const parseSendEmailBody = require('../middlewares/parseSendEmail');
const { authenticate, authorize } = require('../middlewares/auth');
const { emailLogsSchema } = require('../validators');

const router = express.Router();

router.use(authenticate);

router.post(
  '/send',
  authorize('user'),
  uploadResume.single('resume'),
  parseSendEmailBody,
  emailController.send
);
router.get('/logs', validate(emailLogsSchema), emailController.getLogs);

module.exports = router;
