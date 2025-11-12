// src/routes/admin.routes.js

import express from 'express';
import csurf from 'csurf'; 
import * as adminController from '../controllers/admin.controller.js';

// Importa Middlewares
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware.js';
import { timeProtection } from '../middleware/timeProtection.js';
import { validateCreateUser, validateUpdateUser } from '../middleware/validators.js';

const router = express.Router();

// Inicialización de Middleware de Seguridad
const csrfProtection = csurf({ cookie: true });

// Middlewares de Acceso para Admin
const adminAccess = [isAuthenticated, isAdmin, timeProtection];


// --- Dashboard ---
router.get('/', adminAccess, adminController.showAdminDashboard);


// --- Gestión de Usuarios (CRUD) ---

// Lista de usuarios
router.get('/users', adminAccess, adminController.listUsers);

// Formulario crear (GET)
router.get('/users/create', adminAccess, csrfProtection, adminController.showCreateUser);

// Crear usuario (POST)
router.post('/users', adminAccess, csrfProtection, validateCreateUser, adminController.createUser);

// Formulario editar (GET)
router.get('/users/:id/edit', adminAccess, csrfProtection, adminController.showEditUser);

// Actualizar usuario (PUT)
router.put('/users/:id', adminAccess, csrfProtection, validateUpdateUser, adminController.updateUser);

// Eliminar usuario (DELETE)
router.delete('/users/:id', adminAccess, csrfProtection, adminController.deleteUser);


export default router;