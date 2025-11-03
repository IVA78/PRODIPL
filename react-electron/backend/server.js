const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const app = express();
const PORT = 3001;

// --- Kreiraj folder db ako ne postoji ---
const dbDir = path.resolve(__dirname, "db");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);

// --- Spoji se na bazu ---
const dbPath = path.join(dbDir, "database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Greška pri otvaranju baze:", err.message);
  } else {
    console.log("✅ Spojeno na SQLite bazu:", dbPath);

    // --- Pokreni SQL inicijalizaciju ---
    const initSqlPath = path.join(dbDir, "init_dev.sql");
    if (fs.existsSync(initSqlPath)) {
      const sql = fs.readFileSync(initSqlPath, "utf8");

      // Split statements by semicolon (;) and run each
      sql
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0)
        .forEach((stmt) => {
          db.run(stmt, (err) => {
            if (err)
              console.error("❌ Greška pri izvršavanju SQL:", err.message);
          });
        });

      console.log("✅ init_dev.sql izvršen");
    } else {
      console.warn("⚠️ init_dev.sql nije pronađen");
    }
  }
});

// --- Test ruta ---
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend radi ✅" });
});

// --- Test dohvat korisnika ---
app.get("/api/test-users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- Pokreni server ---
app.listen(PORT, () => {
  console.log(`🚀 Backend server pokrenut na portu ${PORT}`);
});
