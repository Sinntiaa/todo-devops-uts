const { Pool } = require('pg');
const { createApp } = require('./app');

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'todo',
  password: process.env.DB_PASSWORD || 'todo123',
  database: process.env.DB_NAME || 'tododb',
  port: 5432,
});

const port = process.env.PORT || 3000;
createApp(pool).listen(port, () => console.log('Backend jalan di port ' + port));
