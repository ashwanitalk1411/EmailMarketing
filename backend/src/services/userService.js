const bcrypt = require('bcrypt');
const config = require('../config');
const userRepository = require('../repositories/userRepository');
const contactRepository = require('../repositories/contactRepository');
const emailLogRepository = require('../repositories/emailLogRepository');
const templateRepository = require('../repositories/templateRepository');
const AppError = require('../utils/AppError');

const userService = {
  async getAll({ page, limit }) {
    const users = await userRepository.findAll({ page, limit });
    const total = await userRepository.count();
    return {
      users,
      pagination: {
        page,
        limit,
        total: parseInt(total.count, 10),
        totalPages: Math.ceil(parseInt(total.count, 10) / limit),
      },
    };
  },

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);

    const [
      contactCount,
      templateCount,
      sentCount,
      pendingCount,
      failedCount,
      recentContacts,
      recentLogs,
      templates,
    ] = await Promise.all([
      contactRepository.countAll(id),
      templateRepository.countByUserId(id),
      emailLogRepository.countByStatus(id, 'sent'),
      emailLogRepository.countByStatus(id, 'pending'),
      emailLogRepository.countByStatus(id, 'failed'),
      contactRepository.findByUserId(id, { page: 1, limit: 10 }),
      emailLogRepository.findByUserId(id, { page: 1, limit: 10 }),
      templateRepository.findByUserId(id),
    ]);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      stats: {
        total_contacts: parseInt(contactCount.count, 10),
        total_templates: parseInt(templateCount.count, 10),
        emails_sent: parseInt(sentCount.count, 10),
        pending_emails: parseInt(pendingCount.count, 10),
        failed_emails: parseInt(failedCount.count, 10),
      },
      contacts: recentContacts,
      templates,
      recent_logs: recentLogs,
    };
  },

  async create({ name, email, password, role }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new AppError('Email already in use', 409);

    const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);
    const [id] = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const user = await userRepository.findById(id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  },

  async update(id, data) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);

    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.role) updateData.role = data.role;

    if (data.email && data.email !== user.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing) throw new AppError('Email already in use', 409);
      updateData.email = data.email;
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, config.bcryptRounds);
    }

    await userRepository.update(id, updateData);
    const updated = await userRepository.findById(id);
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      created_at: updated.created_at,
    };
  },

  async delete(id, currentUserId) {
    if (parseInt(id, 10) === currentUserId) {
      throw new AppError('Cannot delete your own account', 400);
    }
    const user = await userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    await userRepository.delete(id);
  },
};

module.exports = userService;
