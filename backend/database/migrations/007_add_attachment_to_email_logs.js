/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable('email_logs', (table) => {
    table.string('attachment_name', 255).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.alterTable('email_logs', (table) => {
    table.dropColumn('attachment_name');
  });
};
