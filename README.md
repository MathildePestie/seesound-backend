<p align="center">
  <img src="https://github.com/MathildePestie/seesound-frontend/blob/main/public/images/logo_Seesound_noir.png?raw=true" alt="SeeSound Logo" width="300"/>
</p>

# seesound-backend

Bienvenue dans le backend de **SeeSound**, une application qui transforme la musique en visualisations vidéo stylisées. Cette API Express est connectée à une base de données MongoDB et gère l’authentification, le traitement des fichiers audio, la génération de visualisations, et le stockage sur Firebase.

## Technologies utilisées

- Node.js + Express
- MongoDB + Mongoose
- Firebase Storage (pour les vidéos)
- `uid2` + `bcrypt` pour l’authentification sécurisée
- Multer pour l'upload de fichiers
- Lottie pour les loaders frontend

## Structure des dossiers

 backend ┣ models ┃ ┣ users.js ┃ ┣ connection.js ┣ routes ┃ ┣ users.js ┃ ┣ upload.js ┣ uploads ┃ ┗  .gitkeep ┣ server.js ┣ .env ┣ .gitignore ┗ README.md

 ## Démarrage du projet

 1. Clone ce repo :
   ```bash
   git clone https://github.com/MathildePestie/seesound-backend.git
   cd seesound-backend

2. Installe les dépendances : yarn install

3. Crée un fichier .env avec ce contenu :

    MONGODB_URI=mongodb+srv://...
    FIREBASE_PROJECT_ID=...
    FIREBASE_PRIVATE_KEY=...
    FIREBASE_CLIENT_EMAIL=...

4.  Lance le serveur : node server.js   

Le backend tourne par défaut sur http://localhost:3000

### Authentification

POST /users/signup
Créer un nouveau compte utilisateur
Body JSON :

{
  "username": "mathilde",
  "password": "1234",
  "firstname": "Mathilde",
  "lastname": "Pestie"
}

POST /users/signin
Connexion d’un utilisateur
Body JSON :

{
  "username": "mathilde",
  "password": "1234"
}

### Upload & génération de visualisation

POST /upload/save-visual
Reçoit un fichier .webm (visualisation vidéo) + un MP3 original et les métadonnées.
Headers :
Authorization: Bearer <token>

FormData :

video: fichier .webm

audio: fichier .mp3

title: titre de la musique

artist: nom de l’artiste

date_of_creation: date de création

Les vidéos sont stockées sur Firebase + lien sauvegardé dans MongoDB.

### Espace utilisateur

GET /users/account
Récupère toutes les créations d’un utilisateur (requiert un token).

### Nettoyage

Uploads temporaires : dans /uploads

Firebase Storage : nettoyé après envoi réussi

MongoDB : contient les utilisateurs + leurs œuvres (voir music dans le schéma)

#### Notes de la créatrice

Ce projet a été codé à l'issu de ma formation en développement Full Stack à la Capsule. Il a été conçu d'après une idée originale, de mes connaissances, de celles que j'ai acquises grâce au forums de développement tels que Stck Overflow et de celles que mon allié Chat GPT m'a enseignées.

#### Licence

MIT — Libre d’utilisation et de contribution.