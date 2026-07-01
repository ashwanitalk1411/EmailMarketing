const templateRepository = require('../repositories/templateRepository');
const { sanitizeHtml } = require('../helpers/emailHelper');
const AppError = require('../utils/AppError');

const templateService = {
  async getAll(userId) {
    return templateRepository.findByUserId(userId);
  },

  async getAllForAdmin(userId) {
    return templateRepository.findByUserId(userId);
  },

  async getById(userId, id) {
    const template = await templateRepository.findById(id, userId);
    if (!template) throw new AppError('Template not found', 404);
    return template;
  },

  async create(userId, { name, subject, html_content }) {
    const [id] = await templateRepository.create({
      user_id: userId,
      name: name.trim(),
      subject: subject.trim(),
      html_content: sanitizeHtml(html_content),
    });
    return templateRepository.findById(id, userId);
  },

  async update(userId, id, data) {
    const template = await templateRepository.findById(id, userId);
    if (!template) throw new AppError('Template not found', 404);

    const updateData = {};
    if (data.name) updateData.name = data.name.trim();
    if (data.subject) updateData.subject = data.subject.trim();
    if (data.html_content) updateData.html_content = sanitizeHtml(data.html_content);

    await templateRepository.update(id, userId, updateData);
    return templateRepository.findById(id, userId);
  },

  async delete(userId, id) {
    const template = await templateRepository.findById(id, userId);
    if (!template) throw new AppError('Template not found', 404);
    await templateRepository.delete(id, userId);
  },
};

module.exports = templateService;
