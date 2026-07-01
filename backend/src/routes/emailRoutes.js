const express = require('express');
const emailController = require('../controllers/emailController');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const { sendEmailSchema, emailLogsSchema } = require('../validators');

const router = express.Router();

router.use(authenticate);

router.post('/send', authorize('user'), validate(sendEmailSchema), emailController.send);
router.get('/logs', validate(emailLogsSchema), emailController.getLogs);

module.exports = router;
