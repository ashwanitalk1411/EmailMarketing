const contactService = require('../services/contactService');
const ApiResponse = require('../utils/apiResponse');

const contactController = {
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const { search } = req.query;
      const result = await contactService.getAll(req.user.id, { search, page, limit });
      return ApiResponse.success(res, 'Contacts retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  async getAllForAdmin(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const { search, user_id } = req.query;
      const result = await contactService.getAllForAdmin({ search, page, limit, user_id });
      return ApiResponse.success(res, 'All emails retrieved', result);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const contact = await contactService.create(req.user.id, req.body);
      return ApiResponse.success(res, 'Contact created', contact, 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const contact = await contactService.update(req.user.id, req.params.id, req.body);
      return ApiResponse.success(res, 'Contact updated', contact);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await contactService.delete(req.user.id, req.params.id);
      return ApiResponse.success(res, 'Contact deleted');
    } catch (error) {
      next(error);
    }
  },

  async importCsv(req, res, next) {
    try {
      if (!req.file) {
        return ApiResponse.error(res, 'CSV file is required', [], 400);
      }
      const summary = await contactService.importFromCsv(req.user.id, req.file.path);
      return ApiResponse.success(res, 'Import completed', summary);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = contactController;
