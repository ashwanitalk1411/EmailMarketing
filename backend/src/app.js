const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    errors: [],
  },
});
app.use('/api', limiter);

app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: [],
  });
});

app.use(errorHandler);

module.exports = app;
