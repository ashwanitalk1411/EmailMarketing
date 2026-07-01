const express = require('express');
const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const userRoutes = require('./userRoutes');
const contactRoutes = require('./contactRoutes');
const templateRoutes = require('./templateRoutes');
const emailRoutes = require('./emailRoutes');
const smtpRoutes = require('./smtpRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/contacts', contactRoutes);
router.use('/templates', templateRoutes);
router.use('/emails', emailRoutes);
router.use('/smtp', smtpRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running', data: { status: 'healthy' } });
});

module.exports = router;
