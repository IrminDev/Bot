import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * ========================================
 * RUTAS DEL PANEL DE ADMINISTRACIÓN
 * ========================================
 * 
 * PENDIENTE DE IMPLEMENTACIÓN POR: [Nombre del compañero]
 * 
 * TAREAS A REALIZAR:
 * 
 * 1. Crear controlador: src/controllers/admin.controller.js
 *    - showAdminDashboard: Muestra el panel principal de admin
 *    - listUsers: Lista todos los usuarios
 *    - showCreateUser: Muestra formulario de crear usuario
 *    - createUser: Crea un nuevo usuario (puede asignar rol admin)
 *    - showEditUser: Muestra formulario de editar usuario
 *    - updateUser: Actualiza un usuario existente
 *    - deleteUser: Elimina un usuario
 * 
 * 2. Crear vistas en src/views/admin/:
 *    - Dashboard.ejs: Panel principal con estadísticas
 *    - UserList.ejs: Lista de usuarios con opciones CRUD
 *    - UserForm.ejs: Formulario para crear/editar usuarios
 * 
 * 3. Implementar middleware adicionales:
 *    - src/middleware/timeProtection.js: Lógica de protección por tiempo
 *      (puede ser limitación de horarios de acceso o protección anti-timing attacks)
 *    - CSRF protection con csurf
 *    - Logger con winston/morgan
 * 
 * 4. Rutas a implementar (ejemplos):
 *    - GET  /admin              -> Dashboard principal
 *    - GET  /admin/users        -> Lista de usuarios
 *    - GET  /admin/users/create -> Formulario crear usuario
 *    - POST /admin/users        -> Crear usuario
 *    - GET  /admin/users/:id    -> Ver detalles de usuario
 *    - GET  /admin/users/:id/edit -> Formulario editar usuario
 *    - PUT  /admin/users/:id    -> Actualizar usuario
 *    - DELETE /admin/users/:id  -> Eliminar usuario
 * 
 * IMPORTANTE: 
 * - Todas las rutas deben usar isAuthenticated e isAdmin
 * - Implementar validaciones con express-validator
 * - Agregar mensajes flash para feedback
 * - Seguir el mismo patrón de código del módulo de autenticación
 */

// EJEMPLO DE ESTRUCTURA (DESCOMENTAR Y COMPLETAR):
/*
import * as adminController from '../controllers/admin.controller.js';
import { validateCreateUser, validateUpdateUser } from '../middleware/validators.js';

// Dashboard
router.get('/', isAuthenticated, isAdmin, adminController.showAdminDashboard);

// Gestión de usuarios
router.get('/users', isAuthenticated, isAdmin, adminController.listUsers);
router.get('/users/create', isAuthenticated, isAdmin, adminController.showCreateUser);
router.post('/users', isAuthenticated, isAdmin, validateCreateUser, adminController.createUser);
router.get('/users/:id/edit', isAuthenticated, isAdmin, adminController.showEditUser);
router.put('/users/:id', isAuthenticated, isAdmin, validateUpdateUser, adminController.updateUser);
router.delete('/users/:id', isAuthenticated, isAdmin, adminController.deleteUser);
*/

export default router;