const templateService = require('../services/templateService');
const ApiResponse = require('../utils/apiResponse');

const templateController = {
  async getAll(req, res, next) {
    try {
      const templates = await templateService.getAll(req.user.id);
      return ApiResponse.success(res, 'Templates retrieved', templates);
    } catch (error) {
      next(error);
    }
  },

  async getAllForAdmin(req, res, next) {
    try {
      const userId = parseInt(req.query.user_id, 10);
      if (!userId) {
        return ApiResponse.error(res, 'user_id is required', [], 400);
      }
      const templates = await templateService.getAllForAdmin(userId);
      return ApiResponse.success(res, 'Templates retrieved', templates);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const template = await templateService.getById(req.user.id, req.params.id);
      return ApiResponse.success(res, 'Template retrieved', template);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const template = await templateService.create(req.user.id, req.body);
      return ApiResponse.success(res, 'Template created', template, 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const template = await templateService.update(req.user.id, req.params.id, req.body);
      return ApiResponse.success(res, 'Template updated', template);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await templateService.delete(req.user.id, req.params.id);
      return ApiResponse.success(res, 'Template deleted');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = templateController;
