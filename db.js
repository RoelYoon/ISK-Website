const { Pool } = require('pg');
const pool = new Pool({
  user: 'roelyoon',
  password: 'love012',
  host: '35.203.145.230',
  port: 8099, // default Postgres port
  database: 'ISK'
});
module.exports = {
  query: (text, params) => pool.query(text, params)
};