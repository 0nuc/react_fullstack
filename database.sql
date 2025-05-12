-- Création de la base de données
CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des tables du restaurant
CREATE TABLE IF NOT EXISTS tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number VARCHAR(10) NOT NULL UNIQUE,
    seats INT NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    number_of_people INT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    note TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table de liaison réservations-tables
CREATE TABLE IF NOT EXISTS reservation_tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    table_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id),
    FOREIGN KEY (table_id) REFERENCES tables(id)
);

-- Table des items du menu
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category ENUM('entrées', 'plats', 'desserts', 'boissons') NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion d'un utilisateur admin par défaut avec mot de passe: admin123
INSERT INTO users (email, password, firstName, lastName, phone, role) VALUES 
('admin@restaurant.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'Restaurant', '0123456789', 'admin');

-- Insertion d'un utilisateur client de test avec mot de passe: client123
INSERT INTO users (email, password, firstName, lastName, phone, role) VALUES 
('client@restaurant.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Client', 'Test', '0687654321', 'client');

-- Insertion de tables par défaut
INSERT INTO tables (number, seats) VALUES 
('T1', 2),
('T2', 2),
('T3', 4),
('T4', 4),
('T5', 6),
('T6', 6);

-- Insertion de quelques plats dans le menu
INSERT INTO menu_items (name, description, price, category) VALUES
('Salade César', 'Laitue romaine, croûtons, parmesan, sauce césar', 12.50, 'entrées'),
('Soupe à l''oignon', 'Soupe à l''oignon gratinée', 9.50, 'entrées'),
('Steak-frites', 'Steak de bœuf, frites maison, sauce au poivre', 25.00, 'plats'),
('Saumon grillé', 'Saumon frais grillé, légumes de saison', 28.00, 'plats'),
('Tiramisu', 'Tiramisu traditionnel italien', 8.50, 'desserts'),
('Crème brûlée', 'Crème brûlée à la vanille', 7.50, 'desserts'),
('Vin rouge', 'Verre de vin rouge de la maison', 6.00, 'boissons'),
('Eau minérale', 'Bouteille d''eau minérale 75cl', 4.50, 'boissons');