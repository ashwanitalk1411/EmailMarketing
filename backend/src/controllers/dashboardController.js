const dashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/apiResponse');

const dashboardController = {
  async getStats(req, res, next) {
    try {
      const stats = await dashboardService.getStats(req.user.id, req.user.role);
      return ApiResponse.success(res, 'Dashboard stats retrieved', stats);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = dashboardController;
