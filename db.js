const { Pool } = require('pg');
require('dotenv').config()
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.PORT,
  database: process.env.DB
});
module.exports = {
  query: (text, params) => pool.query(text, params)
};