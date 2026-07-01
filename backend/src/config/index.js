require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  bcryptRounds: 12,
};
