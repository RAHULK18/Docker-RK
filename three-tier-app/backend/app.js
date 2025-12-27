const express = require('express');
const mysql = require('mysql2');

const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.get('/data', (req, res) => {
  db.query('SELECT NOW() as time', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});
