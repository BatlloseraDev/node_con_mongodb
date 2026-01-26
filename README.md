#  Gestor de Tareas con Node.js y MongoDB

Este proyecto es una aplicación completa de gestión de tareas diseñada para afianzar conocimientos avanzados de desarrollo Backend. Permite a los usuarios registrarse, gestionar sus tareas en tiempo real y visualizar estadísticas del sistema, integrando múltiples tecnologías modernas en un solo ecosistema.

##  Características Principales

* **Gestión de Usuarios:** Registro e inicio de sesión seguro mediante JWT y autenticación de terceros con **Google OAuth**.
* **Gestión de Tareas:** CRUD completo de tareas con persistencia en MongoDB.
* **Tiempo Real:** Implementación de **WebSockets (Socket.io)** para actualizaciones instantáneas de tareas y notificaciones.
* **API Híbrida:** Soporte para endpoints REST (Express) y consultas flexibles con **GraphQL**.
* **Rendimiento:** Implementación de **Redis** para caché y optimización de respuestas.
* **Cliente Web:** Interfaz de usuario construida con **TypeScript** y **Vite**.
* **Testing:** Suite de pruebas unitarias y de integración robusta.

##  Stack Tecnológico

### Backend
* **Entorno:** Node.js
* **Framework:** Express.js
* **Base de Datos:** MongoDB (Mongoose)
* **Caché:** Redis
* **API:** GraphQL (Apollo/Express integration) & REST
* **Autenticación:** JSON Web Tokens (JWT) & Google Auth Library
* **Real-time:** Socket.io

### Frontend (Cliente)
* **Framework:** Vite
* **Lenguaje:** TypeScript
* **Comunicación:** Socket.io-client

### Testing & Calidad
* **Test Runner:** Vitest
* **HTTP Assertions:** Supertest

##  Instalación y Configuración

### Prerrequisitos
Asegúrate de tener instalado:
* Node.js (v18 o superior)
* MongoDB
* Redis

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd node_con_mongodb

```

### 2. Configurar el Backend

Instala las dependencias del servidor:

```bash
npm install

```

Configura las variables de entorno. Renombra el archivo `.env.example` a `.env` y rellena tus credenciales:

```bash
cp .env.example .env

```

*Asegúrate de configurar `DB_URL` y las credenciales de Google Auth.*

### 3. Configurar el Cliente (Frontend)

El cliente se encuentra en la carpeta `socket-client-ts`:

```bash
cd socket-client-ts
npm install

```

##  Ejecución

### Servidor (Backend)

Para levantar el servidor de desarrollo (asegúrate de que MongoDB y Redis estén corriendo):

```bash
# Desde la raíz del proyecto
nodemon app/app.js
# O si tienes configurado un script de start
npm start

```

El servidor escuchará por defecto en el puerto `9090` (o el que definas en el `.env`).

### Cliente (Frontend)

Para iniciar la interfaz de usuario:

```bash
cd socket-client-ts
npm run dev

```

##  Testing

El proyecto cuenta con tests implementados con **Vitest**. Para ejecutarlos:

```bash
npm test

```

o para una ejecución única:

```bash
npm run test:run

```

## Licencia

Este proyecto está bajo la licencia **ISC**.


