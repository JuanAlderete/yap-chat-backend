# YAP Chat - Backend API

[![Deploy Status](https://img.shields.io/badge/deploy-render-46E3B7?logo=render&logoColor=white)](https://yap-chat-api.onrender.com)

API REST para sistema de mensajería en tiempo real construida con Node.js, Express y MongoDB.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Verificación de email
- ✅ Sistema de conversaciones 1 a 1
- ✅ Mensajería
- ✅ Actualización de perfil
- ✅ Búsqueda de usuarios
- ✅ Edición y eliminación de mensajes
- ✅ Arquitectura en capas (Routes → Controllers → Services → Repositories)
- ✅ Validaciones con express-validator
- ✅ TypeScript
- ✅ Manejo centralizado de errores

## 🛠️ Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **nodemailer** - Envío de emails
- **express-validator** - Validaciones

## ⚙️ Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/JuanAlderete/yap-chat-backend.git
cd yap-chat-backend
```

2. Instalar dependencias:

```bash
npm install
# o
pnpm install
```

3. Crear archivo `.env` con las siguientes variables:

```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/dbname
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRE=7d o 86400
EMAIL_HOST=gmail
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
NODE_ENV=development
```

### Configuración de Email (Gmail)

Para enviar emails de verificación, necesitas:

1. Habilitar "Verificación en 2 pasos" en tu cuenta de Google
2. Generar una "Contraseña de aplicación":

   - Ve a [Configuración de Google](https://myaccount.google.com/security)
   - Busca "Contraseñas de aplicaciones"
   - Crea una nueva para "Correo"
   - Usa esa contraseña en `EMAIL_PASS`

3. Iniciar servidor de desarrollo:

```bash
npm run dev
```

5. Compilar para producción:

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Base URL

```
http://localhost:3000/api
```

---

### 🔍 Health Check

```http
GET /api/health
```

**Respuesta exitosa (200):**

```json
{
  "message": "OK"
}
```

Endpoint público para verificar que el servidor está funcionando.

---

### 🔐 Autenticación (`/auth`)

#### 1. Registrar Usuario

```http
POST /auth/register
```

**Body:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Usuario registrado. Revisa tu email para verificar tu cuenta.",
  "user": {
    "_id": "673f8a1b2c3d4e5f6a7b8c9d",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "isVerified": false,
    "created_at": "2024-11-21T10:30:00.000Z"
  }
}
```

**Errores:**

- `400` - Email ya existe
- `400` - Datos inválidos (validación)

---

#### 2. Verificar Email

```http
GET /auth/verify-email/:token
```

**Parámetros:**

- `token` - Token de verificación enviado por email

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Email verificado exitosamente"
}
```

**Errores:**

- `400` - Token inválido o expirado

---

#### 3. Iniciar Sesión

```http
POST /auth/login
```

**Body:**

```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "user": {
    "_id": "673f8a1b2c3d4e5f6a7b8c9d",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "avatar": "https://...",
    "isVerified": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**

- `400` - Email no verificado
- `401` - Credenciales incorrectas
- `404` - Usuario no encontrado

---

#### 4. Obtener Perfil (Protegido)

```http
GET /auth/profile
```

**Headers:**

```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "user": {
    "_id": "673f8a1b2c3d4e5f6a7b8c9d",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "avatar": "https://...",
    "isVerified": true
  }
}
```

**Errores:**

- `401` - Token inválido o expirado

---

#### 5. Actualizar Perfil (Protegido)

```http
PUT /auth/profile
```

**Headers:**

```
Authorization: Bearer {token}
```

**Body:**

```json
{
  "name": "Juan Alderete",
  "avatar": "data:image/png;base64,..."
}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "673f8a1b2c3d4e5f6a7b8c9d",
    "name": "Juan Alderete",
    "email": "juan@example.com",
    "avatar": "data:image/png;base64,...",
    "isVerified": true
  }
}
```

**Errores:**

- `400` - Datos inválidos
- `401` - No autenticado

---

### 👥 Usuarios (`/auth/users`)

#### Buscar Usuarios

```http
GET /auth/users/search?query={query}
```

**Headers:**

```
Authorization: Bearer {token}
```

**Query Params:**

- `query` - Término de búsqueda (mínimo 2 caracteres)

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "users": [
    {
      "_id": "673f8a1b2c3d4e5f6a7b8c9e",
      "name": "María García",
      "email": "maria@example.com",
      "avatar": "https://..."
    }
  ]
}
```

**Errores:**

- `400` - Query muy corta (menos de 2 caracteres)
- `401` - No autenticado

**Notas:**

- Busca por nombre o email
- Excluye al usuario actual
- Solo muestra usuarios verificados
- Máximo 10 resultados

---

### 💬 Conversaciones (`/conversations`)

> **Nota:** Todos los endpoints requieren autenticación

#### 1. Crear o Obtener Conversación

```http
POST /conversations
```

**Headers:**

```
Authorization: Bearer {token}
```

**Body:**

```json
{
  "participantId": "673f8a1b2c3d4e5f6a7b8c9e"
}
```

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "conversation": {
    "_id": "673f9b2c3d4e5f6a7b8c9d0e",
    "participants": [
      {
        "_id": "673f8a1b2c3d4e5f6a7b8c9d",
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "avatar": "https://..."
      },
      {
        "_id": "673f8a1b2c3d4e5f6a7b8c9e",
        "name": "María García",
        "email": "maria@example.com",
        "avatar": "https://..."
      }
    ],
    "lastMessage": null,
    "lastMessageAt": null,
    "created_at": "2024-11-21T10:45:00.000Z"
  }
}
```

**Errores:**

- `400` - No puedes crear conversación contigo mismo
- `400` - Participant ID inválido
- `404` - Usuario participante no encontrado
- `409` - La conversación ya existe

---

#### 2. Listar Mis Conversaciones

```http
GET /conversations
```

**Headers:**

```
Authorization: Bearer {token}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "conversations": [
    {
      "_id": "673f9b2c3d4e5f6a7b8c9d0e",
      "otherUser": {
        "_id": "673f8a1b2c3d4e5f6a7b8c9e",
        "name": "María García",
        "email": "maria@example.com",
        "avatar": "https://..."
      },
      "lastMessage": "Hola, ¿cómo estás?",
      "lastMessageAt": "2024-11-21T11:00:00.000Z"
    }
  ]
}
```

---

#### 3. Obtener Conversación por ID

```http
GET /conversations/:id
```

**Headers:**

```
Authorization: Bearer {token}
```

**Parámetros:**

- `id` - ID de la conversación

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "conversation": {
    "_id": "673f9b2c3d4e5f6a7b8c9d0e",
    "participants": [
      {
        "_id": "673f8a1b2c3d4e5f6a7b8c9d",
        "name": "Juan Pérez",
        "email": "juan@example.com"
      },
      {
        "_id": "673f8a1b2c3d4e5f6a7b8c9e",
        "name": "María García",
        "email": "maria@example.com"
      }
    ],
    "lastMessage": "Hola, ¿cómo estás?",
    "lastMessageAt": "2024-11-21T11:00:00.000Z"
  }
}
```

**Errores:**

- `403` - No tienes acceso a esta conversación
- `404` - Conversación no encontrada

---

#### 4. Eliminar Conversación

```http
DELETE /conversations/:id
```

**Headers:**

```
Authorization: Bearer {token}
```

**Parámetros:**

- `id` - ID de la conversación

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Conversation and messages deleted successfully"
}
```

**Errores:**

- `403` - No tienes acceso a esta conversación
- `404` - Conversación no encontrada

---

### 📨 Mensajes (`/messages`)

> **Nota:** Todos los endpoints requieren autenticación

#### 1. Enviar Mensaje

```http
POST /messages
```

**Headers:**

```
Authorization: Bearer {token}
```

**Body:**

```json
{
  "conversationId": "673f9b2c3d4e5f6a7b8c9d0e",
  "content": "Hola, ¿cómo estás?"
}
```

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": {
    "_id": "673fa1c3d4e5f6a7b8c9d0f",
    "conversationId": "673f9b2c3d4e5f6a7b8c9d0e",
    "senderId": "673f8a1b2c3d4e5f6a7b8c9d",
    "content": "Hola, ¿cómo estás?",
    "isRead": false,
    "created_at": "2024-11-21T11:00:00.000Z"
  }
}
```

**Errores:**

- `400` - Contenido vacío o muy largo (máx 5000 caracteres)
- `403` - No eres participante de esta conversación
- `404` - Conversación no encontrada

---

#### 2. Obtener Mensajes de una Conversación

```http
GET /messages/:conversationId?page=1&limit=50
```

**Headers:**

```
Authorization: Bearer {token}
```

**Parámetros de URL:**

- `conversationId` - ID de la conversación

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "messages": [
    {
      "_id": "673fa1c3d4e5f6a7b8c9d0f",
      "conversationId": "673f9b2c3d4e5f6a7b8c9d0e",
      "senderId": {
        "_id": "673f8a1b2c3d4e5f6a7b8c9d",
        "name": "Juan Pérez",
        "avatar": "https://..."
      },
      "content": "Hola, ¿cómo estás?",
      "isRead": true,
      "readAt": "2024-11-21T11:01:00.000Z",
      "created_at": "2024-11-21T11:00:00.000Z"
    }
  ]
}
```

**Nota:** Los mensajes se marcan automáticamente como leídos al obtenerlos.

**Errores:**

- `403` - No eres participante de esta conversación
- `404` - Conversación no encontrada

---

#### 3. Actualizar Mensaje

```http
PUT /messages/:id
```

**Headers:**

```
Authorization: Bearer {token}
```

**Parámetros:**

- `id` - ID del mensaje

**Body:**

```json
{
  "content": "Mensaje editado"
}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": {
    "_id": "673fa1c3d4e5f6a7b8c9d0f",
    "conversationId": "673f9b2c3d4e5f6a7b8c9d0e",
    "senderId": {
      "_id": "673f8a1b2c3d4e5f6a7b8c9d",
      "name": "Juan Pérez",
      "avatar": "https://..."
    },
    "content": "Mensaje editado",
    "updated_at": "2024-11-21T11:05:00.000Z",
    "created_at": "2024-11-21T11:00:00.000Z"
  }
}
```

**Errores:**

- `400` - Contenido vacío o muy largo (máx 5000 caracteres)
- `403` - Solo puedes editar tus propios mensajes
- `404` - Mensaje no encontrado

---

#### 4. Eliminar Mensaje

```http
DELETE /messages/:id
```

**Headers:**

```
Authorization: Bearer {token}
```

**Parámetros:**

- `id` - ID del mensaje

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

**Errores:**

- `403` - Solo puedes eliminar tus propios mensajes
- `404` - Mensaje no encontrado

---

## 🗄️ Estructura de la Base de Datos

### Colección: `users`

```javascript
{
  _id: ObjectId,
  name: String,              // Nombre completo
  email: String,             // Único, índice
  password: String,          // Hasheado con bcrypt
  avatar: String,            // URL o Base64 (opcional)
  isVerified: Boolean,       // Default: false
  verificationToken: String, // Token para verificar email
  created_at: Date,
  updated_at: Date
}
```

### Colección: `conversations`

```javascript
{
  _id: ObjectId,
  participants: [ObjectId],  // Array de 2 user IDs
  lastMessage: String,       // Contenido del último mensaje
  lastMessageAt: Date,       // Fecha del último mensaje
  created_at: Date,
  updated_at: Date
}
```

### Colección: `messages`

```javascript
{
  _id: ObjectId,
  conversationId: ObjectId,  // Referencia a conversation
  senderId: ObjectId,        // Referencia a user
  content: String,           // Texto del mensaje
  isRead: Boolean,           // Default: false
  readAt: Date,              // Cuando fue leído
  created_at: Date,
  updated_at: Date
}
```

---

## 🔒 Autenticación

Todos los endpoints protegidos requieren un token JWT en el header:

```
Authorization: Bearer {token}
```

El token se obtiene al hacer login y tiene una expiración de 7 días (configurable en `.env`).

---

## ✅ Códigos de Estado HTTP

- `200` - Éxito
- `201` - Recurso creado
- `400` - Solicitud incorrecta (validación)
- `401` - No autenticado
- `403` - No autorizado
- `404` - Recurso no encontrado
- `409` - Conflicto (recurso ya existe o acción no permitida)
- `500` - Error del servidor

---

## 📝 Notas Importantes

1. **Verificación de email**: Los usuarios deben verificar su email antes de poder iniciar sesión
2. **Conversaciones 1 a 1**: Solo se permiten conversaciones entre 2 usuarios
3. **Marcar como leído**: Los mensajes se marcan automáticamente como leídos al obtenerlos
4. **Eliminación en cascada**: Al eliminar una conversación, también se eliminan sus mensajes
5. **Actualización de mensajes**: Solo puedes editar tus propios mensajes. El campo `updated_at` se actualiza automáticamente
6. **Búsqueda de usuarios**: La búsqueda es case-insensitive y busca coincidencias parciales en nombre y email
7. **Límite de contenido**: Los mensajes tienen un límite de 5000 caracteres
8. **CORS**: El backend acepta peticiones desde los orígenes configurados en `allowedOrigins` (ver `src/server.ts`)

---

## 🧪 Probando la API

### Con Postman

1. Importa la colección de Postman (archivo `postman_collection.json`)
2. Configura la variable `baseUrl` según tu entorno:
   - Desarrollo: `http://localhost:3000/api`
   - Producción: `https://tu-dominio.com/api`
3. Ejecuta primero "Register" y luego "Login" para obtener el token
4. El token se guarda automáticamente en las variables de colección

### Con cURL

```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "123456"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "123456"
  }'

# Obtener perfil (reemplaza {token} con el token obtenido en login)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer {token}"
```

---

## 🚀 Deploy

El backend está preparado para deploy en:

- **Render** (recomendado)
- **Railway**
- **Heroku**
- **Vercel** (solo funciones serverless)

### Configuración de Variables de Entorno en Render

1. Ve a tu servicio en Render
2. Settings → Environment
3. Agrega todas las variables del archivo `.env.example`
4. **IMPORTANTE**: Configura `BACKEND_URL` con la URL de tu deploy en Render
   - Ejemplo: `https://yap-chat-api.onrender.com`

Variables de entorno necesarias en producción:

- Todas las del archivo `.env`
- `NODE_ENV=production`

### Verificación del Deploy

Una vez desplegado, verifica que funciona:

```bash
curl https://tu-dominio.onrender.com/api/health
```

Deberías recibir: `{"message":"OK"}`

---

## 📦 Estructura del Proyecto

```
yap-chat-backend/
├── src/
│   ├── config/          # Configuraciones (DB, env)
│   ├── controllers/     # Controladores de rutas
│   ├── middleware/      # Middlewares (auth, validación, errores)
│   ├── models/          # Modelos de Mongoose
│   ├── repositories/    # Capa de acceso a datos
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── types/           # Tipos e interfaces de TypeScript
│   ├── utils/           # Utilidades (JWT, email, validadores)
│   └── server.ts        # Punto de entrada de la aplicación
├── .env.example         # Variables de entorno de ejemplo
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Missing required environment variables"

- Verifica que todas las variables del `.env` estén configuradas
- Asegúrate de que `MONGODB_URI` y `JWT_SECRET` no estén vacíos

### Error: "❌ Error al conectar a la base de datos"

- Verifica que tu IP esté en la whitelist de MongoDB Atlas
- Revisa que la URI de MongoDB sea correcta
- Comprueba que el usuario y contraseña de MongoDB sean correctos

### Error: "Invalid token" o "Token expired"

- El token JWT expira según `JWT_EXPIRE` (default 7 días)
- Haz login nuevamente para obtener un token nuevo

### Error al enviar emails

- Verifica que uses una "Contraseña de aplicación" de Gmail, no tu contraseña normal
- Asegúrate de tener habilitada la verificación en 2 pasos en Google
- Revisa que `EMAIL_HOST`, `EMAIL_USER` y `EMAIL_PASS` estén correctos

### CORS Error en frontend

- Agrega la URL de tu frontend a `allowedOrigins` en `src/server.ts`
- Si es local: `http://localhost:PUERTO`
- Si es producción: la URL completa de tu deploy

---

## 🏗️ Decisiones Técnicas

### Arquitectura en capas (Routes → Controllers → Services → Repositories)

Se adoptó una arquitectura en capas inspirada en el principio de responsabilidad única (SRP):

- **Routes**: solo definen los endpoints y aplican middlewares.
- **Controllers**: reciben el request y delegan al service, sin lógica de negocio.
- **Services**: contienen toda la lógica de negocio y orquestan llamadas a repositories.
- **Repositories**: son la única capa que interactúa con la base de datos.

Esto facilita el testing (se puede mockear cada capa), mejora la mantenibilidad y permite reemplazar partes sin afectar al resto.

### TypeScript en el backend

TypeScript aporta tipado estático que atrapa errores en tiempo de compilación en lugar de en runtime. En un backend REST esto es especialmente valioso porque:

- Los DTOs y types de respuesta quedan documentados en el código.
- Los errores de refactor (cambiar el nombre de un campo) se detectan inmediatamente.
- Mejora el autocompletado y la navegación en el editor, reduciendo la fricción al desarrollar.

### MongoDB

MongoDB fue elegido por:

- **Flexibilidad del schema**: el perfil de usuario y los mensajes caben naturalmente en documentos JSON.
- **Velocidad de iteración**: no requiere migraciones de esquema durante el desarrollo inicial.
- **Escalabilidad horizontal**: MongoDB Atlas permite escalar sin cambiar la arquitectura.
- **Integración con Mongoose**: el ODM provee validaciones, hooks y población de referencias de forma sencilla.

---

## 🔑 Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto en que escucha el servidor | `3000` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | `un_secreto_largo_y_aleatorio` |
| `JWT_EXPIRE` | Tiempo de expiración del token JWT | `7d` o `86400` |
| `EMAIL_HOST` | Host del servidor de correo | `gmail` |
| `EMAIL_PORT` | Puerto SMTP | `587` |
| `EMAIL_USER` | Usuario/dirección del remitente | `tu@gmail.com` |
| `EMAIL_PASS` | Contraseña de aplicación del email | `abcd efgh ijkl mnop` |
| `FRONTEND_URL` | URL del frontend (para CORS y redirecciones) | `https://yap-chat.vercel.app` |
| `BACKEND_URL` | URL pública del propio backend | `https://yap-chat-api.onrender.com` |
| `NODE_ENV` | Entorno de ejecución | `development` o `production` |

---

## 👨‍💻 Autor

**Juan Alderete**

- GitHub: [@JuanAlderete](https://github.com/JuanAlderete)
- Proyecto: [yap-chat-backend](https://github.com/JuanAlderete/yap-chat-backend)
- Postman collection: [YAP-Chat-API.postman_collection.json](https://github.com/JuanAlderete/yap-chat-backend/blob/master/docs/YAP-Chat-API.postman_collection.json)

---

## 🤝 Contribuciones

Este proyecto es parte de un trabajo final de curso. No se aceptan contribuciones externas en este momento.

## Notas

El backend decidi hacerlo con typescript, ya que yo tengo 3 años de experiencia en frontend con angular. Por lo que me pareció una buena opción aceptar el reto de typescript y realizar el backend con este lenguaje.

---
