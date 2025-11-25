# YAP Chat - Backend API

API REST para sistema de mensajería en tiempo real construida con Node.js, Express y MongoDB.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Verificación de email
- ✅ Sistema de conversaciones 1 a 1
- ✅ Mensajería con paginación
- ✅ Actualización de perfil
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
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

4. Iniciar servidor de desarrollo:

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
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 23,
    "totalPages": 1
  }
}
```

**Nota:** Los mensajes se marcan automáticamente como leídos al obtenerlos.

**Errores:**

- `403` - No eres participante de esta conversación
- `404` - Conversación no encontrada

---

#### 3. Eliminar Mensaje

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
- `500` - Error del servidor

---

## 📝 Notas Importantes

1. **Verificación de email**: Los usuarios deben verificar su email antes de poder iniciar sesión
2. **Conversaciones 1 a 1**: Solo se permiten conversaciones entre 2 usuarios
3. **Marcar como leído**: Los mensajes se marcan automáticamente como leídos al obtenerlos
4. **Eliminación en cascada**: Al eliminar una conversación, también se eliminan sus mensajes

---

## 🚀 Deploy

El backend está preparado para deploy en:

- **Render** (recomendado)
- **Railway**
- **Heroku**
- **Vercel** (solo funciones serverless)

Variables de entorno necesarias en producción:

- Todas las del archivo `.env`
- `NODE_ENV=production`

---

## 👨‍💻 Autor

**Juan Alderete**

- GitHub: [@JuanAlderete](https://github.com/JuanAlderete)
- Proyecto: [yap-chat-backend](https://github.com/JuanAlderete/yap-chat-backend)

---

## 🤝 Contribuciones

Este proyecto es parte de un trabajo final de curso. No se aceptan contribuciones externas en este momento.