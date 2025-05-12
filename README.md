# API de Réservation de Restaurant

Une API REST complète pour la gestion des réservations d'un restaurant, développée avec Node.js, Express et MySQL.

## 🚀 Fonctionnalités

- Authentification sécurisée (JWT)
- Gestion des réservations
- Gestion du menu du restaurant
- Gestion des tables
- Rôles utilisateurs (Admin/Client)

## 📋 Prérequis

- Node.js
- MySQL (MAMP)
- npm ou yarn

## 🛠 Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
cd restaurant-reservation-api
```

2. Installer les dépendances
```bash
npm install
```

3. Configuration de la base de données
- Démarrer MAMP
- Créer une base de données nommée `restaurant_db`
- Importer le fichier `database.sql`

4. Configuration de l'environnement
Créer un fichier `.env` avec :
```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=root
DB_NAME=restaurant_db
DB_PORT=7006
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=24h
```

5. Démarrer le serveur
```bash
node src/server.js
```

## 📚 Documentation API

### 🔐 Authentication

#### Créer un compte
```http
POST /api/auth/signup
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "0612345678"
}
```

#### Se connecter
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

### 🍽 Menu

#### Obtenir le menu
```http
GET /api/menu
```

#### Ajouter un plat (Admin)
```http
POST /api/menu
Authorization: Bearer [token]
Content-Type: application/json

{
    "name": "Pizza Margherita",
    "description": "Tomate, mozzarella, basilic",
    "price": 12.90,
    "category": "Pizzas"
}
```

### 🪑 Tables

#### Voir toutes les tables
```http
GET /api/tables
Authorization: Bearer [token]
```

#### Ajouter une table (Admin)
```http
POST /api/tables
Authorization: Bearer [token]
Content-Type: application/json

{
    "number": "T1",
    "seats": 4
}
```

### 📅 Réservations

#### Créer une réservation
```http
POST /api/reservations
Authorization: Bearer [token]
Content-Type: application/json

{
    "numberOfPeople": 4,
    "date": "2024-03-20",
    "time": "19:00",
    "note": "Près de la fenêtre"
}
```

#### Voir ses réservations
```http
GET /api/reservations/my
Authorization: Bearer [token]
```

## 🔑 Comptes de test

### Admin
```json
{
    "email": "admin@example.com",
    "password": "admin123"
}
```

### Client
```json
{
    "email": "client@example.com",
    "password": "client123"
}
```

## 📊 Structure de la base de données

### Tables principales
- users
- reservations
- tables
- menu_items
- reservation_tables

## 👥 Équipe

- **[Membre 1]** : Authentication, Menu
- **[Membre 2]** : Réservations, Tables
- **[Membre 3]** : Base de données, Tests
- **[Membre 4]** : Documentation, API

## 📝 Statuts HTTP

- 200 : Succès
- 201 : Création réussie
- 400 : Requête invalide
- 401 : Non authentifié
- 403 : Non autorisé
- 404 : Ressource non trouvée
- 500 : Erreur serveur

## 🔒 Sécurité

- Authentification JWT
- Hachage des mots de passe
- Validation des données
- Protection CORS