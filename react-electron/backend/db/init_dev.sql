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

-- Ubacivanje slika
INSERT OR IGNORE INTO Images (id, filename, method) VALUES 
('img-uuid-1', '0807.png', 'original'),
('img-uuid-2', '0821.png', 'original'),
('img-uuid-3', '0833.png', 'original'),
('img-uuid-4', '0844.png', 'original'),
('img-uuid-5', '0882.png', 'original'),
('img-uuid-6', 'ILSVRC2012_val_00041580.JPEG', 'original'),
('img-uuid-7', 'ILSVRC2012_val_00046524.JPEG', 'original'),
('img-uuid-8', 'ILSVRC2012_val_00046834.JPEG', 'original'),
('img-uuid-9', '0807.png', 'methodA'),
('img-uuid-10', '0821.png', 'methodA'),
('img-uuid-11', '0833.png', 'methodA'),
('img-uuid-12', '0844.png', 'methodA'),
('img-uuid-13', '0882.png', 'methodA'),
('img-uuid-14', 'ILSVRC2012_val_00041580.png', 'methodA'),
('img-uuid-15', 'ILSVRC2012_val_00046524.png', 'methodA'),
('img-uuid-16', 'ILSVRC2012_val_00046834.png', 'methodA'),
('img-uuid-17', '0807.png', 'methodB'),
('img-uuid-18', '0821.png', 'methodB'),
('img-uuid-19', '0833.png', 'methodB'),
('img-uuid-20', '0844.png', 'methodB'),
('img-uuid-21', '0882.png', 'methodB'),
('img-uuid-22', 'ILSVRC2012_val_00041580.JPEG', 'methodB'),
('img-uuid-23', 'ILSVRC2012_val_00046524.JPEG', 'methodB'),
('img-uuid-24', 'ILSVRC2012_val_00046834.JPEG', 'methodB'),
('img-uuid-25', '0807.png', 'methodC'),
('img-uuid-26', '0821.png', 'methodC'),
('img-uuid-27', '0833.png', 'methodC'),
('img-uuid-28', '0844.png', 'methodC'),
('img-uuid-29', '0882.png', 'methodC'),
('img-uuid-30', 'ILSVRC2012_val_00041580.JPEG', 'methodC'),
('img-uuid-31', 'ILSVRC2012_val_00046524.JPEG', 'methodC'),
('img-uuid-32', 'ILSVRC2012_val_00046834.JPEG', 'methodC');



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

