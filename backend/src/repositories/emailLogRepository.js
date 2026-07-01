const db = require('../config/database');

const emailLogRepository = {
  create(data) {
    return db('email_logs').insert(data);
  },

  bulkCreate(records) {
    if (!records.length) return [];
    return db('email_logs').insert(records);
  },

  findByUserId(userId, { status, page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    let query = db('email_logs').where({ user_id: userId });

    if (status) {
      query = query.where({ status });
    }

    return query.orderBy('created_at', 'desc').limit(limit).offset(offset);
  },

  findAll({ status, userId, page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    let query = db('email_logs')
      .select(
        'email_logs.*',
        'users.name as user_name',
        'users.email as user_email'
      )
      .leftJoin('users', 'email_logs.user_id', 'users.id');

    if (status) query = query.where('email_logs.status', status);
    if (userId) query = query.where('email_logs.user_id', userId);

    return query
      .orderBy('email_logs.created_at', 'desc')
      .limit(limit)
      .offset(offset);
  },

  countByUserId(userId, { status } = {}) {
    let query = db('email_logs').where({ user_id: userId });
    if (status) query = query.where({ status });
    return query.count('id as count').first();
  },

  countAll({ status, userId } = {}) {
    let query = db('email_logs');
    if (status) query = query.where({ status });
    if (userId) query = query.where({ user_id: userId });
    return query.count('id as count').first();
  },

  countByStatus(userId, status) {
    return db('email_logs')
      .where({ user_id: userId, status })
      .count('id as count')
      .first();
  },

  getRecent(userId, limit = 10) {
    return db('email_logs')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(limit);
  },

  update(id, data) {
    return db('email_logs').where({ id }).update(data);
  },

  findById(id) {
    return db('email_logs').where({ id }).first();
  },
};

module.exports = emailLogRepository;
