const db = require('../config/database');

const userRepository = {
  findByEmail(email) {
    return db('users').where({ email }).first();
  },

  findById(id) {
    return db('users').where({ id }).first();
  },

  findAll({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    return db('users')
      .select('id', 'name', 'email', 'role', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  },

  count() {
    return db('users').count('id as count').first();
  },

  create(data) {
    return db('users').insert(data);
  },

  update(id, data) {
    return db('users').where({ id }).update(data);
  },

  delete(id) {
    return db('users').where({ id }).del();
  },
};

module.exports = userRepository;
