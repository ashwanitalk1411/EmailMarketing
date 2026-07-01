/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('email_logs', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('recipient_email', 255).notNullable();
    table.string('subject', 500).notNullable();
    table.enum('status', ['pending', 'sending', 'sent', 'failed']).notNullable().defaultTo('pending');
    table.text('error_message').nullable();
    table.timestamp('sent_at').nullable();
    table.timestamps(true, true);
    table.index(['user_id', 'status']);
    table.index('created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('email_logs');
};
