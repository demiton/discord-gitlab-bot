
# Discord GitLab Bot

Ce projet permet de déclencher des builds sur GitLab via un bot Discord, et d'en récupérer le statut. Le bot écoute des commandes dans Discord et interagit avec l'API GitLab pour lancer des pipelines et obtenir leur statut.

## Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** (version 7 ou supérieure)
- **Docker** (si tu souhaites dockeriser l'application)

## Installation

### 1. **Clone le repository**

Commence par cloner ce repository sur ta machine locale.

```bash
git clone https://github.com/ton-utilisateur/discord-gitlab-bot.git
cd discord-gitlab-bot
```

### 2. **Installer les dépendances**

Ensuite, tu dois installer les dépendances avec **npm**.

```bash
npm install
```

### 3. **Configurer les variables d'environnement**

L'application utilise des variables d'environnement pour se connecter à Discord et à GitLab. Crée un fichier `.env` à la racine du projet et ajoute les variables suivantes :

```bash
DISCORD_TOKEN=ton_token_discord
GITLAB_ACCESS_TOKEN=ton_token_gitlab
GITLAB_PROJECT_ID=ton_project_id_gitlab
GITLAB_TRIGGER_TOKEN=ton_trigger_token_gitlab
```

- **DISCORD_TOKEN** : Le token de ton bot Discord.
- **GITLAB_ACCESS_TOKEN** : Un token d'accès personnel GitLab pour accéder à l'API (permis "api" pour l'authentification).
- **GITLAB_PROJECT_ID** : L'ID de ton projet GitLab (disponible dans l'URL du projet GitLab).
- **GITLAB_TRIGGER_TOKEN** : Le token pour déclencher les pipelines (disponible dans les paramètres GitLab du projet).

### 4. **Exécuter l'application localement**

Une fois les dépendances installées et les variables configurées, tu peux démarrer le bot en exécutant :

```bash
npm start
```

Cela lancera le bot Discord, et il sera prêt à recevoir des commandes comme `/build` pour déclencher un pipeline sur GitLab.

### 5. **Dockeriser l'application (facultatif)**

Si tu préfères exécuter l'application dans un conteneur Docker, tu peux suivre ces étapes.

#### a. **Construire l'image Docker**

Crée une image Docker à partir du `Dockerfile` dans le répertoire racine du projet :

```bash
docker build -t discord-gitlab-bot .
```

#### b. **Exécuter l'application avec Docker**

Une fois l'image construite, tu peux exécuter le bot dans un conteneur Docker en utilisant la commande suivante :

```bash
docker run -d --name discord-gitlab-bot --env-file .env discord-gitlab-bot
```

Cela démarrera le bot dans un conteneur Docker et injectera les variables d'environnement du fichier `.env`.

#### c. **Vérifier que le conteneur fonctionne**

Tu peux vérifier que ton bot fonctionne en consultant les logs du conteneur Docker :

```bash
docker logs discord-gitlab-bot
```

### 6. **Utilisation**

Une fois que le bot est lancé, tu peux lui envoyer des commandes dans ton serveur Discord pour interagir avec l'API GitLab.

Exemples de commandes :

- **/build** : Déclenche un pipeline GitLab pour le projet spécifié.
- **/status <pipeline_id>** : Récupère le statut du pipeline en cours en utilisant son ID.

### 7. **Dépannage**

- **Problème de permissions** : Assure-toi que ton **Personal Access Token (PAT)** GitLab a les bonnes permissions (`api` ou `read_api`).
- **Token Discord** : Si le bot ne répond pas aux commandes, vérifie que le **token Discord** est valide et que le bot a les bonnes permissions sur le serveur (il doit pouvoir lire les messages et envoyer des messages).
- **Erreur de pipeline vide** : Si tu vois l'erreur **"The resulting pipeline would have been empty"**, vérifie les règles dans ton fichier `.gitlab-ci.yml` pour t'assurer que des jobs sont définis et valides pour le pipeline déclenché.

---

