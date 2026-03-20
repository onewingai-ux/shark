import type { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (t) => { t.increments('id').primary(); t.string('username').notNullable().unique(); t.string('password_hash').notNullable(); t.timestamps(true, true); });
  await knex.schema.createTable('games', (t) => { t.increments('id').primary(); t.string('status').notNullable().defaultTo('lobby'); t.jsonb('state').notNullable().defaultTo('{}'); t.integer('created_by').unsigned().references('id').inTable('users'); t.timestamps(true, true); });
  await knex.schema.createTable('game_players', (t) => { t.increments('id').primary(); t.integer('game_id').unsigned().references('id').inTable('games').onDelete('CASCADE'); t.integer('user_id').unsigned().references('id').inTable('users'); t.boolean('is_ai').notNullable().defaultTo(false); t.integer('turn_order').notNullable(); t.timestamps(true, true); });
  await knex.schema.createTable('leaderboards', (t) => { t.integer('user_id').unsigned().references('id').inTable('users').primary(); t.integer('total_games').notNullable().defaultTo(0); t.integer('total_wins').notNullable().defaultTo(0); t.integer('highest_net_worth').notNullable().defaultTo(0); t.timestamps(true, true); });
}
export async function down(knex: Knex): Promise<void> { await knex.schema.dropTableIfExists('leaderboards'); await knex.schema.dropTableIfExists('game_players'); await knex.schema.dropTableIfExists('games'); await knex.schema.dropTableIfExists('users'); }
