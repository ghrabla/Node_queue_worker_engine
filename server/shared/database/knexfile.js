const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const common = {
  migrations: {
    directory: __dirname + '/migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: __dirname + '/seeds'
  }
};

module.exports = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    ...common
  },

  production: {
    client: process.env.DB_CLIENT,
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: { min: 2, max: 10 },
    ...common
  }
};