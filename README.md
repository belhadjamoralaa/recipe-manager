Mini-Projet – Plateforme de gestion de
recettes de cuisine
Étudiant : Ala Eddine Belhadj Amor – MPGL2
Module : Développement des Applications Web / Framework Web Avancé
Ce document présente le rapport complet du mini-projet Recipes App, une application
Web full-stack permettant la gestion et le partage de recettes de cuisine. L’objectif est
de mettre en pratique les concepts avancés de développement d’applications Web vus
dans le cadre du module Framework Web Avancé.
1. Introduction
Dans le cadre du module Développement des Applications Web (Framework Web
Avancé), ce mini-projet a pour objectif de concevoir et développer une application Web
complète permettant aux utilisateurs de créer, consulter, commenter et ajouter en
favoris des recettes de cuisine. Le projet, intitulé Recipes App, s’appuie sur une
architecture full-stack JavaScript/TypeScript : un frontend développé avec React + Vite
et un backend basé sur Node.js + Express + MongoDB (Mongoose).
L’authentification des utilisateurs est gérée via des jetons JWT.
L’enjeu principal est de proposer une application moderne, robuste et sécurisée,
conforme aux standards professionnels actuels (API REST, séparation
frontend/backend, sécurité, UX soignée, etc.).
2. Objectifs pédagogiques
Ce mini-projet permet de mettre en pratique plusieurs compétences clés en
développement Web :
• Maîtriser le développement d’un frontend avancé avec React.js et TypeScript.
• Construire une API REST sécurisée avec Node.js / Express.
• Manipuler une base de données NoSQL avec MongoDB et l’ORM Mongoose.
• Implémenter une authentification complète par jetons JWT.
• Appliquer des bonnes pratiques de structuration (routes, controllers, middleware,
services).
• Assurer une séparation nette entre frontend et backend.
• Concevoir une interface utilisateur moderne, responsive et cohérente.
3. Fonctionnalités principales
3.1. Authentification
Le module d’authentification permet à un utilisateur de créer un compte, de se
connecter et d’accéder à son profil. Les principales fonctionnalités sont :
• Inscription des utilisateurs avec validation côté backend (email unique, mot de
passe requis, etc.).
• Connexion sécurisée avec vérification du mot de passe via bcrypt.
• Génération d’un jeton JWT signé, renvoyé au client après une authentification
réussie.
• Validation du jeton sur les routes protégées pour identifier l’utilisateur.
• Route protégée /api/auth/me permettant de récupérer les informations du profil
connecté.
3.2. Gestion des recettes
Le coeur fonctionnel de l’application repose sur la gestion des recettes. Les actions
suivantes sont possibles :
• Création d’une recette avec les champs : titre, description, liste d’ingrédients,
instructions détaillées et éventuellement une image.
• Consultation de la liste complète des recettes disponibles, avec prise en charge de
la pagination.
• Affichage du détail d’une recette (titre, description, auteur, favoris, commentaires,
etc.).
• Mise à jour d’une recette par son auteur uniquement (contrôle d’accès côté
backend).
• Suppression d’une recette par son auteur uniquement.
3.3. Recherche et pagination
Pour améliorer l’expérience utilisateur, l’application propose une recherche et une
pagination sur les listes de recettes :
• Recherche textuelle via un paramètre q permettant de filtrer les recettes par
mots-clés.
• Pagination des résultats grâce aux paramètres page et limit.
• Retour d’une structure paginée contenant la liste des recettes ainsi que les
informations de pagination.
3.4. Commentaires
Chaque recette peut être commentée par les utilisateurs authentifiés. Le module de
commentaires permet :
• Ajout d’un commentaire sur une recette (contenu textuel, auteur, date de création).
• Affichage de tous les commentaires associés à une recette donnée.
• Suppression d’un commentaire soit par l’auteur du commentaire, soit par l’auteur
de la recette.
3.5. Favoris
La fonctionnalité de favoris permet aux utilisateurs de marquer les recettes qu’ils
apprécient :
• Ajout d’une recette aux favoris de l’utilisateur connecté.
• Retrait d’une recette des favoris.
• Comptage automatique du nombre de favoris via un champ favoritesCount sur la
recette.
• Affichage d’une liste paginée des recettes favorites de l’utilisateur.
4. Architecture globale
4.1. Vue d’ensemble
L’application adopte une architecture logique en trois blocs principaux :
[React Frontend] n HTTP / JSON n [API Express] n [MongoDB Atlas]
4.2. Structure du projet
Le projet est structuré en deux dossiers principaux, séparant clairement le backend et
le frontend :
recipes-app/ backend/ controllers/ middleware/ models/ routes/ utils/
server.ts frontend/ api/ components/ context/ pages/ App.tsx
5. Backend – API REST Node.js / Express
5.1. Technologies utilisées
• Plateforme Node.js pour l’exécution côté serveur.
• Framework Express pour la création de l’API REST.
• TypeScript pour une meilleure robustesse et lisibilité du code.
• MongoDB Atlas comme base de données NoSQL hébergée dans le cloud.
• Mongoose comme ORM pour modéliser les schémas et interagir avec MongoDB.
• bcrypt pour le hachage sécurisé des mots de passe.
• jsonwebtoken pour la génération et la vérification de JWT.
5.2. Modèles MongoDB (Mongoose)
Modèle User
• Champs : username, email (unique), password.
• Hachage automatique du mot de passe avant sauvegarde.
• Méthode comparePassword() pour vérifier un mot de passe en clair par rapport
au hash stocké.
Modèle Recipe
• Champs : title, description, ingredients[], instructions, imageUrl (optionnel).
• Référence author (ObjectId vers User).
• Champ favoritesCount pour compter le nombre de favoris.
Modèle Comment
• Champs : recipe, author, content.
• Utilisation des timestamps automatiques (createdAt, updatedAt).
Modèle Favorite
• Champs : user, recipe.
• Index unique sur le couple (user, recipe) pour empêcher les doublons.
5.3. Sécurité – Middleware JWT
Un middleware dédié vérifie la présence et la validité d’un jeton JWT sur les routes qui
nécessitent une authentification :
• Lecture du header Authorization: Bearer <token>.
• Vérification et décodage du jeton à l’aide de la clé secrète.
• Récupération de l’ID utilisateur et attachement de l’objet utilisateur à req.user.
• Retour de codes d’erreur appropriés (401, 403) en cas d’absence ou d’invalidité du
jeton.
5.4. Routes principales
Routes Auth
POST /api/auth/register POST /api/auth/login GET /api/auth/me
Routes Recettes
GET /api/recipes GET /api/recipes/:id POST /api/recipes PUT /api/recipes/:id
DELETE /api/recipes/:id
Routes Commentaires
GET /api/recipes/:recipeId/comments POST /api/recipes/:recipeId/comments
DELETE /api/recipes/:recipeId/comments/:commentId
Routes Favoris
GET /api/favorites POST /api/favorites/:recipeId DELETE
/api/favorites/:recipeId
6. Frontend – React + TypeScript
6.1. Stack & organisation
• Framework React avec TypeScript pour un typage statique et une meilleure
maintenabilité.
• Vite pour le bundling et le développement rapide.
• Bootstrap associé à des styles personnalisés pour un design moderne.
• Context API pour la gestion de l’authentification et de l’état global.
• Axios pour la communication avec l’API REST.
6.2. Pages principales
• HomePage : page d’accueil avec présentation de l’application (style landing page).
• Register / Login : formulaires d’inscription et de connexion avec validations.
• RecipesListPage : affichage des recettes sous forme de cartes, avec recherche et
pagination.
• RecipeDetailPage : affichage détaillé d’une recette (contenu, favoris,
commentaires).
• RecipeFormPage : création et édition de recette.
• ProfilePage : affichage des informations de l’utilisateur.
• NotFoundPage : page 404 personnalisée.
6.3. Expérience utilisateur
• Design épuré avec une palette de couleurs modernes (violet, bleu, orange).
• Messages d’erreur clairs et mis en avant via un composant ErrorAlert.
• Indicateurs de chargement via un composant Loader pour les appels asynchrones.
• Transitions fluides entre les pages et composants.
• Validation des formulaires côté frontend avant envoi au backend.
7. Gestion des erreurs & sécurité
7.1. Backend
• Utilisation systématique de codes HTTP cohérents (400, 401, 403, 404, 500).
• Vérification de la validité des ObjectId MongoDB avant les opérations.
• Contrôle d’accès sur les opérations sensibles (modification/suppression de
recettes et commentaires).
• Gestion centralisée des erreurs pour renvoyer des réponses JSON uniformes.
7.2. Frontend
• Affichage des erreurs de l’API via un composant ErrorAlert.
• Affichage d’un Loader lors des actions nécessitant un temps de réponse
(chargement de listes, envoi de formulaires).
• Redirection automatique vers la page de connexion si le token est expiré ou
invalide.
• Gestion des états de succès/erreur pour informer clairement l’utilisateur.
8. Conclusion
Ce mini-projet a permis de mettre en pratique l’ensemble des compétences abordées
dans le module Framework Web Avancé. À travers la réalisation de l’application
Recipes App, plusieurs objectifs ont été atteints :
• Conception et implémentation d’une API REST claire et structurée.
• Utilisation de MongoDB avec Mongoose pour la persistance des données.
• Mise en place d’un système d’authentification JWT sécurisé.
• Développement d’un frontend React ergonomique et moderne.
• Gestion fine des erreurs et des accès grâce aux middlewares et à la logique
métier.
L’application obtenue est fonctionnelle, robuste et conforme aux standards actuels. Elle
offre une base solide pour de futures évolutions, parmi lesquelles :
• Intégration d’un véritable upload d’images (par exemple via Cloudinary).
• Ajout d’un système de tags ou de catégories pour les recettes.
• Création d’un panneau d’administration pour la modération des contenus.
• Mise en place de tests automatisés (backend avec Jest, frontend avec React
Testing Library).
• Déploiement complet du backend et du frontend sur des plateformes dédiées.
En conclusion, ce mini-projet a été une expérience formatrice permettant de consolider
la maîtrise de la stack JavaScript/TypeScript moderne dans un contexte full-stack.
