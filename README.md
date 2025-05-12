# API de Réservation de Restaurant

Une API REST complète pour la gestion des réservations d'un restaurant, développée avec Node.js, Express et MySQL.

## Fonctionnalités

- Authentification des utilisateurs (clients et administrateurs)
- Gestion des réservations
- Gestion du menu du restaurant
- Gestion des tables
- Attribution automatique des tables selon le nombre de personnes

## Technologies utilisées

- Node.js
- Express.js
- MySQL
- Sequelize (ORM)
- JWT pour l'authentification
- bcryptjs pour le hachage des mots de passe

## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd restaurant-reservation-api
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
- Copier le fichier `.env.example` en `.env`
- Modifier les variables selon votre configuration

4. Créer la base de données :
```bash
mysql -u root -p < database.sql
```

5. Démarrer le serveur :
```bash
npm start
```

## Structure du projet

```
src/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── menuController.js
│   ├── reservationController.js
│   └── tableController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── index.js
│   ├── menuItem.js
│   ├── reservation.js
│   ├── table.js
│   └── user.js
├── routes/
│   ├── authRoutes.js
│   ├── menuRoutes.js
│   ├── reservationRoutes.js
│   └── tableRoutes.js
└── server.js
```

## Documentation de l'API

### Authentification

#### Création de compte
- **POST** `/api/auth/signup`
- Corps de la requête :
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0123456789"
}
```

#### Connexion
- **POST** `/api/auth/login`
- Corps de la requête :
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Réservations

#### Obtenir toutes les réservations (admin)
- **GET** `/api/reservations`
- Header : `Authorization: Bearer [token]`

#### Obtenir mes réservations
- **GET** `/api/reservations/my`
- Header : `Authorization: Bearer [token]`

#### Créer une réservation
- **POST** `/api/reservations`
- Header : `Authorization: Bearer [token]`
- Corps de la requête :
```json
{
  "numberOfPeople": 4,
  "date": "2024-06-20",
  "time": "19:00",
  "note": "Près de la fenêtre si possible"
}
```

#### Modifier une réservation
- **PUT** `/api/reservations/:id`
- Header : `Authorization: Bearer [token]`
- Corps de la requête : (mêmes champs que la création)

#### Annuler une réservation
- **DELETE** `/api/reservations/:id`
- Header : `Authorization: Bearer [token]`

#### Valider une réservation (admin)
- **PATCH** `/api/reservations/:id/validate`
- Header : `Authorization: Bearer [token]`

### Menu

#### Obtenir le menu
- **GET** `/api/menu`
- Paramètres optionnels : `?category=plats&maxPrice=25`

#### Ajouter un item au menu (admin)
- **POST** `/api/menu`
- Header : `Authorization: Bearer [token]`
- Corps de la requête :
```json
{
  "name": "Steak-frites",
  "description": "Steak de bœuf, frites maison",
  "price": 25.00,
  "category": "plats",
  "imageUrl": "url_image"
}
```

### Tables

#### Obtenir toutes les tables
- **GET** `/api/tables`
- Header : `Authorization: Bearer [token]`

#### Vérifier la disponibilité
- **GET** `/api/tables/availability?date=2024-06-20&time=19:00`
- Header : `Authorization: Bearer [token]`

## Répartition du travail

- **Nicolas** : 
  - Configuration initiale du projet
  - Modèles de données
  - Système d'authentification
  - Documentation

- **Sarah** :
  - Gestion des réservations
  - Attribution des tables
  - Tests unitaires

- **Mohamed** :
  - Gestion du menu
  - Filtres et recherche
  - API endpoints

- **Julie** :
  - Gestion des tables
  - Validation des données
  - Sécurité

## Licence

MIT