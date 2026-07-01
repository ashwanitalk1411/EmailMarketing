const db = require('../config/database');

const smtpRepository = {
  getGlobalSettings() {
    return db('smtp_settings').whereNull('user_id').orderBy('id', 'desc').first();
  },

  getUserSettings(userId) {
    return db('smtp_settings').where({ user_id: userId }).first();
  },

  getSettingsForSending(userId) {
    return this.getUserSettings(userId).then((userSettings) => {
      if (userSettings) return userSettings;
      return this.getGlobalSettings();
    });
  },

  upsert(data) {
    return db('smtp_settings').insert(data);
  },

  update(id, data) {
    return db('smtp_settings').where({ id }).update(data);
  },
};

module.exports = smtpRepository;
