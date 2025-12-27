const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: ProcessingInstruction.env.USER_DB_HOST,
  user: ProcessingInstruction.env.USER_DB_USER,
  password: ProcessingInstruction.env.USER_DB_PASSWORD ,
  database: ProcessingInstruction.env.USER_DB_NAME
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/users", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  db.query(
    "INSERT INTO users (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User added", id: result.insertId });
    }
  );
});

app.listen(3001, () =>
  console.log("User Service running on 3001")
);
