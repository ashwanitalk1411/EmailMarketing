const contactRepository = require('../repositories/contactRepository');
const emailLogRepository = require('../repositories/emailLogRepository');

const dashboardService = {
  async getStats(userId, role) {
    const isAdmin = role === 'super_admin';

    const contactCount = isAdmin
      ? { count: 0 }
      : await contactRepository.countAll(userId);

    const sentCount = isAdmin
      ? await emailLogRepository.countAll({ status: 'sent' })
      : await emailLogRepository.countByStatus(userId, 'sent');

    const pendingCount = isAdmin
      ? await emailLogRepository.countAll({ status: 'pending' })
      : await emailLogRepository.countByStatus(userId, 'pending');

    const failedCount = isAdmin
      ? await emailLogRepository.countAll({ status: 'failed' })
      : await emailLogRepository.countByStatus(userId, 'failed');

    const recentLogs = isAdmin
      ? await emailLogRepository.findAll({ limit: 10, page: 1 })
      : await emailLogRepository.getRecent(userId, 10);

    let totalContacts = 0;
    if (!isAdmin) {
      totalContacts = parseInt(contactCount.count, 10);
    } else {
      const db = require('../config/database');
      const result = await db('contacts').count('id as count').first();
      totalContacts = parseInt(result.count, 10);
    }

    return {
      total_contacts: totalContacts,
      emails_sent: parseInt(sentCount.count, 10),
      pending_emails: parseInt(pendingCount.count, 10),
      failed_emails: parseInt(failedCount.count, 10),
      recent_logs: recentLogs,
    };
  },
};

module.exports = dashboardService;
