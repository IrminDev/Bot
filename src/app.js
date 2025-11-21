import express from "express";
import session from "express-session";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import flash from "connect-flash";
import prisma from "./lib/prisma.js";

import morgan from "morgan"; 
import cookieParser from "cookie-parser"; 
import methodOverride from "method-override"; 

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Error loading .env:', result.error);
} else {
  console.log('Loaded environment variables:', Object.keys(result.parsed || {}));
}
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'Set' : 'Not set');

const app = express();

// Logger (Morgan)
app.use(morgan('dev'));

// Seguridad con Helmet
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method Override
app.use(methodOverride('_method'));

// Cookie Parser
app.use(cookieParser(process.env.SESSION_SECRET));

// Configuración de sesiones
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { 
            httpOnly: true, 
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 // 24 horas
        }
    })
);

app.use(flash());

// Middleware para variables globales en las vistas
app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId || null;
    res.locals.userEmail = req.session.userEmail || null;
    res.locals.userRole = req.session.userRole || null;
    
    next();
});

// Motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "views"));

// Rate limiting general
app.use(generalLimiter);

// Ruta principal
app.get("/", (req, res) => {
    if (req.session.userId) {
        return res.redirect("/auth/dashboard");
    }
    res.redirect("/auth/login");
});

// Rutas
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// Manejo de errores generales
app.use(notFoundHandler);
app.use(errorHandler);

// Manejo de cierre graceful de Prisma
process.on('beforeExit', async () => {
    try {
      await prisma.$disconnect();
      console.log('Prisma disconnected gracefully');
    } catch (e) {
      console.error('Error during prisma disconnect', e);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access at: http://localhost:${PORT}`);
});