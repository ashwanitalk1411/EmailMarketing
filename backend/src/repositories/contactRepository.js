const db = require('../config/database');

const contactRepository = {
  findByUserId(userId, { search, page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    let query = db('contacts').where({ user_id: userId });

    if (search) {
      query = query.where((builder) => {
        builder
          .where('name', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`);
      });
    }

    return query.orderBy('created_at', 'desc').limit(limit).offset(offset);
  },

  countByUserId(userId, { search } = {}) {
    let query = db('contacts').where({ user_id: userId });
    if (search) {
      query = query.where((builder) => {
        builder
          .where('name', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`);
      });
    }
    return query.count('id as count').first();
  },

  findById(id, userId) {
    return db('contacts').where({ id, user_id: userId }).first();
  },

  findByIds(ids, userId) {
    return db('contacts').where({ user_id: userId }).whereIn('id', ids);
  },

  getExistingEmails(userId) {
    return db('contacts').where({ user_id: userId }).pluck('email');
  },

  create(data) {
    return db('contacts').insert(data);
  },

  bulkCreate(records) {
    if (!records.length) return [];
    return db('contacts').insert(records);
  },

  update(id, userId, data) {
    return db('contacts').where({ id, user_id: userId }).update(data);
  },

  delete(id, userId) {
    return db('contacts').where({ id, user_id: userId }).del();
  },

  countAll(userId) {
    return db('contacts').where({ user_id: userId }).count('id as count').first();
  },

  findAll({ search, userId, page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    let query = db('contacts')
      .select(
        'contacts.*',
        'users.name as user_name',
        'users.email as user_email'
      )
      .leftJoin('users', 'contacts.user_id', 'users.id');

    if (search) {
      query = query.where((builder) => {
        builder
          .where('contacts.name', 'like', `%${search}%`)
          .orWhere('contacts.email', 'like', `%${search}%`)
          .orWhere('users.name', 'like', `%${search}%`)
          .orWhere('users.email', 'like', `%${search}%`);
      });
    }

    if (userId) {
      query = query.where('contacts.user_id', userId);
    }

    return query
      .orderBy('contacts.created_at', 'desc')
      .limit(limit)
      .offset(offset);
  },

  countAllContacts({ search, userId } = {}) {
    let query = db('contacts')
      .leftJoin('users', 'contacts.user_id', 'users.id');

    if (search) {
      query = query.where((builder) => {
        builder
          .where('contacts.name', 'like', `%${search}%`)
          .orWhere('contacts.email', 'like', `%${search}%`)
          .orWhere('users.name', 'like', `%${search}%`)
          .orWhere('users.email', 'like', `%${search}%`);
      });
    }

    if (userId) {
      query = query.where('contacts.user_id', userId);
    }

    return query.count('contacts.id as count').first();
  },
};

module.exports = contactRepository;
