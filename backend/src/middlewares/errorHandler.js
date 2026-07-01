const { ZodError } = require('zod');
const AppError = require('../utils/AppError');
const ApiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return ApiResponse.error(res, 'Validation failed', errors, 422);
  }

  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.errors, err.statusCode);
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return ApiResponse.error(res, 'Duplicate entry found', [], 409);
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  return ApiResponse.error(res, 'Internal server error', [], 500);
};

module.exports = errorHandler;
