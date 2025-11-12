const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3001;

// --- CORS
app.use(cors());

// --- Posluživanje slika
app.use("/images", express.static(path.join(__dirname, "images")));

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

// --- TESTNI ENDPOINTI

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

// -- ENDPOINTI ZA APLIKACIJU

// --- Dohvat korisnika ---
app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- Dohvat slika ---
app.get("/api/images", (req, res) => {
  const baseDir = path.join(__dirname, "images");

  try {
    const methods = fs.readdirSync(baseDir); // folders inside /images (original, grayscale, metodoA...)

    const result = methods.map((method) => {
      const methodDir = path.join(baseDir, method);
      const files = fs.readdirSync(methodDir);

      return {
        method,
        images: files.map((fname) => ({
          filename: fname,
          url: `http://localhost:3001/images/${method}/${fname}`,
        })),
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Greška čitanja slika:", error);
    res.status(500).json({ error: "Ne mogu pročitati slike." });
  }
});

// --- Dohvat ocjena ---
app.get("/api/ratings", (req, res) => {
  const query = `
    SELECT 
      r.id, r.user_id, r.image_id, r.score, r.time_ms, r.timestamp,
      i.filename, i.method
    FROM Ratings r
    JOIN Images i ON r.image_id = i.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- Pokreni server ---
app.listen(PORT, () => {
  console.log(`🚀 Backend server pokrenut na portu ${PORT}`);
});
