const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

const authController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return ApiResponse.success(res, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req, res, next) {
    try {
      const profile = await authService.getProfile(req.user.id);
      return ApiResponse.success(res, 'Profile retrieved', profile);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const profile = await authService.updateProfile(req.user.id, req.body);
      return ApiResponse.success(res, 'Profile updated', profile);
    } catch (error) {
      next(error);
    }
  },

  logout(_req, res) {
    return ApiResponse.success(res, 'Logout successful');
  },
};

module.exports = authController;
