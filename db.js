const { Pool } = require('pg');
const pool = new Pool({
  user: 'roelyoon',
  password: 'love012',
  host: '35.203.145.230',
  port: 5432, // default Postgres port
  database: 'ISK'
});
pool.connect()
.then(() => {
    console.log('Connected to PostgreSQL database');
})
.catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
});
module.exports = {
  query: (text, params) => pool.query(text, params)
};