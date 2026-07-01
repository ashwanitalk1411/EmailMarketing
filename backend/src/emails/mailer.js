const nodemailer = require('nodemailer');
const smtpRepository = require('../repositories/smtpRepository');
const AppError = require('../utils/AppError');

const buildTransportConfig = (settings) => {
  const config = {
    host: settings.host,
    port: settings.port,
    auth: {
      user: settings.username,
      pass: settings.password,
    },
  };

  if (settings.encryption === 'tls') {
    config.secure = false;
    config.requireTLS = true;
  } else if (settings.encryption === 'ssl') {
    config.secure = true;
  }

  return config;
};

const createTransporter = async (userId) => {
  const settings = await smtpRepository.getSettingsForSending(userId);

  if (!settings) {
    throw new AppError(
      'SMTP not configured. Go to SMTP Settings and add your email credentials to send emails.',
      400
    );
  }

  return nodemailer.createTransport(buildTransportConfig(settings));
};

const sendEmail = async ({ userId, to, subject, html, attachment }) => {
  const settings = await smtpRepository.getSettingsForSending(userId);

  if (!settings) {
    throw new AppError(
      'SMTP not configured. Go to SMTP Settings and add your email credentials to send emails.',
      400
    );
  }

  const transporter = nodemailer.createTransport(buildTransportConfig(settings));

  const mailOptions = {
    from: settings.username,
    to,
    subject,
    html,
  };

  if (attachment?.path) {
    mailOptions.attachments = [
      {
        filename: attachment.filename,
        path: attachment.path,
      },
    ];
  }

  const info = await transporter.sendMail(mailOptions);

  return info;
};

const verifyConnection = async (userId, { userOnly = false } = {}) => {
  const settings = userOnly
    ? await smtpRepository.getUserSettings(userId)
    : await smtpRepository.getSettingsForSending(userId);

  if (!settings) {
    throw new AppError(
      userOnly
        ? 'SMTP not configured. Save your SMTP settings first.'
        : 'SMTP not configured. Go to SMTP Settings and add your email credentials to send emails.',
      400
    );
  }

  const transporter = nodemailer.createTransport(buildTransportConfig(settings));
  await transporter.verify();
};

module.exports = { sendEmail, verifyConnection, createTransporter };
