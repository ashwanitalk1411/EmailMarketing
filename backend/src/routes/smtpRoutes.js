const express = require('express');
const smtpController = require('../controllers/smtpController');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const { smtpSettingsSchema } = require('../validators');

const router = express.Router();

router.get('/my', authenticate, authorize('user'), smtpController.getMySettings);
router.post('/my', authenticate, authorize('user'), validate(smtpSettingsSchema), smtpController.saveMySettings);
router.post('/my/test', authenticate, authorize('user'), smtpController.testMyConnection);

router.use(authenticate, authorize('super_admin'));

router.get('/', smtpController.getGlobalSettings);
router.post('/', validate(smtpSettingsSchema), smtpController.saveGlobalSettings);
router.post('/test', smtpController.testGlobalConnection);

module.exports = router;
