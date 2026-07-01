const fs = require('fs');
const contactRepository = require('../repositories/contactRepository');
const { parseContactsCsv, processImportRecords } = require('../helpers/csvHelper');
const AppError = require('../utils/AppError');

const contactService = {
  async getAll(userId, { search, page, limit }) {
    const contacts = await contactRepository.findByUserId(userId, { search, page, limit });
    const total = await contactRepository.countByUserId(userId, { search });
    return {
      contacts,
      pagination: {
        page,
        limit,
        total: parseInt(total.count, 10),
        totalPages: Math.ceil(parseInt(total.count, 10) / limit),
      },
    };
  },

  async getAllForAdmin({ search, page, limit, user_id }) {
    const filters = { search, page, limit };
    if (user_id) filters.userId = parseInt(user_id, 10);

    const contacts = await contactRepository.findAll(filters);
    const total = await contactRepository.countAllContacts(filters);

    return {
      contacts,
      pagination: {
        page,
        limit,
        total: parseInt(total.count, 10),
        totalPages: Math.ceil(parseInt(total.count, 10) / limit),
      },
    };
  },

  async create(userId, { name, email }) {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await contactRepository.getExistingEmails(userId);
    if (existing.includes(normalizedEmail)) {
      throw new AppError('Contact with this email already exists', 409);
    }

    const [id] = await contactRepository.create({
      user_id: userId,
      name: name.trim(),
      email: normalizedEmail,
    });

    return contactRepository.findById(id, userId);
  },

  async update(userId, id, data) {
    const contact = await contactRepository.findById(id, userId);
    if (!contact) throw new AppError('Contact not found', 404);

    const updateData = {};
    if (data.name) updateData.name = data.name.trim();
    if (data.email) {
      const normalizedEmail = data.email.toLowerCase().trim();
      if (normalizedEmail !== contact.email) {
        const existing = await contactRepository.getExistingEmails(userId);
        if (existing.includes(normalizedEmail)) {
          throw new AppError('Contact with this email already exists', 409);
        }
      }
      updateData.email = normalizedEmail;
    }

    await contactRepository.update(id, userId, updateData);
    return contactRepository.findById(id, userId);
  },

  async delete(userId, id) {
    const contact = await contactRepository.findById(id, userId);
    if (!contact) throw new AppError('Contact not found', 404);
    await contactRepository.delete(id, userId);
  },

  async importFromCsv(userId, filePath) {
    try {
      const records = parseContactsCsv(filePath);
      const existingEmails = new Set(
        (await contactRepository.getExistingEmails(userId)).map((e) => e.toLowerCase())
      );

      const { toInsert, summary } = processImportRecords(records, existingEmails);

      if (toInsert.length > 0) {
        const insertData = toInsert.map((r) => ({
          user_id: userId,
          name: r.name,
          email: r.email,
        }));
        await contactRepository.bulkCreate(insertData);
      }

      return summary;
    } finally {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  },
};

module.exports = contactService;
