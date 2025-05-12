-- Création de la base de données
CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;
-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Table des tables du restaurant
CREATE TABLE IF NOT EXISTS Tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number VARCHAR(10) NOT NULL UNIQUE,
    seats INT NOT NULL,
    isAvailable BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Table des réservations
CREATE TABLE IF NOT EXISTS Reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    numberOfPeople INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    note TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id)
);
-- Table de liaison réservations-tables
CREATE TABLE IF NOT EXISTS ReservationTables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservationId INT NOT NULL,
    tableId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reservationId) REFERENCES Reservations(id),
    FOREIGN KEY (tableId) REFERENCES Tables(id)
);
-- Table des items du menu
CREATE TABLE IF NOT EXISTS MenuItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category ENUM('entrées', 'plats', 'desserts', 'boissons') NOT NULL,
    imageUrl VARCHAR(255),
    isAvailable BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Insertion d'un utilisateur admin par défaut
INSERT INTO Users (
        email,
        password,
        firstName,
        lastName,
        phone,
        role
    )
VALUES (
        'admin@restaurant.com',
        '$2a$10$XLq0P1Qx8H.hGX9X9vYX9eVJZz6X5X5X5X5X5X5X5X5X5X5X5X',
        -- Mot de passe: admin123
        'Admin',
        'Restaurant',
        '0123456789',
        'admin'
    );
-- Insertion de quelques tables par défaut
INSERT INTO Tables (number, seats)
VALUES ('T1', 2),
    ('T2', 2),
    ('T3', 4),
    ('T4', 4),
    ('T5', 6),
    ('T6', 6);
-- Insertion de quelques items du menu par défaut
INSERT INTO MenuItems (name, description, price, category)
VALUES (
        'Salade César',
        'Laitue romaine, croûtons, parmesan, sauce césar',
        12.50,
        'entrées'
    ),
    (
        'Soupe à l\'oignon',
        'Soupe à l\'oignon gratinée',
        9.50,
        'entrées'
    ),
    (
        'Steak-frites',
        'Steak de bœuf, frites maison, sauce au poivre',
        25.00,
        'plats'
    ),
    (
        'Saumon grillé',
        'Saumon frais grillé, légumes de saison',
        28.00,
        'plats'
    ),
    (
        'Tiramisu',
        'Tiramisu traditionnel italien',
        8.50,
        'desserts'
    ),
    (
        'Crème brûlée',
        'Crème brûlée à la vanille',
        7.50,
        'desserts'
    ),
    (
        'Vin rouge',
        'Verre de vin rouge de la maison',
        6.00,
        'boissons'
    ),
    (
        'Eau minérale',
        'Bouteille d\'eau minérale 75cl',
        4.50,
        'boissons'
    );