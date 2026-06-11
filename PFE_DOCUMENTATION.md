# StudyPulse - PFE Documentation

## 📘 Cahier des Charges (Requirements Specification)

### 🎯 Objectif du Projet

Développer une plateforme d’apprentissage en ligne moderne et interactive permettant aux étudiants de suivre des cours, passer des quiz intelligents et suivre leur progression avec l’aide de l’intelligence artificielle.

---

## ⚙️ Fonctionnalités Principales

### 1. 👤 Gestion des Utilisateurs

* Inscription et connexion sécurisée
* Gestion des profils utilisateurs
* Système de niveaux (Level) et points d’expérience (XP)

---

### 2. 📚 Gestion des Cours

* Création et organisation des cours
* Leçons structurées et ordonnées
* Suivi de progression des étudiants

---

### 3. 🧠 Système de Quiz Intelligent

* Génération automatique de quiz via IA (Gemini)
* Quiz interactifs à choix multiples (MCQ)
* Correction automatique
* Analyse des résultats et statistiques

---

### 4. 🌍 Interface Multilingue

* Support des langues : Français, Anglais, Arabe
* Changement dynamique de langue
* Support RTL pour la langue arabe

---

### 5. 📊 Tableau de Bord

* Statistiques en temps réel
* Graphiques de progression
* Système de badges et récompenses
* Suivi des activités utilisateur

---

### 6. 🤖 Intégration de l’Intelligence Artificielle

* Génération automatique de quiz à partir des leçons
* Résumé automatique des cours
* Assistant virtuel pour répondre aux questions des étudiants
* Recommandation personnalisée des leçons à réviser

---

## 📊 Analyse Fonctionnelle

### 🎓 Cas d’Utilisation Étudiant

* S’inscrire et se connecter
* Consulter les cours disponibles
* Suivre les leçons
* Passer des quiz générés par IA
* Consulter ses résultats et statistiques
* Changer la langue de l’interface

---

### 🧑‍🏫 Cas d’Utilisation Administrateur

* Gérer les utilisateurs
* Créer et modifier les cours
* Superviser les quiz
* Consulter les statistiques globales
* Suivre la performance des étudiants

---

## 🏗️ Conception Technique

### 🧱 Architecture Générale

* **Frontend** : React (SPA) + Vite + Tailwind CSS
* **Backend** : Laravel (API RESTful)
* **Base de données** : MySQL
* **Authentification** : Laravel Sanctum
* **IA** : Google Gemini API

---

## 🗄️ Modèle Conceptuel des Données (MCD)

```
Utilisateur (id, nom, email, mot_de_passe, niveau, xp, langue)
Cours (id, titre, description, sujet_id, createur_id)
Leçon (id, titre, contenu, cours_id, ordre)
Quiz (id, titre, lesson, user_id)
Question (id, question, options, reponse_correcte, quiz_id)
Tentative_Quiz (id, utilisateur_id, quiz_id, score, reussie, date)
Session_Etude (id, utilisateur_id, duree, date)
Badge (id, nom, description, xp_requis)
Badge_Utilisateur (id, utilisateur_id, badge_id, date_obtention)
```

---

## 🖥️ Interfaces Utilisateur

### 🏠 Page d’Accueil

* Présentation de la plateforme
* Statistiques générales
* Mise en avant des fonctionnalités IA

---

### 📊 Dashboard

* Niveau et XP utilisateur
* Statistiques de progression
* Graphiques interactifs
* Activités récentes

---

### 📚 Page des Cours

* Liste des cours disponibles
* Filtres et recherche
* Accès aux leçons

---

### 🧪 Page des Quiz

* Quiz générés automatiquement par IA
* Historique des résultats
* Mode correction

---

## 🛠️ Implémentation Technique

### 💻 Technologies Utilisées

* Laravel 12 (Backend)
* React 19 + Vite (Frontend)
* Tailwind CSS (UI)
* MySQL 8 (Database)
* Gemini API (Intelligence Artificielle)
* Git + Composer + NPM

---

### 📁 Structure du Projet

```
StudyPulse/
├── backend/ (Laravel API)
│   ├── app/Http/Controllers/
│   ├── app/Models/
│   ├── app/Services/
│   ├── database/migrations/
│   ├── routes/api.php
│   └── lang/
├── frontend/ (React App)
│   ├── src/components/
│   ├── src/pages/
│   ├── src/services/
│   └── src/i18n/
└── docs/
```

---

## 🧪 Tests et Validation

### ✔️ Tests Fonctionnels

* Authentification utilisateur
* Génération de quiz IA
* Passage de quiz
* Multilingue
* Suivi des statistiques

---

### ⚡ Tests de Performance

* Optimisation des requêtes API
* Gestion de charge utilisateur
* Temps de réponse Gemini API

---

## 🔐 Sécurité

* Hashage des mots de passe (bcrypt)
* Laravel Sanctum Authentication
* Validation des inputs
* Protection CSRF
* Rate limiting API

---

## 🚀 Déploiement

### 🧾 Backend

```bash
composer install --no-dev
php artisan migrate
php artisan config:cache
```

### 🌐 Frontend

```bash
npm install
npm run build
```

---

## 📌 Conclusion

### 🎯 Objectifs Atteints

* Plateforme d’apprentissage complète
* Système de quiz intelligent basé sur IA
* Interface multilingue
* Suivi de progression avancé
* Architecture moderne et scalable

---

### 🧠 Compétences Développées

* Full-stack development (Laravel + React)
* API RESTful design
* Integration AI (Gemini)
* Database design (MySQL)
* UI/UX development
* Internationalisation (i18n)

---

### 🚀 Perspectives d’Évolution

* Application mobile (React Native)
* Chatbot IA avancé
* Recommandations basées sur Machine Learning
* Visioconférence pour cours live

---

**Projet PFE - StudyPulse**
**Année : 2025–2026**
**Filière : Développement Digital**