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
-- Ubacivanje testnih ispitanika
INSERT OR IGNORE INTO Users (id, name, email, role)
VALUES 
    ('participant-uuid-001', 'Test Participant 1', 'participant1@example.com', 'participant'),
    ('participant-uuid-002', 'Test Participant 2', 'participant2@example.com', 'participant'),
    ('participant-uuid-003', 'Test Participant 3', 'participant3@example.com', 'participant'),
    ('participant-uuid-004', 'Test Participant 4', 'participant4@example.com', 'participant'),
    ('participant-uuid-005', 'Test Participant 5', 'participant5@example.com', 'participant'),
    ('participant-uuid-006', 'Test Participant 6', 'participant6@example.com', 'participant'),
    ('participant-uuid-007', 'Test Participant 7', 'participant7@example.com', 'participant'),
    ('participant-uuid-008', 'Test Participant 8', 'participant8@example.com', 'participant'),
    ('participant-uuid-009', 'Test Participant 9', 'participant9@example.com', 'participant'),
    ('participant-uuid-010', 'Test Participant 10', 'participant10@example.com', 'participant'),
    ('participant-uuid-011', 'Test Participant 11', 'participant11@example.com', 'participant'),
    ('participant-uuid-012', 'Test Participant 12', 'participant12@example.com', 'participant'),
    ('participant-uuid-013', 'Test Participant 13', 'participant13@example.com', 'participant'),
    ('participant-uuid-014', 'Test Participant 14', 'participant14@example.com', 'participant'),
    ('participant-uuid-015', 'Test Participant 15', 'participant15@example.com', 'participant'),
    ('participant-uuid-016', 'Test Participant 16', 'participant16@example.com', 'participant'),
    ('participant-uuid-017', 'Test Participant 17', 'participant17@example.com', 'participant'),
    ('participant-uuid-018', 'Test Participant 18', 'participant18@example.com', 'participant'),
    ('participant-uuid-019', 'Test Participant 19', 'participant19@example.com', 'participant'),
    ('participant-uuid-020', 'Test Participant 20', 'participant20@example.com', 'participant');


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
('img-uuid-24', 'ILSVRC2012_val_00046834.JPEG', 'methodB');



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

-- Ubacivanje testnih ocjena
-- Ubacivanje ocjena: svaki korisnik ocjenjuje sve slike dobivene metodom
-- Slike dobivene metodom: img-uuid-3, img-uuid-6

INSERT OR IGNORE INTO Ratings (id, user_id, image_id, score, time_ms) VALUES
-- participant-uuid-001
('rating-uuid-001', 'participant-uuid-001', 'img-uuid-3', 5, 1320),
('rating-uuid-002', 'participant-uuid-001', 'img-uuid-6', 4, 1450),

-- participant-uuid-002
('rating-uuid-003', 'participant-uuid-002', 'img-uuid-3', 3, 1780),
('rating-uuid-004', 'participant-uuid-002', 'img-uuid-6', 5, 1600),

-- participant-uuid-003
('rating-uuid-005', 'participant-uuid-003', 'img-uuid-3', 4, 1670),
('rating-uuid-006', 'participant-uuid-003', 'img-uuid-6', 2, 1900),

-- participant-uuid-004
('rating-uuid-007', 'participant-uuid-004', 'img-uuid-3', 2, 1940),
('rating-uuid-008', 'participant-uuid-004', 'img-uuid-6', 3, 2100),

-- participant-uuid-005
('rating-uuid-009', 'participant-uuid-005', 'img-uuid-3', 5, 980),
('rating-uuid-010', 'participant-uuid-005', 'img-uuid-6', 4, 1200),

-- participant-uuid-006
('rating-uuid-011', 'participant-uuid-006', 'img-uuid-3', 1, 3100),
('rating-uuid-012', 'participant-uuid-006', 'img-uuid-6', 3, 2750),

-- participant-uuid-007
('rating-uuid-013', 'participant-uuid-007', 'img-uuid-3', 4, 1750),
('rating-uuid-014', 'participant-uuid-007', 'img-uuid-6', 2, 1600),

-- participant-uuid-008
('rating-uuid-015', 'participant-uuid-008', 'img-uuid-3', 3, 2020),
('rating-uuid-016', 'participant-uuid-008', 'img-uuid-6', 4, 1850),

-- participant-uuid-009
('rating-uuid-017', 'participant-uuid-009', 'img-uuid-3', 2, 2600),
('rating-uuid-018', 'participant-uuid-009', 'img-uuid-6', 5, 2300),

-- participant-uuid-010
('rating-uuid-019', 'participant-uuid-010', 'img-uuid-3', 5, 1210),
('rating-uuid-020', 'participant-uuid-010', 'img-uuid-6', 3, 1500),

-- participant-uuid-011
('rating-uuid-021', 'participant-uuid-011', 'img-uuid-3', 4, 1880),
('rating-uuid-022', 'participant-uuid-011', 'img-uuid-6', 2, 1700),

-- participant-uuid-012
('rating-uuid-023', 'participant-uuid-012', 'img-uuid-3', 3, 2410),
('rating-uuid-024', 'participant-uuid-012', 'img-uuid-6', 4, 2000),

-- participant-uuid-013
('rating-uuid-025', 'participant-uuid-013', 'img-uuid-3', 5, 980),
('rating-uuid-026', 'participant-uuid-013', 'img-uuid-6', 3, 1100),

-- participant-uuid-014
('rating-uuid-027', 'participant-uuid-014', 'img-uuid-3', 1, 3500),
('rating-uuid-028', 'participant-uuid-014', 'img-uuid-6', 4, 3200),

-- participant-uuid-015
('rating-uuid-029', 'participant-uuid-015', 'img-uuid-3', 2, 2700),
('rating-uuid-030', 'participant-uuid-015', 'img-uuid-6', 5, 2500),

-- participant-uuid-016
('rating-uuid-031', 'participant-uuid-016', 'img-uuid-3', 5, 1450),
('rating-uuid-032', 'participant-uuid-016', 'img-uuid-6', 4, 1600),

-- participant-uuid-017
('rating-uuid-033', 'participant-uuid-017', 'img-uuid-3', 3, 2200),
('rating-uuid-034', 'participant-uuid-017', 'img-uuid-6', 2, 2000),

-- participant-uuid-018
('rating-uuid-035', 'participant-uuid-018', 'img-uuid-3', 4, 1800),
('rating-uuid-036', 'participant-uuid-018', 'img-uuid-6', 5, 1750),

-- participant-uuid-019
('rating-uuid-037', 'participant-uuid-019', 'img-uuid-3', 2, 3000),
('rating-uuid-038', 'participant-uuid-019', 'img-uuid-6', 3, 2800),

-- participant-uuid-020
('rating-uuid-039', 'participant-uuid-020', 'img-uuid-3', 5, 1100),
('rating-uuid-040', 'participant-uuid-020', 'img-uuid-6', 4, 1300);