/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('templates', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.string('subject', 500).notNullable();
    table.text('html_content', 'longtext').notNullable();
    table.timestamps(true, true);
    table.index('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('templates');
};
