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

-- ----- IMAGES -----
CREATE TABLE IF NOT EXISTS Images (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    method TEXT NOT NULL
);

-- Ubacivanje testnih slika
INSERT OR IGNORE INTO Images (id, filename, method) VALUES 
('img-uuid-10', 'ILSVRC2012_val_00041580.JPEG', 'original'),
('img-uuid-11', 'ILSVRC2012_val_00046524.JPEG', 'original'),
('img-uuid-12', 'ILSVRC2012_val_00046834.JPEG', 'original'),
('img-uuid-13', 'ILSVRC2012_val_00041580.JPEG', 'methodA'),
('img-uuid-14', 'ILSVRC2012_val_00046524.JPEG', 'methodA'),
('img-uuid-15', 'ILSVRC2012_val_00046834.JPEG', 'methodA');


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

