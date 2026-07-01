const db = require('../config/database');

const templateRepository = {
  findByUserId(userId) {
    return db('templates')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');
  },

  findById(id, userId) {
    return db('templates').where({ id, user_id: userId }).first();
  },

  create(data) {
    return db('templates').insert(data);
  },

  update(id, userId, data) {
    return db('templates').where({ id, user_id: userId }).update(data);
  },

  delete(id, userId) {
    return db('templates').where({ id, user_id: userId }).del();
  },

  countByUserId(userId) {
    return db('templates').where({ user_id: userId }).count('id as count').first();
  },
};

module.exports = templateRepository;
