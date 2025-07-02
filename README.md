# Test technique - Gestion d'équipements

## Prérequis

- Node
- Docker ou Postgres

## Installation

Cloner le dépôt

```zsh
git clone git@github.com:younes101020/test-technique.git
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
docker run -d \
  --name db-test \
  --shm-size=128m \
  -e POSTGRES_PASSWORD="${POSTGRES_PASSWORD}" \
  -e POSTGRES_USER=test \
  -p 5432:5432 \
  postgres:14.18-bookworm
```

## Démarrer l'application

```zsh
# Environnement de développement
pnpm dev

# Simuler l'environnement de production
pnpm build
pnpm start
```
