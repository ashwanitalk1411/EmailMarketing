const contactRepository = require('../repositories/contactRepository');
const templateRepository = require('../repositories/templateRepository');
const emailLogRepository = require('../repositories/emailLogRepository');
const { sendEmail } = require('../emails/mailer');
const AppError = require('../utils/AppError');

const emailService = {
  async sendBulk(userId, { contact_ids, template_id, subject }) {
    const template = await templateRepository.findById(template_id, userId);
    if (!template) throw new AppError('Template not found', 404);

    const contacts = await contactRepository.findByIds(contact_ids, userId);
    if (contacts.length === 0) {
      throw new AppError('No valid contacts found', 400);
    }

    const emailSubject = subject?.trim() || template.subject;
    const htmlContent = template.html_content;

    const results = { sent: 0, failed: 0, total: contacts.length };

    for (const contact of contacts) {
      const [logId] = await emailLogRepository.create({
        user_id: userId,
        recipient_email: contact.email,
        subject: emailSubject,
        status: 'pending',
      });

      await emailLogRepository.update(logId, { status: 'sending' });

      try {
        await sendEmail({
          userId,
          to: contact.email,
          subject: emailSubject,
          html: htmlContent,
        });

        await emailLogRepository.update(logId, {
          status: 'sent',
          sent_at: new Date(),
        });
        results.sent++;
      } catch (error) {
        await emailLogRepository.update(logId, {
          status: 'failed',
          error_message: error.message,
          sent_at: new Date(),
        });
        results.failed++;
      }
    }

    return results;
  },

  async getLogs(userId, role, { status, page, limit, user_id }) {
    const isAdmin = role === 'super_admin';

    if (isAdmin) {
      const filters = { status, page, limit };
      if (user_id) {
        filters.userId = parseInt(user_id, 10);
      }

      const logs = await emailLogRepository.findAll(filters);
      const total = await emailLogRepository.countAll(filters);

      return {
        logs,
        pagination: {
          page,
          limit,
          total: parseInt(total.count, 10),
          totalPages: Math.ceil(parseInt(total.count, 10) / limit),
        },
      };
    }

    const logs = await emailLogRepository.findByUserId(userId, { status, page, limit });
    const total = await emailLogRepository.countByUserId(userId, { status });

    return {
      logs,
      pagination: {
        page,
        limit,
        total: parseInt(total.count, 10),
        totalPages: Math.ceil(parseInt(total.count, 10) / limit),
      },
    };
  },
};

module.exports = emailService;
