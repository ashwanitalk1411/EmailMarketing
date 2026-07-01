/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('resume_path', 500).nullable();
    table.string('resume_filename', 255).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('resume_path');
    table.dropColumn('resume_filename');
  });
};
