const express = require('express');
const templateController = require('../controllers/templateController');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const {
  templateSchema,
  updateTemplateSchema,
  templateIdSchema,
  adminTemplateSchema,
} = require('../validators');

const router = express.Router();

router.get(
  '/all',
  authenticate,
  authorize('super_admin'),
  validate(adminTemplateSchema),
  templateController.getAllForAdmin
);

router.use(authenticate, authorize('user'));

router.get('/', templateController.getAll);
router.get('/:id', validate(templateIdSchema), templateController.getById);
router.post('/', validate(templateSchema), templateController.create);
router.put('/:id', validate(updateTemplateSchema), templateController.update);
router.delete('/:id', validate(templateIdSchema), templateController.delete);

module.exports = router;
