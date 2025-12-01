# 📚 Recipes App – Mini Projet Full-Stack

Application complète permettant de gérer des recettes, les commenter, les rechercher et les ajouter en favoris.

Projet réalisé avec :

- **Backend** : Node.js, Express, TypeScript, MongoDB (Mongoose), JWT  
- **Frontend** : React, TypeScript, Vite, Bootstrap  
- **Architecture** : Client → API REST → MongoDB Atlas

## 🚀 Fonctionnalités principales

### 🔐 Authentification

- Inscription
- Connexion
- Route protégée `/me` pour récupérer le profil utilisateur
- JWT + middleware de protection

### 🍽️ Gestion des recettes

- CRUD complet (créer, lire, modifier, supprimer ses recettes)
- Recherche (`q`)
- Pagination (`page`, `limit`)
- Affichage et gestion des favoris
- Compteur automatique des favoris

### 💬 Commentaires

- Ajouter un commentaire
- Lister les commentaires
- Supprimer ses propres commentaires

### ⭐ Favoris

- Ajouter/retirer des favoris
- Page dédiée

## 🧱 Architecture du projet

```
recipes-app/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
      server.ts

  frontend/
    src/
      api/
      components/
      context/
      pages/
      App.tsx
      main.tsx

  README.md
```

## 🛠️ Installation & Lancement

### 1️⃣ Cloner le projet
```bash
git clone git@github.com:alouiMK/recipes-app.git
cd recipes-app
```

## 🔧 Backend

### Installer les dépendances
```bash
cd backend
npm install
```

### Créer `.env`
```env
PORT=4000
MONGODB_URI=<YOUR_MONGODB_ATLAS_URI>
NODE_ENV=development
JWT_SECRET=<YOUR_JWT_SECRET>
JWT_EXPIRES_IN=7d
```

### Lancer le backend
```bash
npm run dev
```

## 🎨 Frontend

### Installer les dépendances
```bash
cd ../frontend
npm install
npm run dev
```

## 🌐 Endpoints principaux

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Recipes
```
GET    /api/recipes
GET    /api/recipes/:id
POST   /api/recipes
PUT    /api/recipes/:id
DELETE /api/recipes/:id
```

### Comments
```
GET    /api/recipes/:recipeId/comments
POST   /api/recipes/:recipeId/comments
DELETE /api/recipes/:recipeId/comments/:commentId
```

### Favorites
```
GET    /api/favorites
POST   /api/favorites/:recipeId
DELETE /api/favorites/:recipeId
```

## 🧪 Tests rapides
Exemples dans le README initial (login, create recipe, comments, favorites).

## 🛣️ Roadmap
- Upload images (Cloudinary)
- Tags/catégories
- Dark mode
- Page Admin
- Tests Jest + RTL
- Déploiement

## 👤 Auteur
**Mohamed Khalil Aloui – alouiMK**
