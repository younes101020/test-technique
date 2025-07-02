# Test technique - Gestion d'équipements

## Prérequis

- Node
- Docker compose ou Postgres

## Installation

Cloner le dépôt

```zsh
git clone git@github.com:younes101020/test-technique.git
cd test-technique
```

Installer les dépendances:

```zsh
pnpm install
# ou
npm install
```

## Mise en place de la base de donnée

```zsh
# executer ces commande à la racine du projet

# initialiser la variable d'environnement pour postgres
echo "$(cat .env.example)" > .env
# initialiser la variable d'environnement pour l'application
echo "$(cat .env.example)" > apps/api/.env

# lancer la base de donnée
docker compose -f compose.yml up -d

# Appliquer le schema vers la base de donnée
pnpm db:push
# Remplir la base de donnée
pnpm db:seed
```

## Démarrer l'application

```zsh
# Environnement de développement
pnpm dev
# allez vers http://localhost:3000

# Simuler l'environnement de production
pnpm build
pnpm start
# allez vers http://localhost:8787
```
