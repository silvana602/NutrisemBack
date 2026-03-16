# Nutrisem Back

API de Nutrisem construida con NestJS, TypeScript y PostgreSQL. Incluye autenticacion con JWT, cookies httpOnly, y migrations con TypeORM.

**Stack principal**
- NestJS 11
- TypeScript
- PostgreSQL
- TypeORM
- JWT + Passport
- Jest
- Docker

**Requisitos**
- Node.js 20+ (recomendado)
- npm 11+
- PostgreSQL 16+ (si no usas Docker)

**Instalacion local**
1. Instala dependencias: `npm install`
2. Copia variables: `Copy-Item .env.template .env`
3. Ajusta valores en `.env`
4. Inicia en desarrollo: `npm run start:dev`

**Variables de entorno**
Archivo base: `.env.template`

`NODE_ENV`: Entorno de ejecucion - `nutrisem`
`PORT`: Puerto del API - `4000`
`APP_HOST`: Host de binding - `0.0.0.0`
`API_PREFIX`: Prefijo de rutas - `api`
`DB_HOST`: Host de PostgreSQL - `localhost`
`DB_PORT`: Puerto de PostgreSQL - `5432`
`DB_USER`: Usuario de DB - `postgres`
`DB_PASSWORD`: Password de DB - `postgres`
`DB_NAME`: Nombre de DB - `nutrisem`
`DB_SSL`: SSL en DB - `false`
`JWT_ACCESS_SECRET`: Secreto del access token - `replace_me_access_secret`
`JWT_ACCESS_EXPIRES_IN`: TTL access token - `15m`
`JWT_REFRESH_SECRET`: Secreto del refresh token - `replace_me_refresh_secret`
`JWT_REFRESH_EXPIRES_IN`: TTL refresh token - `7d`
`COOKIE_DOMAIN`: Dominio de cookies - `localhost`
`COOKIE_SECURE`: Cookies solo HTTPS - `false`
`COOKIE_SAME_SITE`: Politica SameSite - `lax`
`CORS_ORIGIN`: Origen principal permitido - `http://localhost:3000`
`CORS_ORIGINS`: Lista de origenes permitidos - `http://localhost:3000,http://127.0.0.1:3000`
`CORS_ALLOW_ALL_DEV`: Permitir todos en dev - `true`
`CORS_CREDENTIALS`: Enviar cookies CORS - `true`

**Scripts**
- `npm run build` - build de produccion
- `npm run start` - inicio
- `npm run start:dev` - desarrollo con watch
- `npm run start:debug` - debug con watch
- `npm run start:prod` - produccion desde `dist/`
- `npm run lint` - lint
- `npm run format` - prettier
- `npm run test` - unit
- `npm run test:watch` - unit en watch
- `npm run test:cov` - cobertura
- `npm run test:debug` - debug de tests
- `npm run test:e2e` - e2e
- `npm run typeorm` - CLI TypeORM
- `npm run migration:run` - ejecutar migrations
- `npm run migration:revert` - revertir ultima migration
- `npm run migration:show` - listar migrations

**Estructura principal**
```text
src/
  common/
  database/
  modules/
  app.module.ts
  main.ts
```

**Docker**
- Levantar API + PostgreSQL: `docker-compose up --build`
- API expuesta en `http://localhost:4000`
- PostgreSQL expuesto en `localhost:5432`

**Notas**
- El contenedor `api` ejecuta `npm run migration:run` al iniciar en Docker.
- Para clientes moviles, usa la IP local de tu PC en `CORS_ORIGIN`/`CORS_ORIGINS`.
