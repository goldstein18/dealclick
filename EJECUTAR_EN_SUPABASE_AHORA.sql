-- ============================================
-- ⚠️ EJECUTAR ESTO EN SUPABASE SQL EDITOR AHORA
-- ============================================
-- Esto arreglará el signup y la funcionalidad de ocultar
-- ============================================

-- 1. Agregar campos faltantes a la tabla users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS ubicacion VARCHAR(255),
ADD COLUMN IF NOT EXISTS specialties TEXT[];

-- 2. Agregar campo hidden a properties
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;

-- 3. Agregar campo hidden a requirements
ALTER TABLE requirements 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;

-- 4. Agregar índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_properties_hidden ON properties(hidden);
CREATE INDEX IF NOT EXISTS idx_requirements_hidden ON requirements(hidden);
CREATE INDEX IF NOT EXISTS idx_users_ubicacion ON users(ubicacion);

-- ============================================
-- VERIFICACIÓN (Ejecuta esto después)
-- ============================================
SELECT 
  table_name,
  column_name, 
  data_type
FROM information_schema.columns
WHERE table_name IN ('users', 'properties', 'requirements')
  AND column_name IN ('bio', 'ubicacion', 'specialties', 'hidden')
ORDER BY table_name, column_name;

-- Deberías ver 6 filas:
-- properties | hidden | boolean
-- requirements | hidden | boolean  
-- users | bio | text
-- users | especialties | ARRAY
-- users | ubicacion | character varying

