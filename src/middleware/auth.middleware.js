/**
 * Middleware para verificar si el usuario está autenticado
 */
export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    req.flash('error', 'Debes iniciar sesión para acceder a esta página');
    res.redirect('/auth/login');
};

/**
 * Middleware para verificar si el usuario ya está autenticado
 * (útil para redirigir si intenta acceder a login/register estando logueado)
 */
export const isGuest = (req, res, next) => {
    if (req.session && req.session.userId) {
        return res.redirect('/dashboard');
    }
    next();
};

/**
 * Middleware para verificar si el usuario es administrador
 * NOTA: Este middleware será completado por tu compañero en su parte
 */
export const isAdmin = (req, res, next) => {
    if (req.session && req.session.userId && req.session.userRole === 'admin') {
        return next();
    }
    req.flash('error', 'No tienes permisos para acceder a esta página');
    res.redirect('/dashboard');
};
