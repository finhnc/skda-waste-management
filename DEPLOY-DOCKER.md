# Deploying SKDA with Docker

The production-like Docker stack exposes the application at `http://192.168.160.181:8081`. The gateway routes `/api/*` to Laravel and all other paths to the React build. MariaDB data is stored in the named `skda-db` volume.

## First deployment on Ubuntu

```bash
sudo apt update
sudo apt install -y git
sudo mkdir -p /opt/skda-waste-management
sudo chown -R "$USER":"$USER" /opt/skda-waste-management
cd /opt/skda-waste-management
git clone https://github.com/finhnc/skda-waste-management.git .
cp .env.docker.example .env
nano .env
cp backend/.env.docker.example backend/.env.docker
nano backend/.env.docker
```

Use different long random values for `DB_PASSWORD` and `DB_ROOT_PASSWORD`. Generate and set an application key before the first start:

```bash
docker run --rm skda-waste-management-backend php artisan key:generate --show
```

Alternatively, after the first image build, run the same command against the built image and copy the `base64:...` value into `APP_KEY` in `backend/.env.docker`. Keep the real environment file only on the server.

Start the stack:

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f --tail=100
```

Open `http://192.168.160.181:8081`. If initial data is required, run the project seeder once:

```bash
docker compose exec backend php artisan db:seed --force
```

## Updating after code changes

```bash
cd /opt/skda-waste-management
git pull origin main
docker compose up -d --build
docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan optimize:clear
docker compose exec backend php artisan optimize
docker compose ps
```

The named MariaDB volume is not removed by rebuilds. Do not run `docker compose down -v` unless the database is intentionally being deleted.

## Useful checks

```bash
docker compose ps
docker compose logs --tail=100 backend
docker compose logs --tail=100 gateway
curl -i http://127.0.0.1:8081/up
```

The repository must not contain real `.env` files, passwords, or production database dumps.
