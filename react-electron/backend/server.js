const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const cors = require("cors");
const uuid = require("uuid");
const { error } = require("console");
const { number } = require("framer-motion");

const app = express();
const PORT = 3001;

// --- CORS
app.use(cors());

app.use(express.json());

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


// --- Zapis korisnika ---
app.post("/api/users" , (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({error: "Ime je obavezno"});

  const userId = uuid.v4();

  const query = `
    INSERT INTO Users (id, name, role)
    VALUES (?, ?, ?)
  `

  db.run(query, [userId, name.trim(), 'participant'], (err) => {
    if (err){
      console.error("Database error", err.message);
      return res.status(500).json({error: err.message})
    }

    res.json({
      success: true,
      userId,
      name,
    });

  // TODO: Dodati ovo u frontend,
  //  kako bi se userId mogao posalati kod zapisa ocjena

  // localStorage.setItem("userId", data.userId);

  //ovo ce kasnije biti za bekend
  // const userId = localStorage.getItem("userId");
  });

});

// --- Dohvat slika ---
// app.get("/api/images", (req, res) => {
//   const baseDir = path.join(__dirname, "images");

//   try {
//     const methods = fs.readdirSync(baseDir); // folders inside /images (original, grayscale, metodoA...)

//     const result = methods.map((method) => {
//       const methodDir = path.join(baseDir, method);
//       const files = fs.readdirSync(methodDir);

//       return {
//         method,
//         images: files.map((fname) => ({
//           filename: fname,
//           url: `http://localhost:3001/images/${method}/${fname}`,
//         })),
//       };
//     });

//     res.json(result);
//   } catch (error) {
//     console.error("Greška čitanja slika:", error);
//     res.status(500).json({ error: "Ne mogu pročitati slike." });
//   }
// });

// --- Dohvat slika grupiran po originalu ---
app.get("/api/images", (req, res) => {

  const baseDir = path.join(__dirname, "images");
  const originalDir = path.join(baseDir, "original"); //direktorij originalnih slika
  const methodDirs = ["methodA", "methodB"]; //direktoriji koje gleda za verzije
  const numberOfImages = 20 // koliko slika zelimo

  try {
    let originals = fs.readdirSync(originalDir)
      .filter(f => /\.(png|jpg|jpeg)$/i.test(f)) //provjera da je .jpg ili .png a ne npr .txt
      .sort(() => Math.random() - 0.5)
      .slice(0,numberOfImages);


    db.all("SELECT id, filename, method FROM Images", [], (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({error: err.message});
      }

      const imageMap = {};
      rows.forEach((row) => {
        imageMap[`${row.method}|${row.filename}`] = row.id;
      });


      const pairs = originals.map((originalImage) => {
        const baseName = path.parse(originalImage).name;

        const original = {
          id: imageMap[`original|${originalImage}`],
          filename: originalImage,
          url: `http://localhost:3001/images/original/${originalImage}`,
        };
        const variants = {};

        methodDirs.forEach((method) => {
          const methodDir = path.join(baseDir, method);
          const methodFiles = fs.readdirSync(methodDir);

          //naziv slike treba zapoceti isto npr: image1.png i image1_colorized_methodA.png
          const match = methodFiles.find((f) => f.startsWith(baseName));

          if (match){
            variants[method] = {
              id: imageMap[`${method}|${match}`],
              filename: match,
              url: `http://localhost:3001/images/${method}/${match}`,
            };
          }
        });

        return {
          baseName,
          original,
          variants
        }
      });

      res.json(pairs);
    });
  } catch (err){
    console.error(err);
    res.status(500).json({error: "Failed to load image"});
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

// --- Zapis ocjena ---
app.post("/api/ratings", (req, res) => {
  //TODO: na frontendu promijeniti da se ovo salje u req, a ne link na sliku
  //ovako treba biti format 
  const { ratingA, ratingB, idA, idB, userId, time_ms } = req.body;

  if (!userId || !idA || !idB) {
    return res.status(400).json({error: "Nedostaju podatci"});
  }


  const ratingIdA = uuid.v4();
  const ratingIdB = uuid.v4();
  //TODO: dodaj ovo za time_ms
  // id, user_id, image_id, score, time_ms? 
  const query = `
    INSERT INTO Ratings (id, user_id, image_id, score, time_ms )
    VALUES (?, ?, ?, ? ,?)
  ` 
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    // Sprema slike A
    db.run(
      query, 
      [ratingIdA, userId, idA, ratingA, time_ms || '0'], (err) =>{
        if (err){
          db.run("ROLLBACK");
          return res.status(500).json({error: err.message});
        }
      });
    // Sprema slike B
    db.run(
      query,
      [ratingIdB, userId, idB, ratingB, time_ms || '0'], (err) => {
        if (err){
          db.run("ROLLBACK");
          return res.status(500).json({error: err.message});
        }
      });
    // Ako nije bilo gresaka, zapisuje obe
    db.run("COMMIT", () => {
      res.json({
        success: true,
        ratings: [
          { ratingId: ratingIdA, imageId: idA, score: ratingA },
          { ratingId: ratingIdB, imageId: idB, score: ratingB },
        ]
      });
    });
  });
});


// --- Pokreni server ---
app.listen(PORT, () => {
  console.log(`🚀 Backend server pokrenut na portu ${PORT}`);
});
