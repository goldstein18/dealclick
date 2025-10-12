# 🏗️ DealClick Backend Architecture

## 📐 Arquitectura General

```
┌─────────────────────────────────────────────┐
│           React Native App (Mobile)         │
│  ┌─────────────────────────────────────┐   │
│  │  Components (PropertyCard, etc)     │   │
│  │  Contexts (FeedContext)              │   │
│  │  Services (api.ts)                   │   │
│  └──────────────┬──────────────────────┘   │
└─────────────────┼──────────────────────────┘
                  │ HTTP/REST
                  │ JWT Auth
                  ▼
┌─────────────────────────────────────────────┐
│            NestJS Backend API               │
│  ┌─────────────────────────────────────┐   │
│  │  Controllers (REST endpoints)        │   │
│  │  Services (Business logic)           │   │
│  │  Guards (Authentication)             │   │
│  │  DTOs (Validation)                   │   │
│  └──────────────┬──────────────────────┘   │
└─────────────────┼──────────────────────────┘
                  │ TypeORM
                  ▼
┌─────────────────────────────────────────────┐
│           PostgreSQL Database               │
│  ┌─────────────────────────────────────┐   │
│  │  users, properties, requirements     │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## 📦 Módulos

### 1. Auth Module
**Responsabilidad:** Autenticación y autorización

**Endpoints:**
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Login con email/password
- `POST /auth/biometric-login` - Login biométrico
- `POST /auth/refresh` - Refresh token
- `POST /auth/me` - Perfil del usuario actual

**Componentes:**
- `AuthController` - Maneja requests HTTP
- `AuthService` - Lógica de negocio (hash password, JWT)
- `JwtStrategy` - Estrategia de Passport para validar tokens
- `JwtAuthGuard` - Guard para proteger rutas
- `RegisterDto`, `LoginDto` - Validación de datos

**Flujo:**
```
1. Usuario envía email + password
2. AuthService valida credenciales
3. Hash password con bcrypt
4. Genera JWT token
5. Retorna token + datos de usuario
```

### 2. Users Module
**Responsabilidad:** Gestión de perfiles de usuario

**Endpoints:**
- `GET /users/:id` - Obtener usuario por ID
- `GET /users/handle/:handle` - Obtener usuario por @handle
- `PATCH /users/:id` - Actualizar perfil (protegido)

**Entity:**
```typescript
User {
  id, email, password, name, userHandle, avatar,
  phone, whatsappNumber, role, license, company,
  bio, experience, specialties[], ubicacion,
  isActive, isVerified, createdAt, updatedAt
}
```

### 3. Properties Module
**Responsabilidad:** Gestión de propiedades inmobiliarias

**Endpoints:**
- `GET /properties` - Listar con filtros y paginación
- `GET /properties/:id` - Detalle de propiedad
- `GET /properties/user/:userId` - Propiedades de un usuario
- `POST /properties` - Crear propiedad (protegido)
- `PATCH /properties/:id` - Actualizar (protegido, solo owner)
- `DELETE /properties/:id` - Eliminar (protegido, solo owner)
- `POST /properties/:id/like` - Like (protegido)
- `POST /properties/:id/view` - Incrementar vistas

**Entity:**
```typescript
Property {
  id, title, description, price, location,
  propertyType, images[], beds, baths, area,
  parking, yearBuilt, status, amenities[],
  features[], views, likes, userId,
  createdAt, updatedAt
}
```

**Filtros Soportados:**
- `type` - Tipo de propiedad
- `minPrice`, `maxPrice` - Rango de precio
- `location` - Ubicación (búsqueda con LIKE)
- `beds` - Número mínimo de habitaciones
- `baths` - Número mínimo de baños
- `page`, `limit` - Paginación

### 4. Requirements Module
**Responsabilidad:** Gestión de requerimientos (posts tipo Twitter)

**Endpoints:**
- `GET /requirements` - Listar con filtros y paginación
- `GET /requirements/:id` - Detalle de requerimiento
- `GET /requirements/user/:userId` - Requerimientos de un usuario
- `POST /requirements` - Crear requerimiento (protegido)
- `PATCH /requirements/:id` - Actualizar (protegido, solo owner)
- `DELETE /requirements/:id` - Eliminar (protegido, solo owner)
- `POST /requirements/:id/like` - Like (protegido)

**Entity:**
```typescript
Requirement {
  id, requirement (max 280 chars), propertyType,
  location, budget, likes, replies, userId,
  createdAt, updatedAt
}
```

### 5. Advisors Module
**Responsabilidad:** Búsqueda y listado de asesores

**Endpoints:**
- `GET /advisors` - Listar asesores con filtros
- `GET /advisors/:id` - Perfil completo del asesor
- `GET /advisors/:id/properties` - Propiedades del asesor

**Nota:** Los asesores son Users con role='agent' o 'broker'

## 🔐 Seguridad

### Autenticación JWT
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Password Hashing
```typescript
bcrypt.hash(password, 10) // 10 rounds
```

### Guards
```typescript
@UseGuards(JwtAuthGuard)  // Requiere autenticación
```

### Validación
```typescript
// DTOs con class-validator
@IsEmail()
@IsNotEmpty()
@MinLength(6)
```

### Ownership
```typescript
// Solo el owner puede editar/eliminar
if (resource.userId !== req.user.id) {
  throw new ForbiddenException();
}
```

## 🗄️ Base de Datos

### Relaciones

```
User
  ├── OneToMany → Properties
  └── OneToMany → Requirements

Property
  └── ManyToOne → User

Requirement
  └── ManyToOne → User
```

### Indexes (Recomendados)

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_handle ON users(user_handle);

-- Properties
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_created_at ON properties(created_at);

-- Requirements
CREATE INDEX idx_requirements_user_id ON requirements(user_id);
CREATE INDEX idx_requirements_created_at ON requirements(created_at);
```

## 🔄 Flujo de Datos

### Crear Propiedad
```
1. Usuario crea propiedad en app
2. App llama POST /properties
3. Backend valida DTO
4. Backend verifica JWT
5. Backend crea registro en DB
6. Backend retorna propiedad creada
7. App actualiza FeedContext
8. UI se actualiza automáticamente
```

### Listar Propiedades con Filtros
```
1. Usuario aplica filtros en app
2. App llama GET /properties?type=Casa&location=CDMX
3. Backend construye query con filtros
4. Backend ejecuta query paginada
5. Backend retorna { data, total, page, totalPages }
6. App renderiza PropertyCards
```

## 🚀 Deploy a Producción

### Opción 1: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Opción 2: Render

1. Conecta tu repo GitHub
2. Selecciona "backend" folder
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add PostgreSQL database
6. Add environment variables

### Opción 3: DigitalOcean App Platform

1. Conecta repo
2. Detecta NestJS automáticamente
3. Add managed PostgreSQL
4. Deploy

## 📊 Monitoring (Próximamente)

- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic)
- [ ] Logging (Winston + CloudWatch)
- [ ] Metrics (Prometheus + Grafana)

## 🧪 Testing (Próximamente)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 🔧 Troubleshooting

### Error: Cannot connect to database
```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Ver logs
docker logs dealclick-postgres
```

### Error: Module not found
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: Port already in use
```bash
# Cambiar puerto en .env
PORT=3001
```

## 🎯 ¡Backend completo y listo para producción!

