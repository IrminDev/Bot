/**
 * Middleware para manejar errores 404
 */
export const notFoundHandler = (req, res, next) => {
    res.status(404).render('Error', {
        title: 'Página no encontrada',
        message: 'La página que buscas no existe',
        statusCode: 404
    });
};

/**
 * Middleware para manejar errores generales
 */
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);

    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : err.message;

    res.status(statusCode).render('Error', {
        title: 'Error',
        message: message,
        statusCode: statusCode,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
};
