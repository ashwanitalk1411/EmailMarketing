const express = require('express');
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const { createUserSchema, updateUserSchema, userIdSchema } = require('../validators');

const router = express.Router();

router.use(authenticate, authorize('super_admin'));

router.get('/', userController.getAll);
router.get('/:id', validate(userIdSchema), userController.getById);
router.post('/', validate(createUserSchema), userController.create);
router.put('/:id', validate(updateUserSchema), userController.update);
router.delete('/:id', validate(userIdSchema), userController.delete);

module.exports = router;
