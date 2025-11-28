# Sistema de Autenticación Seguro con Express.js

Aplicación web segura construida con Express.js que implementa autenticación de usuarios, gestión de sesiones y múltiples capas de protección contra ataques comunes.

## 📋 Tabla de Contenidos

- [Características de Seguridad](#características-de-seguridad)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Características Técnicas](#características-técnicas)
- [Testing](#testing)
- [Consideraciones de Seguridad](#consideraciones-de-seguridad)

## 🔒 Características de Seguridad

### 1. **Protección contra Ataques de Fuerza Bruta**
- **Rate Limiting por IP**: Máximo 5 intentos de login cada 15 minutos
- **Time Protection**: Bloqueo automático de 15 minutos si se detectan 2 intentos en menos de 200ms
- Límite de 3 registros por hora por IP

### 2. **Gestión Segura de Contraseñas**
- Hash con bcrypt (12 salt rounds)
- Validación de complejidad:
  - Mínimo 8 caracteres
  - Al menos una mayúscula
  - Al menos una minúscula
  - Al menos un número

### 3. **Protección de Sesiones**
- Sesiones HTTP-only cookies
- SameSite: strict
- Regeneración de sesión en cada login
- Expiración automática (24 horas)

### 4. **Headers de Seguridad con Helmet**
- Content Security Policy
- XSS Protection
- Frameguard (clickjacking)
- HSTS (HTTP Strict Transport Security)

### 5. **Validación de Datos**
- Sanitización de inputs con express-validator
- Normalización de emails
- Validación de tipos y formatos
- Protección contra inyección SQL (Prisma ORM)

### 6. **Control de Acceso**
- Sistema de roles (user/admin)
- Middlewares de autenticación
- Protección de rutas administrativas

## 🛠 Tecnologías

### Backend
- **Node.js** v18+
- **Express.js** v5.1.0 - Framework web
- **Prisma** v6.17.1 - ORM para PostgreSQL
- **PostgreSQL** 15.9 - Base de datos

### Seguridad
- **bcrypt** v6.0.0 - Hashing de contraseñas
- **express-rate-limit** v8.2.1 - Rate limiting
- **helmet** v8.1.0 - Headers de seguridad
- **express-validator** v7.3.1 - Validación de datos
- **express-session** v1.18.2 - Gestión de sesiones

### Utilidades
- **dotenv** v17.2.3 - Variables de entorno
- **morgan** v1.10.1 - Logger HTTP
- **connect-flash** v0.1.1 - Mensajes flash
- **EJS** v3.1.10 - Motor de plantillas

## 🏗 Arquitectura

### Patrón MVC (Model-View-Controller)

```
src/
├── controllers/     # Lógica de negocio
├── middleware/      # Funciones intermedias
├── routes/          # Definición de rutas
├── views/           # Plantillas EJS
└── lib/             # Utilidades (Prisma client)
```

### Capas de Seguridad

```
Request Flow:
1. Helmet (Headers de seguridad)
2. Morgan (Logging)
3. Session Management
4. Rate Limiting (General: 100 req/15min)
5. Time Protection (< 200ms = bloqueo)
6. Auth Rate Limiter (5 intentos/15min)
7. Input Validation
8. Authentication/Authorization
9. Controller Logic
10. Error Handling
```

## 📦 Requisitos Previos

- Node.js >= 18.0.0
- PostgreSQL >= 15.0
- npm o yarn
- Docker (opcional)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd Bot
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos

#### Opción A: Docker (Recomendado)

```bash
docker-compose up -d
```

#### Opción B: PostgreSQL local

Instalar PostgreSQL y crear una base de datos.

### 4. Configurar variables de entorno

Crear archivo `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=dbname

# Session
SESSION_SECRET=your-super-secret-key-min-32-characters-long

# Server
PORT=3000
NODE_ENV=development
```

### 5. Ejecutar migraciones

```bash
npx prisma migrate dev
```

### 6. Iniciar servidor

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

## 📁 Estructura del Proyecto

```
Bot/
├── prisma/
│   ├── schema.prisma              # Esquema de base de datos
│   └── migrations/                # Migraciones SQL
├── scripts/
│   ├── checkdb.js                 # Verificación de BD
│   └── testRateLimit.js           # Test de rate limiting
├── src/
│   ├── app.js                     # Aplicación principal
│   ├── controllers/
│   │   ├── auth.controller.js     # Autenticación
│   │   ├── admin.controller.js    # Panel admin
│   │   └── login.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js     # Autenticación/Autorización
│   │   ├── rateLimiter.js         # Rate limiting + Time Protection
│   │   ├── validators.js          # Validación de inputs
│   │   └── errorHandler.js        # Manejo de errores
│   ├── routes/
│   │   ├── auth.routes.js         # Rutas de autenticación
│   │   └── admin.routes.js        # Rutas administrativas
│   ├── views/                     # Plantillas EJS
│   └── lib/
│       └── prisma.js              # Cliente Prisma
├── docker-compose.yaml            # Configuración Docker
├── package.json
└── README.md
```

## ⚙️ Características Técnicas

### 1. Sistema de Rate Limiting

#### Rate Limiter General
```javascript
- Ventana: 15 minutos
- Máximo: 100 peticiones por IP
- Headers: RateLimit-Remaining, RateLimit-Limit
```

#### Auth Rate Limiter
```javascript
- Ventana: 15 minutos
- Máximo: 5 intentos de login por IP
- Acción: Redirect con mensaje flash
```

#### Time Protection (Prevención de Bots)
```javascript
- Detecta: 2 intentos en < 200ms
- Bloqueo: 15 minutos
- Status: HTTP 429
- Logging: Consola del servidor
```

### 2. Modelo de Datos

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   // Hasheado con bcrypt
  role      String   @default("user") // user | admin
  createdAt DateTime @default(now())
}
```

### 3. Flujo de Autenticación

```mermaid
Login Request
    ↓
Time Protection (< 200ms?)
    ↓
Rate Limiter (> 5 intentos?)
    ↓
Input Validation
    ↓
Database Query
    ↓
Password Verification (bcrypt)
    ↓
Session Regeneration
    ↓
Redirect to Dashboard
```

### 4. Middlewares Personalizados

#### `timeProtection`
- Almacena timestamps de intentos por IP
- Calcula diferencia de tiempo entre intentos
- Bloquea IPs sospechosas por 15 minutos
- Limpia automáticamente registros antiguos

#### `isAuthenticated`
- Verifica existencia de sesión
- Valida userId en sesión
- Redirige a login si no autenticado

#### `isAdmin`
- Verifica rol de administrador
- Requiere autenticación previa
- Redirige con mensaje de error

## 🧪 Testing

### Test de Rate Limiting

```bash
npm run test:ratelimit
```

**Comportamiento esperado:**
- Intento 1: HTTP 302 (redirect normal)
- Intento 2: HTTP 429 (bloqueado por time protection)
- Intentos 3-7: HTTP 429 (IP bloqueada por 15 minutos)

### Test Manual

1. **Registrar usuario:**
```bash
POST /auth/register
{
  email: "test@example.com",
  password: "SecurePass123",
  confirmPassword: "SecurePass123"
}
```

2. **Intentar login múltiple:**
- 5 intentos normales → permitidos
- 6º intento → bloqueado por 15 minutos

3. **Intentos rápidos:**
- 2 requests < 200ms → bloqueado automáticamente

## 🔐 Consideraciones de Seguridad

### Implementadas

✅ **Autenticación Segura**
- Hashing bcrypt con salt rounds altos
- Validación de complejidad de contraseñas
- Regeneración de sesión en login

✅ **Protección contra Ataques**
- Rate limiting multinivel
- Time-based attack prevention
- CSRF protection (disponible pero deshabilitado)
- XSS protection via Helmet
- SQL Injection protection via Prisma

✅ **Gestión de Sesiones**
- HTTP-only cookies
- Secure cookies (en producción)
- SameSite strict
- Expiración automática

✅ **Logging y Monitoreo**
- Morgan para requests HTTP
- Console logging para bloqueos
- Error tracking

### Recomendaciones Adicionales

⚠️ **Para Producción:**

1. **HTTPS Obligatorio**
```javascript
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));
```

2. **Variables de Entorno Seguras**
- Nunca commitear `.env`
- Usar secretos fuertes (min 32 caracteres)
- Rotar secretos periódicamente

3. **Database Security**
- Conexiones SSL/TLS
- Principle of least privilege
- Backups regulares

4. **Monitoring**
- Implementar logging profesional (Winston, Pino)
- Alertas de seguridad
- Analytics de intentos fallidos

5. **Actualizaciones**
```bash
npm audit
npm audit fix
```

## 📝 Scripts Disponibles

```json
{
  "start": "node src/app.js",           // Producción
  "dev": "node --watch src/app.js",     // Desarrollo con hot-reload
  "test:ratelimit": "node scripts/testRateLimit.js"  // Test de seguridad
}
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Revisar variables de entorno
cat .env

# Regenerar cliente Prisma
npx prisma generate
```

### Error: "Session secret is required"
```bash
# Asegurar que SESSION_SECRET está en .env
echo "SESSION_SECRET=$(openssl rand -base64 32)" >> .env
```

### Rate Limiter no funciona
```bash
# Verificar que no hay proxy/load balancer
# Revisar que req.ip retorna la IP correcta
# Limpiar memoria de bloqueos (reiniciar servidor)
```
---

**Nota de Seguridad:** Este proyecto implementa múltiples capas de protección, pero siempre realiza auditorías de seguridad antes de desplegar en producción. — Manual de ejecución

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

El proyecto ahora incluye un **sistema de autenticación completo y funcional** con las siguientes características:

#### Funcionalidades Implementadas:
- ✅ **Registro de usuarios** con validaciones robustas
- ✅ **Login seguro** con bcrypt y rate limiting
- ✅ **Logout funcional**
- ✅ **Dashboard de usuario** personalizado
- ✅ **Protección de rutas** con middleware
- ✅ **Manejo de errores** con páginas personalizadas
- ✅ **Flash messages** para feedback al usuario

#### Seguridad:
- 🔒 Hash de contraseñas con bcrypt (12 rounds)
- 🔒 Rate limiting (anti fuerza bruta)
- 🔒 Sesiones seguras (httpOnly, sameSite)
- 🔒 Validaciones con express-validator
- 🔒 Helmet.js para headers seguros
- 🔒 Prevención de session fixation

#### Scripts Disponibles:
```bash
npm start              # Inicia el servidor
npm run dev            # Inicia con hot reload
```

#### Acceso Rápido:
Una vez iniciado el servidor, accede a:
- **Inicio:** http://localhost:3000
- **Login:** http://localhost:3000/auth/login
- **Registro:** http://localhost:3000/auth/register
- **Dashboard:** http://localhost:3000/auth/dashboard (requiere login)

#### 📚 Documentación Adicional:
- **INICIO_RAPIDO.md** → Guía rápida de inicio
- **RESUMEN_IMPLEMENTACION.md** → Resumen completo de la implementación
- **IMPLEMENTACION.md** → Detalles técnicos
- **TAREAS_COMPAÑERO.md** → Guía para el panel de administración (pendiente)

### 🚧 Pendiente de Implementación:
- Panel de administración (`/admin`)
- CRUD completo de usuarios
- Middleware `timeProtection`
- Logger con winston
- CSRF protection