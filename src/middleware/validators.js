import { body, validationResult } from 'express-validator';

/**
 * Middleware para manejar errores de validación
 */
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        req.flash('error', errorMessages.join(', '));
        // Redirigir a la página anterior o a login por defecto
        const referer = req.get('referer') || '/auth/login';
        return res.redirect(referer);
    }
    next();
};

/**
 * Validaciones para el registro de usuario (Público)
 */
export const validateRegister = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('El email es demasiado largo'),
    
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        }),
    
    handleValidationErrors
];

/**
 * Validaciones para crear usuario (Admin)
 * (Agregamos esto porque admin.routes.js lo pide)
 */
export const validateCreateUser = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),

    handleValidationErrors
];

/**
 * Validaciones para editar usuario (Admin)
 * (Agregamos esto porque admin.routes.js lo pide)
 */
export const validateUpdateUser = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    
    // En update, la contraseña suele ser opcional, 
    // pero validamos que si la envían, cumpla mínimos.
    body('password')
        .optional({ checkFalsy: true }) // Si está vacío, lo ignora
        .trim()
        .isLength({ min: 6 })
        .withMessage('Si cambias la contraseña, debe tener 6 caracteres'),

    handleValidationErrors
];

/**
 * Validaciones para el login
 */
export const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .notEmpty()
        .withMessage('La contraseña es requerida'),
    
    handleValidationErrors
];