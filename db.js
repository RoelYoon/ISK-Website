const { Pool } = require('pg');
const pool = new Pool({
  user: 'roelyoon',
  password: 'love012',
  host: '10.138.0.2',
  port: 0, // default Postgres port
  database: 'ISK'
});
module.exports = {
  query: (text, params) => pool.query(text, params)
};