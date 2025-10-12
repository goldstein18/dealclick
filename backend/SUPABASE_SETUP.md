# 🗄️ Guía Completa de Supabase para DealClick

## 📋 Paso 1: Crear Proyecto en Supabase

### 1.1 Crear Cuenta
1. Ve a https://supabase.com
2. Click en "Start your project"
3. Sign in con GitHub (recomendado)

### 1.2 Crear Nuevo Proyecto
1. Click en "New Project"
2. Configurar:
   - **Name:** `dealclick`
   - **Database Password:** (Generar uno fuerte - GUÁRDALO)
   - **Region:** South America (São Paulo) - Más cercano a LATAM
   - **Pricing Plan:** Free (para empezar)
3. Click "Create new project"
4. Esperar 2-3 minutos mientras se crea

### 1.3 Obtener Credenciales
Una vez creado el proyecto:
1. Ve a **Settings** → **Database**
2. Scroll down a "Connection string"
3. Copia:
   - **Host**
   - **Database name**
   - **Port**
   - **User**
   - **Password** (el que generaste)

## 📋 Paso 2: Configurar Variables de Entorno

### 2.1 Actualizar .env

En `backend/.env`:

```env
# Application
NODE_ENV=development
PORT=3000

# Supabase Database (Reemplaza con tus credenciales)
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=TU_PASSWORD_AQUI
DB_NAME=postgres

# JWT
JWT_SECRET=dealclick-super-secret-key-change-this-in-production-123456789
JWT_EXPIRATION=30d

# CORS
CORS_ORIGIN=*
```

### 2.2 Verificar Conexión

**En Supabase:**
1. Ve a **SQL Editor**
2. Ejecuta:
```sql
SELECT version();
```
3. Deberías ver la versión de PostgreSQL

## 📋 Paso 3: Crear las Tablas

### 3.1 Ir al SQL Editor de Supabase
1. En tu proyecto de Supabase
2. Click en **SQL Editor** (menú izquierdo)
3. Click en "New query"

### 3.2 Ejecutar Script de Creación de Tablas

Copia y pega este SQL completo:

```sql
-- ============================================
-- TABLA: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_handle VARCHAR(100) UNIQUE NOT NULL,
  avatar TEXT,
  phone VARCHAR(50),
  whatsapp_number VARCHAR(50),
  role VARCHAR(50) DEFAULT 'agent',
  license VARCHAR(100),
  company VARCHAR(255),
  bio TEXT,
  experience TEXT,
  specialties TEXT[],
  ubicacion VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes para optimización
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_handle ON users(user_handle);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company);

-- ============================================
-- TABLA: properties
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  property_type VARCHAR(100) NOT NULL,
  images TEXT[] NOT NULL,
  beds INTEGER,
  baths INTEGER,
  area INTEGER,
  parking INTEGER,
  year_built INTEGER,
  status VARCHAR(50) DEFAULT 'En Venta',
  amenities TEXT[],
  features TEXT[],
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes para optimización
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);

-- ============================================
-- TABLA: requirements
-- ============================================
CREATE TABLE IF NOT EXISTS requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement TEXT NOT NULL,
  property_type VARCHAR(100),
  location VARCHAR(255),
  budget VARCHAR(100),
  likes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes para optimización
CREATE INDEX IF NOT EXISTS idx_requirements_user_id ON requirements(user_id);
CREATE INDEX IF NOT EXISTS idx_requirements_created_at ON requirements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requirements_property_type ON requirements(property_type);

-- ============================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para auto-actualizar updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_requirements_updated_at ON requirements;
CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON requirements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Verificar que todo se creó correctamente
-- ============================================
SELECT 
  table_name, 
  (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### 3.3 Ejecutar el Script
1. Click en "RUN" (o Ctrl/Cmd + Enter)
2. Deberías ver: "Success. No rows returned"
3. Verificar en la parte inferior que se crearon las 3 tablas

### 3.4 Verificar Tablas Creadas
1. Ve a **Table Editor** (menú izquierdo)
2. Deberías ver:
   - ✅ `users`
   - ✅ `properties`
   - ✅ `requirements`

## 📋 Paso 4: Insertar Datos de Prueba

### 4.1 Crear Usuario de Prueba

En SQL Editor:

```sql
-- Insertar usuario de prueba
-- Password: "test123" (ya hasheado con bcrypt)
INSERT INTO users (
  email, 
  password, 
  name, 
  user_handle, 
  phone, 
  whatsapp_number, 
  company,
  role,
  bio,
  ubicacion,
  specialties,
  avatar
) VALUES (
  'maria@dealclick.com',
  '$2b$10$YourHashedPasswordHere', -- Cambiar por hash real
  'María González',
  'mariagonzalez',
  '+56912345678',
  '56912345678',
  'RE/MAX',
  'agent',
  'Agente inmobiliaria especializada en propiedades residenciales de alto valor.',
  'CDMX',
  ARRAY['Residencial', 'Comercial'],
  'https://i.pravatar.cc/200?img=1'
);

-- Verificar que se creó
SELECT id, name, email, user_handle FROM users;
```

### 4.2 Crear Propiedades de Prueba

```sql
-- Obtener el user_id del usuario creado
DO $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid FROM users WHERE email = 'maria@dealclick.com';
  
  -- Insertar propiedades
  INSERT INTO properties (
    title, description, price, location, property_type,
    images, beds, baths, area, parking, year_built,
    amenities, features, user_id
  ) VALUES
  (
    'Casa Moderna en Las Condes',
    'Hermosa casa moderna ubicada en una de las zonas más exclusivas de Santiago.',
    '$85,000,000',
    'Las Condes, Santiago, Chile',
    'Casa',
    ARRAY[
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ],
    4, 3, 320, 2, 2022,
    ARRAY['Piscina', 'Gimnasio', 'Jardín', 'Terraza'],
    ARRAY['Pisos de mármol', 'Sistema de calefacción', 'Paneles solares'],
    user_uuid
  ),
  (
    'Departamento Premium en Providencia',
    'Departamento de lujo con vista panorámica de la ciudad.',
    '$65,000,000',
    'Providencia, Santiago, Chile',
    'Departamento',
    ARRAY[
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ],
    2, 2, 85, 1, 2023,
    ARRAY['Gimnasio', 'Seguridad 24/7', 'Terraza'],
    ARRAY['Cocina equipada', 'Closets', 'Vista panorámica'],
    user_uuid
  );
END $$;

-- Verificar propiedades
SELECT id, title, price, location FROM properties;
```

### 4.3 Crear Requerimientos de Prueba

```sql
-- Insertar requerimientos
DO $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid FROM users WHERE email = 'maria@dealclick.com';
  
  INSERT INTO requirements (
    requirement, property_type, location, budget, user_id
  ) VALUES
  (
    'Busco departamento de 2-3 dormitorios en Las Condes, presupuesto hasta $90M. ¿Alguien tiene algo disponible?',
    'Departamento',
    'Las Condes',
    'Hasta $90,000,000',
    user_uuid
  ),
  (
    'Cliente busca oficina comercial en Providencia, mínimo 100m². Zona céntrica y buena conectividad.',
    'Oficina',
    'Providencia',
    NULL,
    user_uuid
  );
END $$;

-- Verificar requerimientos
SELECT id, requirement, property_type, location FROM requirements;
```

## 📋 Paso 5: Configurar Row Level Security (RLS)

### 5.1 Habilitar RLS

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
```

### 5.2 Crear Políticas

```sql
-- ============================================
-- POLÍTICAS PARA USERS
-- ============================================

-- Todos pueden ver perfiles públicos
CREATE POLICY "Public profiles are viewable by everyone"
ON users FOR SELECT
USING (true);

-- Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid()::text = id::text);

-- ============================================
-- POLÍTICAS PARA PROPERTIES
-- ============================================

-- Todos pueden ver propiedades
CREATE POLICY "Properties are viewable by everyone"
ON properties FOR SELECT
USING (true);

-- Los usuarios autenticados pueden crear propiedades
CREATE POLICY "Authenticated users can create properties"
ON properties FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

-- Los usuarios solo pueden actualizar sus propias propiedades
CREATE POLICY "Users can update own properties"
ON properties FOR UPDATE
USING (auth.uid()::text = user_id::text);

-- Los usuarios solo pueden eliminar sus propias propiedades
CREATE POLICY "Users can delete own properties"
ON properties FOR DELETE
USING (auth.uid()::text = user_id::text);

-- ============================================
-- POLÍTICAS PARA REQUIREMENTS
-- ============================================

-- Todos pueden ver requerimientos
CREATE POLICY "Requirements are viewable by everyone"
ON requirements FOR SELECT
USING (true);

-- Los usuarios autenticados pueden crear requerimientos
CREATE POLICY "Authenticated users can create requirements"
ON requirements FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

-- Los usuarios solo pueden actualizar sus propios requerimientos
CREATE POLICY "Users can update own requirements"
ON requirements FOR UPDATE
USING (auth.uid()::text = user_id::text);

-- Los usuarios solo pueden eliminar sus propios requerimientos
CREATE POLICY "Users can delete own requirements"
ON requirements FOR DELETE
USING (auth.uid()::text = user_id::text);
```

**NOTA:** Si usas NestJS con conexión directa (no Supabase Auth), puedes deshabilitar RLS:

```sql
-- Deshabilitar RLS temporalmente para desarrollo
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE requirements DISABLE ROW LEVEL SECURITY;
```

## 📋 Paso 6: Actualizar Configuración del Backend

### 6.1 Actualizar .env

```env
# Supabase Database
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu-password-super-seguro-aqui
DB_NAME=postgres

# JWT Secret (genera uno nuevo)
JWT_SECRET=tu-super-secret-jwt-key-aqui-muy-largo-y-seguro

# Supabase (Opcional - si usas Supabase Storage para imágenes)
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_KEY=tu-service-key-aqui
```

### 6.2 Obtener las Keys de Supabase

1. Ve a **Settings** → **API**
2. Copia:
   - **Project URL:** `SUPABASE_URL`
   - **anon public:** `SUPABASE_ANON_KEY`
   - **service_role:** `SUPABASE_SERVICE_KEY` (¡No compartir!)

## 📋 Paso 7: Probar la Conexión

### 7.1 Iniciar el Backend

```bash
cd backend
npm run start:dev
```

Deberías ver:
```
🚀 DealClick API running on http://localhost:3000
```

Si hay error de conexión, verifica:
- ✅ Credenciales en .env correctas
- ✅ IP permitida en Supabase (Settings → Database → Connection pooling)

### 7.2 Registrar Usuario de Prueba

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@dealclick.com",
    "password": "test123",
    "name": "Test User",
    "userHandle": "testuser",
    "whatsappNumber": "521234567890"
  }'
```

### 7.3 Verificar en Supabase

1. Ve a **Table Editor** → **users**
2. Deberías ver el nuevo usuario creado
3. ✅ El password está hasheado
4. ✅ El id es un UUID
5. ✅ Las fechas están creadas automáticamente

### 7.4 Crear Propiedad de Prueba

```bash
# Usar el access_token del paso anterior
curl -X POST http://localhost:3000/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Casa de prueba",
    "description": "Descripción de prueba",
    "price": "$50,000,000",
    "location": "CDMX",
    "propertyType": "Casa",
    "images": ["https://example.com/img.jpg"],
    "beds": 3,
    "baths": 2,
    "area": 150
  }'
```

### 7.5 Verificar en Supabase

1. Ve a **Table Editor** → **properties**
2. Deberías ver la nueva propiedad
3. ✅ Verificar que `user_id` corresponde a tu usuario

## 📋 Paso 8: Configurar Supabase Storage (Para Imágenes)

### 8.1 Crear Bucket

1. Ve a **Storage** (menú izquierdo)
2. Click "Create bucket"
3. Configurar:
   - **Name:** `property-images`
   - **Public bucket:** ✅ (para que las imágenes sean accesibles)
4. Click "Create bucket"

### 8.2 Configurar Políticas del Bucket

```sql
-- Permitir que todos vean las imágenes
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Permitir que usuarios autenticados suban imágenes
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);
```

### 8.3 Instalar Supabase Client (Opcional)

Si quieres usar Supabase Storage desde la app:

```bash
# En el proyecto principal (no backend)
npx expo install @supabase/supabase-js
```

## 📋 Paso 9: Verificar Todo Funciona

### 9.1 Checklist

- [ ] Proyecto Supabase creado ✓
- [ ] Credenciales obtenidas ✓
- [ ] .env configurado ✓
- [ ] Tablas creadas (users, properties, requirements) ✓
- [ ] Indexes creados ✓
- [ ] Triggers de updated_at funcionando ✓
- [ ] Backend conecta a Supabase ✓
- [ ] Usuario de prueba creado ✓
- [ ] Propiedad de prueba creada ✓
- [ ] RLS configurado (opcional) ✓
- [ ] Storage bucket creado (opcional) ✓

### 9.2 Comandos de Verificación

```bash
# 1. Verificar conexión
curl http://localhost:3000/properties

# 2. Verificar autenticación
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@dealclick.com","password":"test123"}'

# 3. Verificar creación
curl -X POST http://localhost:3000/requirements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"requirement":"Test requirement"}'
```

## 📋 Paso 10: Conectar la App Móvil

### 10.1 Actualizar API URL

En `services/api.ts`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'                    // Local
  : 'https://tu-backend.railway.app';          // Producción (próximamente)
```

### 10.2 Actualizar FeedContext

```typescript
// contexts/FeedContext.tsx
import { propertiesAPI, requirementsAPI } from '../services/api';

// En el provider
useEffect(() => {
  loadDataFromAPI();
}, []);

const loadDataFromAPI = async () => {
  try {
    const [propsRes, reqsRes] = await Promise.all([
      propertiesAPI.getAll({ page: 1, limit: 20 }),
      requirementsAPI.getAll({ page: 1, limit: 20 }),
    ]);
    
    setProperties(propsRes.data);
    setRequirements(reqsRes.data);
  } catch (error) {
    console.error('Error loading:', error);
  }
};
```

## 🚀 Paso 11: Deploy del Backend (Opcional)

### Opción 1: Railway

```bash
# Install CLI
npm i -g @railway/cli

# Login
railway login

# Link proyecto
cd backend
railway init

# Deploy
railway up

# Add PostgreSQL
railway add

# Migrate a Railway Postgres
# Actualizar .env con credenciales de Railway
```

### Opción 2: Render

1. Conecta GitHub repo
2. Select "backend" service
3. Build: `npm install && npm run build`
4. Start: `npm start`
5. Add Supabase env vars

### Opción 3: Fly.io

```bash
# Install
brew install flyctl

# Auth
fly auth login

# Launch
cd backend
fly launch

# Deploy
fly deploy
```

## 📊 Monitoring en Supabase

### Dashboard
1. **Database** → Verás uso de espacio, queries, etc.
2. **API** → Verás requests en tiempo real
3. **Logs** → Logs de queries y errores

### Alertas
1. Ve a **Settings** → **Alerts**
2. Configura alertas para:
   - Database size > 80%
   - High CPU usage
   - Many failed queries

## 🔒 Seguridad en Producción

### Checklist de Seguridad

- [ ] Cambiar JWT_SECRET a algo super seguro
- [ ] Cambiar DB_PASSWORD si usas la default
- [ ] Habilitar SSL en conexión DB (Supabase lo hace por default)
- [ ] Configurar CORS correctamente (solo tu dominio)
- [ ] Habilitar RLS si usas Supabase Auth
- [ ] Nunca commitear .env al repo
- [ ] Rate limiting en endpoints públicos
- [ ] Sanitizar inputs (ya cubierto con class-validator)

## 🎯 SQL Útiles para Supabase

### Ver Estadísticas

```sql
-- Total de usuarios
SELECT COUNT(*) as total_users FROM users;

-- Total de propiedades
SELECT COUNT(*) as total_properties FROM properties;

-- Propiedades por tipo
SELECT property_type, COUNT(*) as count 
FROM properties 
GROUP BY property_type 
ORDER BY count DESC;

-- Usuarios más activos
SELECT u.name, COUNT(p.id) as properties_count
FROM users u
LEFT JOIN properties p ON u.id = p.user_id
GROUP BY u.id, u.name
ORDER BY properties_count DESC
LIMIT 10;

-- Requerimientos recientes
SELECT 
  r.requirement,
  u.name,
  r.created_at
FROM requirements r
JOIN users u ON r.user_id = u.id
ORDER BY r.created_at DESC
LIMIT 10;
```

### Limpiar Datos de Prueba

```sql
-- ¡CUIDADO! Esto elimina TODOS los datos
TRUNCATE users, properties, requirements CASCADE;
```

## ✅ ¡Todo Listo!

Tu backend NestJS ahora está completamente conectado a Supabase y listo para producción! 🎉

**URLs Importantes:**
- Supabase Dashboard: https://supabase.com/dashboard
- Tu Proyecto: https://supabase.com/dashboard/project/TU_PROJECT_ID
- API URL: http://localhost:3000 (desarrollo)

