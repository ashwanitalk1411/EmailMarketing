const ApiResponse = {
  success(res, message = 'Operation successful', data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  error(res, message = 'An error occurred', errors = [], statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  },
};

module.exports = ApiResponse;
