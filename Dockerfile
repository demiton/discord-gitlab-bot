# Étape 1: Choisir une image de base avec Node.js
FROM node:20

# Étape 2: Créer un répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Étape 3: Copier package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Étape 4: Installer les dépendances
RUN npm install

# Étape 5: Copier tous les fichiers de ton projet dans le conteneur
COPY . .

# Étape 6: Exposer le port (optionnel si ton bot écoute un port spécifique)
# EXPOSE 3000

# Étape 7: Lancer ton bot lorsque le conteneur démarre
CMD ["npm", "start"]
