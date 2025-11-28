import rateLimit from 'express-rate-limit';

// Store para rastrear timestamps de intentos por IP
const attemptTimestamps = new Map();
const blockedIPs = new Map();

/**
 * Middleware para detectar intentos rápidos consecutivos
 * Bloquea si hay 2 intentos en menos de 200ms
 */
export const timeProtection = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Verificar si la IP está bloqueada
    if (blockedIPs.has(clientIP)) {
        const blockUntil = blockedIPs.get(clientIP);
        if (now < blockUntil) {
            const minutesLeft = Math.ceil((blockUntil - now) / 60000);
            console.log(`🚫 IP ${clientIP} aún bloqueada (${minutesLeft} minutos restantes)`);
            req.flash('error', `Has sido bloqueado por intentos sospechosos. Intenta nuevamente en ${minutesLeft} minutos.`);
            return res.status(429).send('Bloqueado por 15 minutos debido a intentos sospechosos');
        } else {
            // El bloqueo expiró, limpiar
            blockedIPs.delete(clientIP);
            attemptTimestamps.delete(clientIP);
        }
    }
    
    // Obtener el último intento
    const lastAttempt = attemptTimestamps.get(clientIP);
    
    if (lastAttempt) {
        const timeDiff = now - lastAttempt;
        
        // Si hay 2 intentos en menos de 200ms, bloquear por 15 minutos
        if (timeDiff < 200) {
            const blockUntil = now + (15 * 60 * 1000); // 15 minutos
            blockedIPs.set(clientIP, blockUntil);
            console.log(`🚫 IP ${clientIP} bloqueada por intentos rápidos (${timeDiff}ms entre intentos)`);
            req.flash('error', 'Detectados intentos sospechosos. Bloqueado por 15 minutos.');
            return res.status(429).send('Bloqueado por 15 minutos debido a intentos sospechosos');
        }
    }
    
    // Registrar este intento
    attemptTimestamps.set(clientIP, now);
    
    // Limpiar registros antiguos (más de 1 segundo)
    setTimeout(() => {
        const current = attemptTimestamps.get(clientIP);
        if (current === now) {
            attemptTimestamps.delete(clientIP);
        }
    }, 1000);
    
    next();
};

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
