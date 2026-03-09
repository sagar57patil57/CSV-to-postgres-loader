require('dotenv').config();

const config = {
  port: process.env.PORT || 3003,
  csvFilePath: process.env.CSV_FILE_PATH || './data/users.csv',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'postgres',
  },
};

module.exports = config;
