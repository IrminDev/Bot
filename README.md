# Bot — Manual de ejecución

Este documento explica cómo poner en marcha el proyecto en tu máquina local. El backend es una app Node.js con Express y EJS; usa PostgreSQL como base de datos (levantada con Docker) y Prisma como ORM.

## Requisitos

- Node.js 20 LTS o superior (recomendado)
- npm 10+ (incluido con Node 20)
- Docker y Docker Compose
- zsh o bash (los comandos están listos para zsh)

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con los siguientes valores. Puedes ajustar usuario/contraseña/nombre de BD si lo deseas.

```
# App
PORT=3000
SESSION_SECRET=pon-aqui-un-secreto-seguro

# Base de datos (Docker Compose)
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=botdb

# Prisma (cadena de conexión usada por la app)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/botdb?schema=public
```

Notas:
- `SESSION_SECRET` debe ser un string aleatorio y largo en producción.
- Si cambias `DATABASE_USER`, `DATABASE_PASSWORD` o `DATABASE_NAME`, actualiza también `DATABASE_URL` para que coincida.

## Arranque rápido

1) Instala dependencias

```sh
npm install
```

2) Levanta la base de datos con Docker

```sh
docker compose up -d
```

3) Genera el cliente de Prisma y aplica migraciones

```sh
npx prisma generate
npx prisma migrate deploy
```

4) Ejecuta la app

```sh
node src/app.js
```

Abre http://localhost:3000 en tu navegador. Ten en cuenta que, por ahora, las rutas `/auth` y `/admin` aún no tienen endpoints definidos, por lo que es normal ver 404 hasta que se implementen.

## Guía detallada

### 1. Instalación

```sh
npm install
```

### 2. Base de datos (PostgreSQL con Docker)

El archivo `docker-compose.yaml` ya define un servicio `db` con PostgreSQL 16 y persiste datos en el volumen `pgdata`.

```sh
docker compose up -d
```

Comprobar que el contenedor está corriendo:

```sh
docker ps --filter name=db
```

### 3. Prisma (ORM)

- Generar cliente de Prisma (necesario tras instalar dependencias o cambiar el esquema):

```sh
npx prisma generate
```

- Aplicar migraciones existentes (modo recomendado en despliegue o cuando ya hay migraciones creadas):

```sh
npx prisma migrate deploy
```

- En desarrollo, también puedes usar:

```sh
npx prisma migrate dev
```

- Opcional: abrir Prisma Studio para inspeccionar datos:

```sh
npx prisma studio
```

### 4. Ejecutar la aplicación

Lanza el servidor Express:

```sh
node src/app.js
```

Verás en consola algo como: `Server is running on port 3000`.

Sugerencia: Si prefieres usar un script de npm, puedes añadirlo y luego ejecutar `npm run start`.

```sh
npm pkg set scripts.start="node src/app.js"
npm run start
```

## Verificación básica

- Navega a: http://localhost:3000
- Rutas previstas: `/auth` y `/admin` (actualmente sin handlers, por lo que pueden responder 404 hasta implementarlos)
- Si hay problemas de conexión a BD, revisa `DATABASE_URL` y que el contenedor `db` esté activo.

## Solución de problemas

- Error de imports ESM: `SyntaxError: Cannot use import statement outside a module`
	- El archivo `src/app.js` usa `import`. Asegúrate de que tu `package.json` tenga `"type": "module"`. En este proyecto actualmente está en `commonjs`.
	- Puedes ajustarlo con:
		```sh
		npm pkg set type=module
		```
	- Alternativamente, cambia extensiones a `.mjs` o usa `require()` (no recomendado aquí).

- Error de conexión a la base de datos (ECONNREFUSED / P1001)
	- Asegúrate de que Docker esté corriendo y el contenedor `db` esté en marcha: `docker ps --filter name=db`.
	- Verifica que `DATABASE_URL` apunte a `localhost:5432` y que usuario/contraseña/nombre de BD coincidan con lo definido en `.env` y `docker-compose.yaml`.
	- Si cambiaste el puerto externo en `docker-compose.yaml`, refleja el cambio en `DATABASE_URL`.

- Puerto en uso (EADDRINUSE) al iniciar la app
	- Cambia `PORT` en `.env` o libera el puerto ocupando otro.

- Prisma no encuentra OpenSSL en Alpine (solo relevante si ejecutas Node dentro de Alpine)
	- Usa imágenes base no-Alpine para Node o instala las librerías necesarias. En local con Node nativo no debería afectar.

- Migraciones no aplican
	- Ejecuta `npx prisma migrate status` para ver el estado.
	- En desarrollo: `npx prisma migrate dev`. En despliegue: `npx prisma migrate deploy`.

## Comandos útiles

```sh
# Iniciar BD en segundo plano
docker compose up -d

# Detener servicios y mantener datos
docker compose down

# Detener servicios y borrar datos (reset)
docker compose down -v

# Generar cliente de Prisma
npx prisma generate

# Aplicar migraciones (prod)
npx prisma migrate deploy

# Aplicar migraciones (dev) y crear nuevas si hay cambios
npx prisma migrate dev

# Explorar datos en UI
npx prisma studio

# Iniciar app
node src/app.js

# Añadir script start (opcional)
npm pkg set scripts.start="node src/app.js"
npm run start
```

## Estructura del proyecto (resumen)

```
docker-compose.yaml
package.json
prisma/
	schema.prisma
	migrations/
		<timestamp>_init/
			migration.sql
src/
	app.js
	controllers/
		login.controller.js
	middleware/
		timeProtection.js
	routes/
		admin.routes.js
		auth.routes.js
	views/
		Login.ejs
```

## Notas finales

- Este proyecto aún no define endpoints en `auth.routes.js` y `admin.routes.js`. Una vez implementados, podrás probarlos navegando a `/auth/...` y `/admin/...`.
- Cambia `SESSION_SECRET` y credenciales de BD antes de cualquier despliegue fuera del entorno local.

