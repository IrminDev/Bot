# 🚀 Inicio Rápido

## ⚡ Para Ejecutar el Proyecto

```bash
# 1. Asegúrate de estar en el directorio correcto
cd C:\Users\herna\OneDrive\Documents\Proyecto_security\Bot

# 2. Inicia el servidor
npm start

# 3. Abre en el navegador
http://localhost:3000
```

## 🎯 Primera Vez

Si es tu primera vez ejecutando el proyecto:

```bash
# 1. Instalar dependencias (si no lo has hecho)
npm install

# 2. Asegúrate que Docker esté corriendo
docker ps

# 3. Levanta la base de datos
docker compose up -d

# 4. Verifica que la BD esté lista
docker logs db

# 5. Ejecuta el servidor
npm start
```

## 📝 Crear Usuario de Prueba

1. Ve a: http://localhost:3000/auth/register
2. Llena el formulario:
   - Email: `test@ejemplo.com`
   - Password: `Test1234!`
   - Confirmar: `Test1234!`
3. Click en "Crear Cuenta"
4. Serás redirigido al login
5. Inicia sesión con esas credenciales

## 🔑 Crear Usuario Admin

```bash
# Opción 1: SQL directo
docker exec -it db psql -U admin -d bot-detection
UPDATE "User" SET role = 'admin' WHERE email = 'test@ejemplo.com';
\q

# Opción 2: Prisma Studio
npx prisma studio
# Luego edita el campo "role" a "admin"
```

## 🛑 Detener Todo

```bash
# Detener servidor Node (Ctrl + C en la terminal)

# Detener base de datos
docker compose down

# Detener y eliminar volúmenes (cuidado: borra datos)
docker compose down -v
```

## 📚 Documentación

- **RESUMEN_IMPLEMENTACION.md** → Lee esto primero
- **IMPLEMENTACION.md** → Detalles técnicos
- **TAREAS_COMPAÑERO.md** → Para el otro desarrollador

## ✅ Estado

- ✅ Tu parte: **100% completa**
- ⏳ Parte del compañero: **Pendiente**

## 🐛 ¿Problemas?

### El servidor no inicia
```bash
# Verifica que el puerto 3000 esté libre
netstat -ano | findstr :3000

# Si está ocupado, mata el proceso o cambia el puerto en .env
```

### No puedo conectar a la BD
```bash
# Verifica que Docker esté corriendo
docker ps

# Reinicia el contenedor
docker compose restart

# Verifica logs
docker logs db
```

### Error de módulos
```bash
# Reinstala dependencias
rm -rf node_modules
npm install
```

## 🎉 ¡Listo!

El proyecto está funcionando perfectamente. Disfruta explorando el sistema de autenticación implementado.
