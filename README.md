# Lootlog

A news website for gaming and tech articles

## Notes

There is currently no implementation of refreshing tokens.
The frontend functions for interacting with the backend is currently being refactored.
The frontend dashboard for admins and authors are a work in progress.
The backend needs a service key file for storing article images in Firebase Storage.
When the project is launched, no roles, article categories etc. are being created. You'll have to create them yourself for now.

## How to deploy the dev environment

### Frontend

Create a ".env.local" file inside the frontend folder.
Inside of it you should add:

NODE_ENV=development
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
POLLING_INTERVAL=1
NEXT_PUBLIC_API_URL=http://backend-dev:3456

### Backend

Create a "".env.dev" file at the root of the project (alongside the docker-compose files)
Inside of it you should add:

NODE_ENV=development

POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB_NAME=postgres

JWT_ACCESS_TOKEN_SECRET=verysecret
JWT_REFRESH_TOKEN_SECRET=verysecret

JWT_ACCESS_TOKEN_EXPIRATION_MS=6000000 # 7 days
JWT_REFRESH_TOKEN_EXPIRATION_MS=604800000 # 7 days
