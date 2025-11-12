import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { isGuest, isAuthenticated } from '../middleware/auth.middleware.js';
import { validateLogin, validateRegister } from '../middleware/validators.js';
import { authLimiter, registerLimiter } from '../middleware/rateLimiter.js';
import csurf from 'csurf';

const router = express.Router();
const csrfProtection = csurf({ cookie: true });

// Rutas públicas (solo accesibles si NO está autenticado)
router.get('/login', isGuest, csrfProtection, authController.showLoginForm);
router.get('/register', isGuest, csrfProtection, authController.showRegisterForm);

// Rutas de autenticación con rate limiting y validación
router.post('/login', isGuest, csrfProtection, authLimiter, validateLogin, authController.login);
router.post('/register', isGuest, csrfProtection, registerLimiter, validateRegister, authController.register);

// Ruta de logout (protegida)
router.post('/logout', isAuthenticated, authController.logout);
router.get('/logout', isAuthenticated, authController.logout);

// Ruta de dashboard (protegida - ejemplo)
router.get('/dashboard', isAuthenticated, authController.dashboard);

export default router;