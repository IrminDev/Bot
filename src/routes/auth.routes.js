import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { isGuest, isAuthenticated } from '../middleware/auth.middleware.js';
import { validateLogin, validateRegister } from '../middleware/validators.js';
import { authLimiter, registerLimiter, timeProtection } from '../middleware/rateLimiter.js';


const router = express.Router();

// Rutas públicas
router.get('/login', authController.showLoginForm);
router.get('/register', authController.showRegisterForm);

// Rutas de autenticación con protección de tiempo, rate limiting y validación
router.post('/login', timeProtection, authLimiter, validateLogin, authController.login);
router.post('/register', registerLimiter, validateRegister, authController.register);

// Ruta de logout (protegida)
router.post('/logout', isAuthenticated, authController.logout);
router.get('/logout', isAuthenticated, authController.logout);

// Ruta de dashboard (protegida)
// Esta ruta responde a: /auth/dashboard
router.get('/dashboard', isAuthenticated, authController.dashboard);

export default router;