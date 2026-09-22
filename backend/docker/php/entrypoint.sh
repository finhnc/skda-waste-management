#!/bin/sh
set -eu

if [ -z "${APP_KEY:-}" ]; then
    echo "APP_KEY is required in backend/.env.docker" >&2
    exit 1
fi

php artisan storage:link --force || true
php artisan migrate --force
exec "$@"
