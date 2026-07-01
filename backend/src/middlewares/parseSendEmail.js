const { z } = require('zod');
const AppError = require('../utils/AppError');

const sendEmailBodySchema = z.object({
  contact_ids: z.array(z.number().int().positive()).min(1, 'Select at least one contact'),
  template_id: z.number().int().positive('Template is required'),
  subject: z.string().max(500).optional(),
  attach_resume: z.boolean().optional().default(false),
});

const parseSendEmailBody = (req, _res, next) => {
  try {
    let contactIds = req.body.contact_ids;
    if (typeof contactIds === 'string') {
      contactIds = JSON.parse(contactIds);
    }

    const attachResume = req.body.attach_resume === 'true' || req.body.attach_resume === true;

    const parsed = sendEmailBodySchema.parse({
      contact_ids: contactIds,
      template_id: parseInt(req.body.template_id, 10),
      subject: req.body.subject || undefined,
      attach_resume: attachResume,
    });

    req.body = parsed;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(error);
    }
    next(new AppError('Invalid request data', 400));
  }
};

module.exports = parseSendEmailBody;
