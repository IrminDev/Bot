# Guía de Implementación - Parte del Compañero

## 📋 Resumen de Tareas Pendientes

Esta guía detalla todas las funcionalidades que debe implementar tu compañero para completar el proyecto.

---

## 🎯 Objetivo General

Implementar el **Panel de Administración completo** con gestión de usuarios y características de seguridad avanzadas.

---

## 📁 Estructura de Archivos a Crear

```
src/
├── controllers/
│   └── admin.controller.js          ✅ Crear
├── middleware/
│   ├── csrf.middleware.js           ✅ Crear (opcional pero recomendado)
│   └── logger.js                    ✅ Crear
└── views/
    └── admin/
        ├── Dashboard.ejs            ✅ Crear
        ├── UserList.ejs             ✅ Crear
        └── UserForm.ejs             ✅ Crear
```

---

## 1️⃣ Controlador de Administración

**Archivo:** `src/controllers/admin.controller.js`

### Funciones a implementar:

```javascript
// Muestra el dashboard con estadísticas
export const showAdminDashboard = async (req, res) => {
    // TODO: Obtener estadísticas de usuarios
    // - Total de usuarios
    // - Usuarios registrados hoy
    // - Usuarios por rol
    // - Últimos usuarios registrados
};

// Lista todos los usuarios con paginación
export const listUsers = async (req, res) => {
    // TODO: Obtener todos los usuarios de la BD
    // - Implementar paginación
    // - Permitir búsqueda por email
    // - Ordenar por fecha de creación
};

// Muestra formulario de crear usuario
export const showCreateUser = (req, res) => {
    // TODO: Renderizar formulario vacío
};

// Crea un nuevo usuario (admin puede asignar rol)
export const createUser = async (req, res) => {
    // TODO: Validar datos
    // TODO: Hash de contraseña
    // TODO: Crear usuario en BD
    // TODO: Permitir asignar rol (admin/user)
};

// Muestra formulario de editar usuario
export const showEditUser = async (req, res) => {
    // TODO: Buscar usuario por ID
    // TODO: Renderizar formulario con datos
};

// Actualiza un usuario existente
export const updateUser = async (req, res) => {
    // TODO: Validar datos
    // TODO: Actualizar en BD
    // TODO: Si se cambia la contraseña, hacer hash
};

// Elimina un usuario (soft delete recomendado)
export const deleteUser = async (req, res) => {
    // TODO: Verificar que no se elimine a sí mismo
    // TODO: Eliminar usuario de BD
};
```

---

## 2️⃣ Middleware Pendiente

### A) `src/middleware/timeProtection.js`

Implementar lógica de protección por tiempo. Opciones:

**Opción 1: Limitación de horarios**
```javascript
export function timeProtection(req, res, next) {
    const currentHour = new Date().getHours();
    // Solo permitir acceso entre 8 AM y 6 PM
    if (currentHour < 8 || currentHour > 18) {
        req.flash('error', 'Acceso fuera de horario permitido');
        return res.redirect('/');
    }
    next();
}
```

**Opción 2: Protección anti-timing attacks**
```javascript
import crypto from 'crypto';

export function timeProtection(req, res, next) {
    // Agregar un delay aleatorio pequeño para prevenir timing attacks
    const delay = crypto.randomInt(10, 50);
    setTimeout(() => next(), delay);
}
```

### B) `src/middleware/logger.js`

**Instalar:** `npm install winston`

```javascript
import winston from 'winston';

// Configurar logger
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Middleware para logear requests
export const requestLogger = (req, res, next) => {
    logger.info(`${req.method} ${req.url} - ${req.ip}`);
    next();
};
```

### C) CSRF Protection (Opcional pero recomendado)

**Instalar:** `npm install csurf`

```javascript
import csrf from 'csurf';

export const csrfProtection = csrf({ cookie: true });
```

---

## 3️⃣ Vistas de Administración

### A) `src/views/admin/Dashboard.ejs`

**Debe incluir:**
- Navbar con logo y opción de logout
- Estadísticas en cards (total usuarios, nuevos hoy, etc.)
- Gráfico o tabla de usuarios recientes
- Link al listado de usuarios
- Diseño consistente con las vistas de auth

### B) `src/views/admin/UserList.ejs`

**Debe incluir:**
- Tabla con todos los usuarios
- Columnas: ID, Email, Rol, Fecha de registro, Acciones
- Botones: Editar, Eliminar
- Botón para crear nuevo usuario
- Buscador por email
- Paginación
- Confirmación antes de eliminar (modal o confirm)

### C) `src/views/admin/UserForm.ejs`

**Debe incluir:**
- Formulario para crear/editar usuario
- Campos: Email, Contraseña (opcional en edición), Rol (select)
- Validación del lado del cliente
- Mensajes de error con flash
- Botones: Guardar, Cancelar

---

## 4️⃣ Validadores Adicionales

**Agregar a:** `src/middleware/validators.js`

```javascript
export const validateCreateUser = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Contraseña mínimo 8 caracteres'),
    
    body('role')
        .isIn(['user', 'admin'])
        .withMessage('Rol inválido'),
    
    handleValidationErrors
];

export const validateUpdateUser = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    
    body('password')
        .optional()
        .trim()
        .isLength({ min: 8 })
        .withMessage('Contraseña mínimo 8 caracteres'),
    
    body('role')
        .isIn(['user', 'admin'])
        .withMessage('Rol inválido'),
    
    handleValidationErrors
];
```

---

## 5️⃣ Actualizar app.js

Agregar después de implementar todo:

```javascript
// Importar logger
import { requestLogger } from './middleware/logger.js';
app.use(requestLogger);

// Importar CSRF (si se implementa)
import { csrfProtection } from './middleware/csrf.middleware.js';
app.use(csrfProtection);
```

---

## 6️⃣ Rutas Completas

**Actualizar:** `src/routes/admin.routes.js`

```javascript
import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware.js';
import { validateCreateUser, validateUpdateUser } from '../middleware/validators.js';

const router = express.Router();

// Dashboard
router.get('/', isAuthenticated, isAdmin, adminController.showAdminDashboard);

// Gestión de usuarios
router.get('/users', isAuthenticated, isAdmin, adminController.listUsers);
router.get('/users/create', isAuthenticated, isAdmin, adminController.showCreateUser);
router.post('/users', isAuthenticated, isAdmin, validateCreateUser, adminController.createUser);
router.get('/users/:id/edit', isAuthenticated, isAdmin, adminController.showEditUser);
router.post('/users/:id', isAuthenticated, isAdmin, validateUpdateUser, adminController.updateUser);
router.post('/users/:id/delete', isAuthenticated, isAdmin, adminController.deleteUser);

export default router;
```

---

## 7️⃣ Mejoras Opcionales

- [ ] Agregar avatar de usuario
- [ ] Sistema de permisos más granular
- [ ] Logs de auditoría (quién modificó qué)
- [ ] Exportar usuarios a CSV/Excel
- [ ] Búsqueda avanzada con filtros
- [ ] Dashboard con gráficos (Chart.js)
- [ ] Notificaciones por email

---

## 📚 Recursos Útiles

- **Prisma Docs:** https://www.prisma.io/docs
- **Express Validator:** https://express-validator.github.io/docs
- **Winston Logger:** https://github.com/winstonjs/winston
- **EJS Docs:** https://ejs.co/

---

## ✅ Checklist Final

- [ ] Controlador admin.controller.js completo
- [ ] Middleware timeProtection.js implementado
- [ ] Logger configurado
- [ ] Vista Dashboard.ejs creada
- [ ] Vista UserList.ejs creada
- [ ] Vista UserForm.ejs creada
- [ ] Validadores agregados
- [ ] Rutas de admin configuradas
- [ ] CSRF protection (opcional)
- [ ] Tests básicos (opcional)
- [ ] Documentación actualizada

---

**Nota:** Seguir el mismo estilo de código y buenas prácticas del módulo de autenticación ya implementado.
