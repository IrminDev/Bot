import rateLimit from 'express-rate-limit';

/**
 * Rate limiter para rutas de autenticación
 * Previene ataques de fuerza bruta
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 intentos
    message: 'Demasiados intentos de inicio de sesión. Por favor, intente nuevamente en 15 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        req.flash('error', 'Demasiados intentos. Por favor, espere 15 minutos.');
        res.redirect('/auth/login');
    }
});

/**
 * Rate limiter para registro de usuarios
 */
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // Máximo 3 registros por hora
    message: 'Demasiados registros desde esta IP. Por favor, intente más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        req.flash('error', 'Límite de registros alcanzado. Intente más tarde.');
        res.redirect('/auth/register');
    }
});

/**
 * Rate limiter general para la API
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 peticiones
    message: 'Demasiadas peticiones desde esta IP.',
    standardHeaders: true,
    legacyHeaders: false
});
