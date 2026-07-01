const smtpService = require('../services/smtpService');
const ApiResponse = require('../utils/apiResponse');

const smtpController = {
  async getGlobalSettings(_req, res, next) {
    try {
      const settings = await smtpService.getGlobalSettings();
      return ApiResponse.success(res, 'SMTP settings retrieved', settings);
    } catch (error) {
      next(error);
    }
  },

  async saveGlobalSettings(req, res, next) {
    try {
      const settings = await smtpService.saveGlobalSettings(req.body);
      return ApiResponse.success(res, 'SMTP settings saved', settings);
    } catch (error) {
      next(error);
    }
  },

  async testGlobalConnection(_req, res, next) {
    try {
      const result = await smtpService.testGlobalConnection();
      return ApiResponse.success(res, 'SMTP connection successful', result);
    } catch (error) {
      next(error);
    }
  },

  async getMySettings(req, res, next) {
    try {
      const settings = await smtpService.getUserSettings(req.user.id);
      return ApiResponse.success(res, 'SMTP settings retrieved', settings);
    } catch (error) {
      next(error);
    }
  },

  async saveMySettings(req, res, next) {
    try {
      const settings = await smtpService.saveUserSettings(req.user.id, req.body);
      return ApiResponse.success(res, 'SMTP settings saved', settings);
    } catch (error) {
      next(error);
    }
  },

  async testMyConnection(req, res, next) {
    try {
      const result = await smtpService.testUserConnection(req.user.id);
      return ApiResponse.success(res, 'SMTP connection successful', result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = smtpController;
