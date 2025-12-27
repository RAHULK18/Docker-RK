const express = require("express");
const mysql = require("mysql2");
const os = require("os");

const app = express();
app.use(express.json());

const MAX_RETRIES = 10;
let retries = 0;
let db;

// --------------------
// DB connection retry
// --------------------
function connectWithRetry() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  db.connect(err => {
    if (err) {
      retries++;
      console.error(`❌ DB connection failed (${retries})`, err.message);

      if (retries < MAX_RETRIES) {
        setTimeout(connectWithRetry, 5000);
      } else {
        process.exit(1);
      }
    } else {
      console.log("✅ Connected to MySQL");
      startServer();
    }
  });
}

// --------------------
// API Server
// --------------------
function startServer() {

  // Health check
  app.get("/health", (req, res) => res.send("OK"));

  // POST metrics with custom input
  app.post("/api/metrics", (req, res) => {
    const { service_name, environment, notes } = req.body;

    if (!service_name || !environment) {
      return res.status(400).json({ error: "service_name and environment required" });
    }

    const cpuLoad = os.loadavg()[0];
    const totalMem = Math.round(os.totalmem() / 1024 / 1024);
    const freeMem = Math.round(os.freemem() / 1024 / 1024);
    const hostname = os.hostname();

    const sql = `
      INSERT INTO system_metrics
      (service_name, environment, hostname, cpu_load, total_memory_mb, free_memory_mb, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [service_name, environment, hostname, cpuLoad, totalMem, freeMem, notes || null],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "DB insert failed" });
        }
        res.json({ message: "Metrics stored", id: result.insertId });
      }
    );
  });

  // GET all metrics
  app.get("/api/metrics", (req, res) => {
    db.query(
      "SELECT * FROM system_metrics ORDER BY created_at DESC",
      (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
      }
    );
  });

  app.listen(3000, () =>
    console.log("🚀 Backend running on port 3000")
  );
}

connectWithRetry();