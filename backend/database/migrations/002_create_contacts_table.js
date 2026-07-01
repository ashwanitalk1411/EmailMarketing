/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('contacts', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.timestamps(true, true);
    table.unique(['user_id', 'email']);
    table.index(['user_id', 'email']);
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('contacts');
};
