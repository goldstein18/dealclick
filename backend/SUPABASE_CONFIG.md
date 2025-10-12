# ⚡ Configuración Rápida de Supabase - DealClick

## 🔑 Tus Credenciales de Supabase

### Project URL
```
https://nheefvchtxtetadwiwin.supabase.co
```

### Database Connection
```
Host: db.nheefvchtxtetadwiwin.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [Tu password de Supabase]
```

### API Keys
```
Publishable (anon): sb_publishable_l6Dw7FOk_Wj7UejxhMJ3lw_SLBrwpzC
Secret (service):   sb_secret_DtaTGRdp8BsnrlKAwpV3iw_gGh41bVn
```

## 📝 Paso a Paso Rápido

### 1. Crear archivo .env

```bash
cd backend
cp env.example .env
```

### 2. Editar .env con tu password

Abre `.env` y reemplaza `YOUR_DATABASE_PASSWORD_HERE` con tu password de Supabase:

```env
# Supabase Database
DB_HOST=db.nheefvchtxtetadwiwin.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=TU_PASSWORD_AQUI  # <-- Cambia esto
DB_NAME=postgres

# Supabase API
SUPABASE_URL=https://nheefvchtxtetadwiwin.supabase.co
SUPABASE_ANON_KEY=sb_publishable_l6Dw7FOk_Wj7UejxhMJ3lw_SLBrwpzC
SUPABASE_SERVICE_KEY=sb_secret_DtaTGRdp8BsnrlKAwpV3iw_gGh41bVn

# JWT Secret (genera uno seguro)
JWT_SECRET=dealclick-production-secret-$(openssl rand -base64 32)
```

### 3. Ir a Supabase SQL Editor

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto "dealclick"
3. Click en **SQL Editor** (menú izquierdo)
4. Click en **New query**

### 4. Ejecutar este SQL (Copy-Paste)

```sql
-- ============================================
-- CREAR TABLAS PRINCIPALES
-- ============================================

-- Tabla: users
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

-- Tabla: properties
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

-- Tabla: requirements
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

-- ============================================
-- CREAR INDEXES
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_handle ON users(user_handle);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Properties indexes
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- Requirements indexes
CREATE INDEX IF NOT EXISTS idx_requirements_user_id ON requirements(user_id);
CREATE INDEX IF NOT EXISTS idx_requirements_created_at ON requirements(created_at DESC);

-- ============================================
-- TRIGGERS PARA AUTO-UPDATE
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers
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
-- VERIFICAR CREACIÓN
-- ============================================

SELECT table_name, 
       (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN ('users', 'properties', 'requirements')
ORDER BY table_name;
```

### 5. Click "RUN" o presiona Ctrl+Enter

Deberías ver:
```
Success. No rows returned
```

Y en la parte inferior:
```
table_name    | columns
--------------+--------
properties    | 18
requirements  | 8
users         | 19
```

### 6. Verificar en Table Editor

1. Click en **Table Editor** (menú izquierdo)
2. Deberías ver:
   - ✅ users
   - ✅ properties
   - ✅ requirements

### 7. Deshabilitar RLS (Para desarrollo con NestJS)

```sql
-- Deshabilitar RLS para desarrollo
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE requirements DISABLE ROW LEVEL SECURITY;
```

### 8. Iniciar Backend

```bash
cd backend

# Asegúrate que .env tenga tu password de Supabase
npm run start:dev
```

Deberías ver:
```
🚀 DealClick API running on http://localhost:3000
```

### 9. Probar Registro

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@dealclick.com",
    "password": "test123",
    "name": "María González",
    "userHandle": "mariagonzalez",
    "whatsappNumber": "521234567890",
    "company": "RE/MAX"
  }'
```

Deberías recibir:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-aqui",
    "email": "maria@dealclick.com",
    "name": "María González",
    ...
  }
}
```

### 10. Verificar en Supabase

1. Ve a **Table Editor** → **users**
2. Deberías ver a María González
3. ✅ Password está hasheado
4. ✅ ID es UUID
5. ✅ Fechas creadas automáticamente

## ✅ ¡Listo!

Tu backend NestJS está conectado a Supabase y funcionando! 🎉

**URLs Importantes:**
- **Dashboard:** https://supabase.com/dashboard/project/nheefvchtxtetadwiwin
- **API URL:** https://nheefvchtxtetadwiwin.supabase.co
- **Backend Local:** http://localhost:3000

**Próximos pasos:**
1. Crear más usuarios de prueba
2. Crear propiedades
3. Probar todos los endpoints
4. Conectar la app móvil

