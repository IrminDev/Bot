import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

// --- Vistas (GET) ---

export const showAdminDashboard = async (req, res) => {
    try {
        const stats = {
            totalUsers: await prisma.user.count(),
            totalAdmins: await prisma.user.count({ where: { role: 'admin' } })
        };

        res.render('admin/Dashboard', {
            pageTitle: 'Panel de Administración',
            stats: stats,
            messages: { success: req.flash('success'), error: req.flash('error') }
        });
    } catch (error) {
        req.flash('error', 'No se pudo cargar el panel.');
        res.redirect('/');
    }
};

export const listUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, email: true, role: true }
        });
        
        res.render('admin/UserList', {
            pageTitle: 'Gestión de Usuarios',
            users: users,
            messages: { success: req.flash('success'), error: req.flash('error') }
        });
    } catch (error) {
        req.flash('error', 'Error al obtener usuarios.');
        res.redirect('/admin');
    }
};

export const showCreateUser = (req, res) => {
    res.render('admin/UserForm', {
        pageTitle: 'Crear Nuevo Usuario',
        user: {},
        isEdit: false,
        csrfToken: req.csrfToken(),
        errors: req.flash('errors')
    });
};

export const showEditUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, email: true, role: true }
        });

        if (!user) {
            req.flash('error', 'Usuario no encontrado.');
            return res.redirect('/admin/users');
        }

        res.render('admin/UserForm', {
            pageTitle: `Editar Usuario: ${user.username}`,
            user: user,
            isEdit: true,
            csrfToken: req.csrfToken(),
            errors: req.flash('errors')
        });

    } catch (error) {
        req.flash('error', 'Error al buscar el usuario.');
        res.redirect('/admin/users');
    }
};

// --- Acciones (POST, PUT, DELETE) ---

export const createUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    
    try {
        // Verificar duplicados
        if (await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } })) {
            req.flash('error', 'El nombre de usuario o email ya están en uso.');
            return res.redirect('/admin/users/create');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await prisma.user.create({
            data: { username, email, password: hashedPassword, role: role || 'user' }
        });
        
        req.flash('success', `Usuario ${newUser.username} creado exitosamente.`);
        res.redirect('/admin/users');

    } catch (error) {
        req.flash('error', 'Error de servidor al crear el usuario.');
        res.redirect('/admin/users/create');
    }
};

export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password, role } = req.body;

    try {
        const updateData = { username, email, role: role || 'user' };
        
        // Hashear si se provee una nueva contraseña
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });
        
        req.flash('success', `Usuario ${updatedUser.username} actualizado exitosamente.`);
        res.redirect('/admin/users');

    } catch (error) {
        req.flash('error', 'Error al actualizar el usuario.');
        res.redirect(`/admin/users/${userId}/edit`);
    }
};

export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await prisma.user.delete({
            where: { id: userId }
        });
        
        req.flash('success', `Usuario ${deletedUser.username || userId} eliminado exitosamente.`);
        res.redirect('/admin/users');
        
    } catch (error) {
        req.flash('error', 'El usuario no fue encontrado o hubo un error.');
        res.redirect('/admin/users');
    }
};