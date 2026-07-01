const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('../utils/AppError');

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
};

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError('Access denied', 403));
  }

  next();
};

module.exports = { authenticate, authorize };
