const express = require('express');
const mysql = require('mysql2');

const app = express();

const MAX_RETRIES = 10;
let retries = 0;

function connectWithRetry() {
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  db.connect(err => {
    if (err) {
      retries++;
      console.error(`❌ DB connection failed (attempt ${retries}):`, err.message);

      if (retries < MAX_RETRIES) {
        console.log('⏳ Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
      } else {
        console.error('🚨 Max retries reached. Exiting.');
        process.exit(1);
      }
    } else {
      console.log('✅ Connected to MySQL');

      app.get('/data', (req, res) => {
        db.query('SELECT NOW() as time', (err, result) => {
          if (err) return res.status(500).json(err);
          res.json(result);
        });
      });

      app.get('/health', (req, res) => res.send('OK'));

      app.listen(3000, () =>
        console.log('🚀 Backend running on port 3000')
      );
    }
  });
}

connectWithRetry();