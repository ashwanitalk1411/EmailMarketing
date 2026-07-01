const emailService = require('../services/emailService');
const ApiResponse = require('../utils/apiResponse');

const emailController = {
  async send(req, res, next) {
    try {
      const result = await emailService.sendBulk(req.user.id, req.body);
      return ApiResponse.success(res, 'Emails processed', result);
    } catch (error) {
      next(error);
    }
  },

  async getLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const { status, user_id } = req.query;
      const result = await emailService.getLogs(req.user.id, req.user.role, {
        status,
        page,
        limit,
        user_id,
      });
      return ApiResponse.success(res, 'Email logs retrieved', result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = emailController;
