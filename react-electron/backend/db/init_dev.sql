-- Aktiviraj foreign key podršku (važno za SQLite)
PRAGMA foreign_keys = ON;

-- ----- USERS -----
CREATE TABLE IF NOT EXISTS Users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT CHECK(role IN ('admin', 'participant')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ubacivanje jednog admina s hashiranom lozinkom
-- Ovdje ide hash iz bcrypt-a, npr. $2b$10$...
INSERT OR IGNORE INTO Users (id, name, email, password_hash, role)
VALUES (
    'admin-uuid',
    'Admin',
    'admin@example.com',
    '$2b$10$abcdefgh1234567890hashexample', -- zamijeni stvarnim hashom
    'admin'
);

-- Ubacivanje testnog ispitanika
INSERT OR IGNORE INTO Users (id, name, email, role)
VALUES (
    'participant-uuid',
    'Test Participant',
    'participant@example.com',
    'participant'
);

-- ----- IMAGES -----
CREATE TABLE IF NOT EXISTS Images (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    method TEXT NOT NULL
);

-- Ubacivanje testnih slika
INSERT OR IGNORE INTO Images (id, filename, method) VALUES 
('img-uuid-1', 'image1.png', 'original'),
('img-uuid-2', 'image1_bw.png', 'grayscale'),
('img-uuid-3', 'image1_colorized_methodA.png', 'methodA');

-- ----- RATINGS -----
CREATE TABLE IF NOT EXISTS Ratings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    image_id TEXT NOT NULL,
    score INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    time_ms INTEGER,
    FOREIGN KEY(user_id) REFERENCES Users(id),
    FOREIGN KEY(image_id) REFERENCES Images(id)
);

-- Ubacivanje testne ocjene
INSERT OR IGNORE INTO Ratings (id, user_id, image_id, score, time_ms)
VALUES ('rating-uuid-1','participant-uuid','img-uuid-3',4,1500);
