import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

/**
 * Muestra el formulario de login
 */
export const showLoginForm = (req, res) => {
    res.render("Login", { 
        error: req.flash('error'),
        success: req.flash('success')
    });
};

/**
 * Muestra el formulario de registro
 */
export const showRegisterForm = (req, res) => {
    res.render("Register", { 
        error: req.flash('error'),
        success: req.flash('success')
    });
};

/**
 * Procesa el login del usuario
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            req.flash('error', 'Credenciales inválidas');
            return res.redirect('/auth/login');
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            req.flash('error', 'Credenciales inválidas');
            return res.redirect('/auth/login');
        }

        // Regenerar la sesión para seguridad
        req.session.regenerate((err) => {
            if (err) {
                console.error('Error al regenerar sesión:', err);
                req.flash('error', 'Error al iniciar sesión');
                return res.redirect('/auth/login');
            }

            // Guardar datos en la nueva sesión
            req.session.userId = user.id;
            req.session.userEmail = user.email;
            req.session.userRole = user.role;

            req.flash('success', 'Inicio de sesión exitoso');
            
            // Redirigir según el rol
            if (user.role === 'admin') {
                return res.redirect('/admin');
            }
            
            // --- CORRECCIÓN AQUÍ ---
            // Antes redirigía a '/dashboard' (que no existe)
            // Ahora redirige a '/auth/dashboard' (que sí existe)
            return res.redirect('/auth/dashboard');
        });

    } catch (error) {
        console.error('Error en login:', error);
        req.flash('error', 'Error al procesar el inicio de sesión');
        res.redirect('/auth/login');
    }
};

/**
 * Procesa el registro de un nuevo usuario
 */
export const register = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Verificar que las contraseñas coincidan
        if (password !== confirmPassword) {
            req.flash('error', 'Las contraseñas no coinciden');
            return res.redirect('/auth/register');
        }

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            req.flash('error', 'El email ya está registrado');
            return res.redirect('/auth/register');
        }

        // Hash de la contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear usuario
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'user' // Por defecto todos son usuarios normales
            }
        });

        req.flash('success', 'Registro exitoso. Por favor inicia sesión.');
        res.redirect('/auth/login');

    } catch (error) {
        console.error('Error en registro:', error);
        req.flash('error', 'Error al procesar el registro');
        res.redirect('/auth/register');
    }
};

/**
 * Cierra la sesión del usuario
 */
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
};

/**
 * Muestra el dashboard del usuario
 */
export const dashboard = (req, res) => {
    res.render("Dashboard", {
        user: {
            email: req.session.userEmail,
            role: req.session.userRole
        }
    });
};