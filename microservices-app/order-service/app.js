const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: "order-db",
  user: "root",
  password: "root",
  database: "orderdb"
});

app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/orders", (req, res) => {
  const { item } = req.body;

  if (!item) {
    return res.status(400).json({ error: "Item is required" });
  }

  db.query(
    "INSERT INTO orders (item) VALUES (?)",
    [item],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Order added", id: result.insertId });
    }
  );
});

app.listen(3002, () =>
  console.log("Order Service running on 3002")
);
