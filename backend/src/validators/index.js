const { z } = require('zod');

const emailSchema = z.string().email('Invalid email address').max(255);

const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
  }),
});

const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(255),
    email: emailSchema,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['super_admin', 'user']).optional().default('user'),
  }),
});

const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid user ID'),
  }),
  body: z.object({
    name: z.string().min(2).max(255).optional(),
    email: emailSchema.optional(),
    password: z.string().min(8).optional(),
    role: z.enum(['super_admin', 'user']).optional(),
  }),
});

const contactSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    email: emailSchema,
  }),
});

const updateContactSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid contact ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    email: emailSchema.optional(),
  }),
});

const contactIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid contact ID'),
  }),
});

const contactSearchSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('20'),
  }),
});

const adminContactSearchSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('20'),
    user_id: z.string().regex(/^\d+$/).optional(),
  }),
});

const adminTemplateSchema = z.object({
  query: z.object({
    user_id: z.string().regex(/^\d+$/, 'user_id is required'),
  }),
});

const templateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Template name is required').max(255),
    subject: z.string().min(1, 'Subject is required').max(500),
    html_content: z.string().min(1, 'HTML content is required'),
  }),
});

const updateTemplateSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid template ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    subject: z.string().min(1).max(500).optional(),
    html_content: z.string().min(1).optional(),
  }),
});

const templateIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid template ID'),
  }),
});

const sendEmailSchema = z.object({
  body: z.object({
    contact_ids: z.array(z.number().int().positive()).min(1, 'Select at least one contact'),
    template_id: z.number().int().positive('Template is required'),
    subject: z.string().max(500).optional(),
  }),
});

const smtpSettingsSchema = z.object({
  body: z.object({
    host: z.string().min(1, 'Host is required').max(255),
    port: z.number().int().min(1).max(65535),
    username: z.string().min(1, 'Username is required').max(255),
    password: z.string().min(1, 'Password is required'),
    encryption: z.enum(['tls', 'ssl', 'none']).default('tls'),
  }),
});

const emailLogsSchema = z.object({
  query: z.object({
    status: z.enum(['pending', 'sending', 'sent', 'failed']).optional(),
    page: z.string().regex(/^\d+$/).optional().default('1'),
    limit: z.string().regex(/^\d+$/).optional().default('20'),
    user_id: z.string().regex(/^\d+$/).optional(),
  }),
});

const userIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid user ID'),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255).optional(),
    email: emailSchema.optional(),
    current_password: z.string().optional(),
    new_password: z.string().min(8).optional(),
  }),
});

module.exports = {
  loginSchema,
  createUserSchema,
  updateUserSchema,
  contactSchema,
  updateContactSchema,
  contactIdSchema,
  contactSearchSchema,
  adminContactSearchSchema,
  adminTemplateSchema,
  templateSchema,
  updateTemplateSchema,
  templateIdSchema,
  sendEmailSchema,
  smtpSettingsSchema,
  emailLogsSchema,
  userIdSchema,
  updateProfileSchema,
};
