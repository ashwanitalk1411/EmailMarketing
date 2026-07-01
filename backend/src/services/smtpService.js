const smtpRepository = require('../repositories/smtpRepository');
const { verifyConnection } = require('../emails/mailer');
const AppError = require('../utils/AppError');

const maskSettings = (settings) => {
  if (!settings) return null;
  return {
    id: settings.id,
    host: settings.host,
    port: settings.port,
    username: settings.username,
    encryption: settings.encryption,
    password: '********',
    updated_at: settings.updated_at,
  };
};

const smtpService = {
  async getGlobalSettings() {
    return maskSettings(await smtpRepository.getGlobalSettings());
  },

  async getUserSettings(userId) {
    return maskSettings(await smtpRepository.getUserSettings(userId));
  },

  async saveGlobalSettings(data) {
    const existing = await smtpRepository.getGlobalSettings();
    return this._save(existing, data, null);
  },

  async saveUserSettings(userId, data) {
    const existing = await smtpRepository.getUserSettings(userId);
    return this._save(existing, data, userId);
  },

  async _save(existing, data, userId) {
    const updateData = { ...data };
    if (data.password === '********' || !data.password) {
      delete updateData.password;
    }

    if (existing) {
      await smtpRepository.update(existing.id, updateData);
    } else {
      await smtpRepository.upsert({ ...data, user_id: userId });
    }

    return userId
      ? this.getUserSettings(userId)
      : this.getGlobalSettings();
  },

  async testGlobalConnection() {
    try {
      const settings = await smtpRepository.getGlobalSettings();
      if (!settings) {
        throw new AppError('Global SMTP settings not configured.', 400);
      }
      await verifyConnection(null, { userOnly: false });
      return { connected: true };
    } catch (error) {
      throw new AppError(`SMTP connection failed: ${error.message}`, 400);
    }
  },

  async testUserConnection(userId) {
    try {
      await verifyConnection(userId, { userOnly: true });
      return { connected: true };
    } catch (error) {
      throw new AppError(`SMTP connection failed: ${error.message}`, 400);
    }
  },
};

module.exports = smtpService;
