const { Pool } = require('pg');
const pool = new Pool({
  user: 'roelyoon',
  password: 'love012',
  host: 'localhost',
  port: 0, // default Postgres port
  database: 'ISK'
});
module.exports = {
  query: (text, params) => pool.query(text, params)
};