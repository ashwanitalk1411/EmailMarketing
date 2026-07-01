const express = require('express');
const contactController = require('../controllers/contactController');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload');
const { authenticate, authorize } = require('../middlewares/auth');
const {
  contactSchema,
  updateContactSchema,
  contactIdSchema,
  contactSearchSchema,
  adminContactSearchSchema,
} = require('../validators');

const router = express.Router();

router.get(
  '/all',
  authenticate,
  authorize('super_admin'),
  validate(adminContactSearchSchema),
  contactController.getAllForAdmin
);

router.use(authenticate, authorize('user'));

router.get('/', validate(contactSearchSchema), contactController.getAll);
router.post('/', validate(contactSchema), contactController.create);
router.post('/import', upload.single('file'), contactController.importCsv);
router.put('/:id', validate(updateContactSchema), contactController.update);
router.delete('/:id', validate(contactIdSchema), contactController.delete);

module.exports = router;
