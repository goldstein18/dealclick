# 🚀 DealClick Backend API

API backend para DealClick - La red social #1 de bienes raíces en América Latina.

## 🏗️ Stack Tecnológico

- **Framework:** NestJS 11
- **Database:** PostgreSQL (Supabase)
- **ORM:** TypeORM
- **Authentication:** JWT + Passport + Face ID
- **Storage:** Backblaze B2 + Cloudflare CDN
- **Image Processing:** Sharp (WebP, auto-resize)
- **Validation:** class-validator
- **Language:** TypeScript

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── auth/                  # Autenticación y autorización
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/                 # Gestión de usuarios
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── properties/            # Propiedades inmobiliarias
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── properties.controller.ts
│   │   ├── properties.service.ts
│   │   └── properties.module.ts
│   ├── requirements/          # Requerimientos de usuarios
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── requirements.controller.ts
│   │   ├── requirements.service.ts
│   │   └── requirements.module.ts
│   ├── advisors/              # Asesores y brokers
│   │   ├── advisors.controller.ts
│   │   ├── advisors.service.ts
│   │   └── advisors.module.ts
│   ├── storage/               # Upload de imágenes (B2 + CDN)
│   │   ├── storage.controller.ts
│   │   ├── storage.service.ts
│   │   └── storage.module.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── env.example
```

## 🔌 Endpoints Principales

### Authentication (`/auth`)

```typescript
POST   /auth/register          // Registro de nuevo usuario
POST   /auth/login             // Login con email/password
POST   /auth/biometric-login   // Login con Face ID/Touch ID (requiere token)
POST   /auth/refresh           // Refresh token
POST   /auth/me                // Obtener perfil del usuario actual
```

### Users (`/users`)

```typescript
GET    /users/:id              // Obtener usuario por ID
GET    /users/handle/:handle   // Obtener usuario por @handle
PATCH  /users/:id              // Actualizar perfil (requiere auth)
```

### Properties (`/properties`)

```typescript
GET    /properties                          // Listar propiedades (con filtros)
GET    /properties/:id                      // Obtener propiedad específica
GET    /properties/user/:userId             // Propiedades de un usuario
POST   /properties                          // Crear propiedad (requiere auth)
PATCH  /properties/:id                      // Actualizar propiedad (requiere auth)
DELETE /properties/:id                      // Eliminar propiedad (requiere auth)
POST   /properties/:id/like                 // Like a propiedad (requiere auth)
POST   /properties/:id/view                 // Incrementar vistas
```

**Query Parameters para filtros:**
- `type` - Tipo de propiedad (Casa, Departamento, etc.)
- `minPrice` - Precio mínimo
- `maxPrice` - Precio máximo
- `location` - Ubicación
- `beds` - Número mínimo de habitaciones
- `baths` - Número mínimo de baños
- `page` - Página (default: 1)
- `limit` - Items por página (default: 10)

### Requirements (`/requirements`)

```typescript
GET    /requirements                        // Listar requerimientos (con filtros)
GET    /requirements/:id                    // Obtener requerimiento específico
GET    /requirements/user/:userId           // Requerimientos de un usuario
POST   /requirements                        // Crear requerimiento (requiere auth)
PATCH  /requirements/:id                    // Actualizar requerimiento (requiere auth)
DELETE /requirements/:id                    // Eliminar requerimiento (requiere auth)
POST   /requirements/:id/like               // Like a requerimiento (requiere auth)
```

**Query Parameters:**
- `propertyType` - Tipo de propiedad buscada
- `location` - Ubicación
- `page` - Página
- `limit` - Items por página

### Advisors (`/advisors`)

```typescript
GET    /advisors                            // Listar asesores (con filtros)
GET    /advisors/:id                        // Obtener asesor específico
GET    /advisors/:id/properties             // Propiedades del asesor
```

**Query Parameters:**
- `estado` - Estado/ubicación
- `especialidad` - Especialidad
- `empresa` - Empresa
- `search` - Búsqueda por nombre o empresa
- `page` - Página
- `limit` - Items por página

### Storage (`/storage`) 🆕

```typescript
POST   /storage/upload                      // Upload imagen individual (requiere auth)
POST   /storage/upload-multiple             // Upload múltiples imágenes (requiere auth)
```

**Features:**
- ✅ Auto-resize a 4 tamaños (original, thumbnail, medium, large)
- ✅ Conversión automática a WebP
- ✅ CDN global con Cloudflare
- ✅ Validación de formato y tamaño (max 10MB)
- ✅ Almacenamiento en Backblaze B2 ($0.006/GB/mes)

**Response:**
```json
{
  "original": "https://cdn.dealclick.com/original/abc123.webp",
  "thumbnail": "https://cdn.dealclick.com/thumbnail/abc123.webp",
  "medium": "https://cdn.dealclick.com/medium/abc123.webp",
  "large": "https://cdn.dealclick.com/large/abc123.webp"
}
```

📚 **Guía completa:** `BACKBLAZE_B2_SETUP.md`

## 🚀 Setup e Instalación

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar Base de Datos

Crear una base de datos PostgreSQL:

```bash
# Con Docker
docker run --name dealclick-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=dealclick \
  -p 5432:5432 \
  -d postgres:15

# O instalar PostgreSQL localmente
```

### 3. Configurar Variables de Entorno

```bash
cp env.example .env
# Editar .env con tus credenciales
```

### 4. Iniciar el Servidor

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm start
```

El servidor estará corriendo en `http://localhost:3000`

## 📊 Modelos de Datos

### User
```typescript
{
  id: uuid,
  email: string (unique),
  password: string (hashed),
  name: string,
  userHandle: string (unique),
  avatar: string?,
  phone: string?,
  whatsappNumber: string?,
  role: string (agent|broker|admin),
  license: string?,
  company: string?,
  bio: string?,
  experience: string?,
  specialties: string[],
  ubicacion: string?,
  isActive: boolean,
  isVerified: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Property
```typescript
{
  id: uuid,
  title: string,
  description: text,
  price: string,
  location: string,
  propertyType: string,
  images: string[],
  beds: number?,
  baths: number?,
  area: number?,
  parking: number?,
  yearBuilt: number?,
  status: string,
  amenities: string[],
  features: string[],
  views: number,
  likes: number,
  userId: uuid,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Requirement
```typescript
{
  id: uuid,
  requirement: text (max 280 chars),
  propertyType: string?,
  location: string?,
  budget: string?,
  likes: number,
  replies: number,
  userId: uuid,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🔐 Autenticación

### Registro
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "María González",
  "userHandle": "mariagonzalez",
  "phone": "+56912345678",
  "whatsappNumber": "56912345678",
  "company": "RE/MAX"
}

# Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "María González",
    ...
  }
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response: Same as register
```

### Uso del Token
```bash
GET /properties
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Ejemplos de Uso

### Crear una Propiedad
```bash
POST /properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Casa moderna en Las Condes",
  "description": "Hermosa casa con acabados de lujo...",
  "price": "$85,000,000",
  "location": "Las Condes, Santiago",
  "propertyType": "Casa",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "beds": 4,
  "baths": 3,
  "area": 320,
  "parking": 2,
  "yearBuilt": 2022,
  "status": "En Venta",
  "amenities": ["Piscina", "Gimnasio", "Jardín"],
  "features": ["Pisos de mármol", "Sistema de calefacción"]
}
```

### Crear un Requerimiento
```bash
POST /requirements
Authorization: Bearer <token>
Content-Type: application/json

{
  "requirement": "Busco departamento de 2-3 dormitorios en Las Condes",
  "propertyType": "Departamento",
  "location": "Las Condes",
  "budget": "Hasta $90,000,000"
}
```

### Buscar Propiedades con Filtros
```bash
GET /properties?type=Casa&location=Las%20Condes&beds=3&page=1&limit=10
```

### Buscar Asesores
```bash
GET /advisors?estado=CDMX&especialidad=Residencial&empresa=RE/MAX
```

## 🔧 Características Técnicas

### Validación
- ✅ DTOs con class-validator
- ✅ Validación automática en todos los endpoints
- ✅ Transformación de datos
- ✅ WhiteList activado (seguridad)

### Seguridad
- ✅ JWT tokens con expiración de 30 días
- ✅ Passwords hasheados con bcrypt
- ✅ Guards para proteger rutas
- ✅ CORS habilitado para mobile app
- ✅ Validación de ownership (users solo pueden editar sus propios recursos)

### Base de Datos
- ✅ Relaciones configuradas (User -> Properties, User -> Requirements)
- ✅ Indexes para optimización
- ✅ Migrations ready (TypeORM)
- ✅ Soft deletes disponible

### Paginación
- ✅ Todos los listados soportan paginación
- ✅ Response incluye: `data`, `total`, `page`, `totalPages`

### Filtros
- ✅ Filtros por tipo, ubicación, precio, etc.
- ✅ Búsqueda por texto
- ✅ Ordenamiento por fecha (más reciente primero)

## 🧪 Testing

```bash
# Crear usuario de prueba
POST /auth/register
{
  "email": "test@dealclick.com",
  "password": "test123",
  "name": "Test User",
  "userHandle": "testuser"
}

# Crear propiedad de prueba
POST /properties
# (con el token del usuario de prueba)

# Listar propiedades
GET /properties
```

## 📦 Deployment

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
# Build
npm run build

# Start
npm start
```

### Docker
```bash
# Crear Dockerfile (próximamente)
docker build -t dealclick-api .
docker run -p 3000:3000 dealclick-api
```

## 🌐 Variables de Entorno

Crear archivo `.env` basado en `env.example`:

```env
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=dealclick
JWT_SECRET=your-super-secret-key-here
```

## 🔄 Próximas Características

- [ ] Upload de imágenes (AWS S3, Cloudinary)
- [ ] Chat en tiempo real (WebSockets)
- [ ] Notificaciones push
- [ ] Email service (SendGrid, AWS SES)
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Rate limiting
- [ ] Caching (Redis)
- [ ] Search con Elasticsearch
- [ ] Webhooks

## 🤝 Integración con la App Móvil

### Conectar desde React Native

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // o tu URL de producción
});

// Agregar token a todas las requests
api.interceptors.request.use((config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ejemplo: Obtener propiedades
export const getProperties = async (filters) => {
  const response = await api.get('/properties', { params: filters });
  return response.data;
};

// Ejemplo: Crear propiedad
export const createProperty = async (propertyData) => {
  const response = await api.post('/properties', propertyData);
  return response.data;
};
```

### Actualizar Context en la App

```typescript
// En FeedContext.tsx
const addRequirement = async (requirement: RequirementData) => {
  try {
    // Optimistic update
    setRequirements([requirement, ...requirements]);
    
    // Send to API
    const response = await api.post('/requirements', {
      requirement: requirement.requirement,
      propertyType: requirement.propertyType,
      location: requirement.location,
      budget: requirement.budget,
    });
    
    // Update with server data
    setRequirements(prev => 
      prev.map(r => r.id === requirement.id ? response.data : r)
    );
  } catch (error) {
    // Revert on error
    setRequirements(prev => 
      prev.filter(r => r.id !== requirement.id)
    );
    Alert.alert('Error', 'No se pudo publicar');
  }
};
```

## 📚 Documentación API

### Swagger (Próximamente)
Una vez configurado Swagger, la documentación interactiva estará disponible en:
```
http://localhost:3000/api/docs
```

## 🛠️ Troubleshooting

### Error: Cannot connect to database
```bash
# Verificar que PostgreSQL esté corriendo
docker ps

# O verificar servicio local
brew services list
```

### Error: Port 3000 already in use
```bash
# Cambiar puerto en .env
PORT=3001

# O matar el proceso
lsof -ti:3000 | xargs kill
```

## 🎯 Next Steps

1. **Setup Database**
   ```bash
   docker run --name dealclick-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
   ```

2. **Copy env file**
   ```bash
   cp env.example .env
   ```

3. **Start server**
   ```bash
   npm run start:dev
   ```

4. **Test endpoints**
   ```bash
   curl http://localhost:3000/properties
   ```

## 🚀 ¡El backend está listo para conectarse con tu app móvil!

