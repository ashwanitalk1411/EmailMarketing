/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('smtp_settings', (table) => {
    table.increments('id').primary();
    table.string('host', 255).notNullable();
    table.integer('port').notNullable().defaultTo(587);
    table.string('username', 255).notNullable();
    table.string('password', 255).notNullable();
    table.enum('encryption', ['tls', 'ssl', 'none']).notNullable().defaultTo('tls');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('smtp_settings');
};
