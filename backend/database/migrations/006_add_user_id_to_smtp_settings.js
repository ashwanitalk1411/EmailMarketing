/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable('smtp_settings', (table) => {
    table.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('CASCADE');
    table.unique(['user_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.alterTable('smtp_settings', (table) => {
    table.dropUnique(['user_id']);
    table.dropColumn('user_id');
  });
};
