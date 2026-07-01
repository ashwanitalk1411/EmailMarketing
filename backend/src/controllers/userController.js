const userService = require('../services/userService');
const ApiResponse = require('../utils/apiResponse');

const userController = {
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const result = await userService.getAll({ page, limit });
      return ApiResponse.success(res, 'Users retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      return ApiResponse.success(res, 'User retrieved', user);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);
      return ApiResponse.success(res, 'User created', user, 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const user = await userService.update(req.params.id, req.body);
      return ApiResponse.success(res, 'User updated', user);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await userService.delete(req.params.id, req.user.id);
      return ApiResponse.success(res, 'User deleted');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
