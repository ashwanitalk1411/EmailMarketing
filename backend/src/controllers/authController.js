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

  async getResume(req, res, next) {
    try {
      const resume = await authService.getResume(req.user.id);
      return ApiResponse.success(res, 'Resume retrieved', resume);
    } catch (error) {
      next(error);
    }
  },

  async saveResume(req, res, next) {
    try {
      if (!req.file) {
        return ApiResponse.error(res, 'Resume file is required', [], 400);
      }
      const resume = await authService.saveResume(req.user.id, req.file);
      return ApiResponse.success(res, 'Resume saved successfully', resume);
    } catch (error) {
      next(error);
    }
  },

  async deleteResume(req, res, next) {
    try {
      await authService.deleteResume(req.user.id);
      return ApiResponse.success(res, 'Resume deleted');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
