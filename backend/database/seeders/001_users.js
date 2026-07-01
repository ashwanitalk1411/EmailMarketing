const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function (knex) {
  await knex('email_logs').del();
  await knex('templates').del();
  await knex('contacts').del();
  await knex('smtp_settings').del();
  await knex('users').del();

  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const userPassword = await bcrypt.hash('User@123', 12);

  await knex('users').insert([
    {
      id: 1,
      name: 'Super Admin',
      email: 'admin@yopmail.com',
      password: adminPassword,
      role: 'super_admin',
    },
    {
      id: 2,
      name: 'Demo User',
      email: 'user@yopmail.com',
      password: userPassword,
      role: 'user',
    },
  ]);
};
