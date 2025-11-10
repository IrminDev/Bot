import { Client } from 'pg';

// Hardcoded para testing
const client = new Client({
  host: 'localhost',
  port: 5433,
  database: 'bot-detection',
  user: 'admin',
  password: 'secretKey'
});

(async () => {
  try {
    console.log('checkdb: DATABASE_URL:', process.env.DATABASE_URL);
    console.log('checkdb: Attempting connection...');
    await client.connect();
    const res = await client.query('SELECT version(), current_database();');
    console.log('checkdb: OK', res.rows[0]);
  } catch (err) {
    console.error('checkdb: Connection error', err.message);
    console.error('checkdb: Full error:', err);
  } finally {
    await client.end();
  }
})();
