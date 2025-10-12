-- ============================================
-- DEALCLICK DATABASE SCHEMA
-- Para ejecutar en Supabase SQL Editor
-- ============================================

-- Limpiar tablas si existen (CUIDADO en producción)
DROP TABLE IF EXISTS requirements CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- TABLA: users
-- ============================================
CREATE TABLE users (
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

-- Indexes para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_handle ON users(user_handle);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_company ON users(company);
CREATE INDEX idx_users_ubicacion ON users(ubicacion);

-- ============================================
-- TABLA: properties
-- ============================================
CREATE TABLE properties (
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

-- Indexes para properties
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_views ON properties(views DESC);

-- ============================================
-- TABLA: requirements
-- ============================================
CREATE TABLE requirements (
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

-- Indexes para requirements
CREATE INDEX idx_requirements_user_id ON requirements(user_id);
CREATE INDEX idx_requirements_created_at ON requirements(created_at DESC);
CREATE INDEX idx_requirements_property_type ON requirements(property_type);
CREATE INDEX idx_requirements_location ON requirements(location);

-- ============================================
-- TRIGGERS PARA AUTO-UPDATE DE updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers a todas las tablas
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON requirements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DESHABILITAR RLS (Para usar con NestJS JWT)
-- ============================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE requirements DISABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

SELECT 
  table_name, 
  (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN ('users', 'properties', 'requirements')
ORDER BY table_name;
