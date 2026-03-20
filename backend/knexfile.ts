import type { Knex } from "knex";
import dotenv from 'dotenv';
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: { client: "sqlite3", connection: { filename: './dev.sqlite3' }, useNullAsDefault: true, migrations: { directory: './src/db/migrations' } },
  production: { client: "pg", connection: process.env.DATABASE_URL, pool: { min: 2, max: 10 }, migrations: { tableName: "knex_migrations", directory: './src/db/migrations' } }
};
export default config;
